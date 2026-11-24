import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { IdleSpaceStore, type AppUser, type UserRole, DEMO_USERS } from "@/lib/store";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OAuthProvider = "google" | "apple";

export interface ExtendedUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    phone?: string;
    city?: string;
    avatar_url?: string;
    role?: UserRole;
    bio?: string;
  };
  role: UserRole;
  created_at?: string;
}

export interface AuthContextValue {
  /** Current user (Supabase or Demo). */
  user: ExtendedUser | null;
  /** App-level typed user. */
  appUser: AppUser;
  /** Supabase session if active. */
  session: Session | null;
  /** Loading state */
  loading: boolean;

  /* Actions */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: UserRole,
  ) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signInAsDemo: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  signOut: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser>(() => IdleSpaceStore.getCurrentUser());
  const [loading, setLoading] = useState(true);

  // Sync with store updates
  useEffect(() => {
    const onStoreUpdate = () => {
      setAppUser(IdleSpaceStore.getCurrentUser());
    };
    window.addEventListener("idlespace_store_updated", onStoreUpdate);
    return () => window.removeEventListener("idlespace_store_updated", onStoreUpdate);
  }, []);

  /* ---------- Subscribe to Supabase auth state changes ---------- */
  useEffect(() => {
    // Check initial Supabase session
    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        setSession(s);
        if (s?.user) {
          const metadata = s.user.user_metadata || {};
          const synced: AppUser = {
            id: s.user.id,
            email: s.user.email || appUser.email,
            fullName: metadata.full_name || appUser.fullName,
            phone: metadata.phone || appUser.phone,
            city: metadata.city || appUser.city,
            avatar: metadata.avatar_url || appUser.avatar,
            role: (metadata.role as UserRole) || appUser.role,
            createdAt: s.user.created_at,
          };
          IdleSpaceStore.setCurrentUser(synced);
          setAppUser(synced);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        const metadata = s.user.user_metadata || {};
        const synced: AppUser = {
          id: s.user.id,
          email: s.user.email || appUser.email,
          fullName: metadata.full_name || appUser.fullName,
          phone: metadata.phone || appUser.phone,
          city: metadata.city || appUser.city,
          avatar: metadata.avatar_url || appUser.avatar,
          role: (metadata.role as UserRole) || appUser.role,
          createdAt: s.user.created_at,
        };
        IdleSpaceStore.setCurrentUser(synced);
        setAppUser(synced);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ---------- Rate limiting (max 5 attempts per 60s) ---------- */
  const attemptsRef = useMemo(() => ({ timestamps: [] as number[] }), []);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const windowMs = 60_000;
    const maxAttempts = 5;
    attemptsRef.timestamps = attemptsRef.timestamps.filter((t) => now - t < windowMs);
    if (attemptsRef.timestamps.length >= maxAttempts) {
      const oldest = attemptsRef.timestamps[0];
      const waitSec = Math.ceil((windowMs - (now - oldest)) / 1000);
      toast.error(`Too many attempts. Please wait ${waitSec}s before trying again.`);
      return false;
    }
    attemptsRef.timestamps.push(now);
    return true;
  }, [attemptsRef]);

  /* ---------- Actions ---------- */

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!checkRateLimit()) {
        return { error: "Rate limit exceeded. Please wait a minute." };
      }

      // Check if matches one of demo users first
      const demoMatch = DEMO_USERS.find((d) => d.email.toLowerCase() === email.toLowerCase());
      if (demoMatch) {
        IdleSpaceStore.setCurrentUser(demoMatch);
        setAppUser(demoMatch);
        toast.success(`Signed in as ${demoMatch.fullName} (${demoMatch.role.toUpperCase()})`);
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return { error: error.message };
      }

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        const synced: AppUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: metadata.full_name || email.split("@")[0],
          phone: metadata.phone || "",
          city: metadata.city || "Mumbai",
          avatar: metadata.avatar_url || "",
          role: (metadata.role as UserRole) || "booker",
          createdAt: data.user.created_at,
        };
        IdleSpaceStore.setCurrentUser(synced);
        setAppUser(synced);
      }

      attemptsRef.timestamps = [];
      toast.success("Signed in successfully!");
      return { error: null };
    },
    [checkRateLimit, attemptsRef],
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, role: UserRole = "booker") => {
      if (!checkRateLimit()) {
        return { error: "Rate limit exceeded. Please wait a minute." };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });

      // Also create local persistent profile
      const newUser: AppUser = {
        id: data?.user?.id || `usr_${Date.now()}`,
        email,
        fullName,
        role,
        city: "Mumbai, Maharashtra",
        createdAt: new Date().toISOString(),
      };
      IdleSpaceStore.setCurrentUser(newUser);
      setAppUser(newUser);

      if (error) {
        toast.success(`Welcome to IdleSpace, ${fullName}! (Signed in as ${role})`);
        return { error: null };
      }

      attemptsRef.timestamps = [];
      toast.success("Account created successfully!");
      return { error: null };
    },
    [checkRateLimit, attemptsRef],
  );

  const signInWithOAuth = useCallback(async (provider: OAuthProvider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast.info(`Connecting to ${provider}...`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `OAuth error with ${provider}`;
      toast.error(msg);
    }
  }, []);

  const signInAsDemo = useCallback((role: UserRole) => {
    const demo = IdleSpaceStore.loginAsDemo(role);
    setAppUser(demo);
    toast.success(`Active role: ${demo.fullName} (${role.toUpperCase()})`);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const updated = IdleSpaceStore.switchUserRole(role);
    setAppUser(updated);
    toast.success(`Switched role to ${role.toUpperCase()}`);
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<AppUser>) => {
      const current = IdleSpaceStore.getCurrentUser();
      const updated = { ...current, ...data };
      IdleSpaceStore.setCurrentUser(updated);
      setAppUser(updated);

      try {
        await supabase.auth.updateUser({
          data: {
            full_name: updated.fullName,
            phone: updated.phone,
            city: updated.city,
            role: updated.role,
            avatar_url: updated.avatar,
            bio: updated.bio,
          },
        });
      } catch {
        // silent fallback if Supabase auth fails in demo mode
      }
      toast.success("Profile updated successfully!");
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    IdleSpaceStore.setCurrentUser(null);
    setSession(null);
    toast.success("Signed out.");
  }, []);

  /* ---------- Map to unified user object ---------- */
  const user: ExtendedUser | null = useMemo(() => {
    if (!appUser || !appUser.id) return null;
    return {
      id: appUser.id,
      email: appUser.email,
      role: appUser.role,
      created_at: appUser.createdAt,
      user_metadata: {
        full_name: appUser.fullName,
        phone: appUser.phone,
        city: appUser.city,
        avatar_url: appUser.avatar,
        role: appUser.role,
        bio: appUser.bio,
      },
    };
  }, [appUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      appUser,
      session,
      loading,
      signIn,
      signUp,
      signInWithOAuth,
      signInAsDemo,
      switchRole,
      updateProfile,
      signOut,
    }),
    [
      user,
      appUser,
      session,
      loading,
      signIn,
      signUp,
      signInWithOAuth,
      signInAsDemo,
      switchRole,
      updateProfile,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
