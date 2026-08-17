import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OAuthProvider = "google" | "apple";

export interface AuthContextValue {
  /** Current Supabase user (null when logged out). */
  user: User | null;
  /** Current Supabase session (null when logged out). */
  session: Session | null;
  /** True while we're still checking the initial session on mount. */
  loading: boolean;

  /* Auth actions */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Subscribe to auth state changes ---------- */
  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
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
    // Filter timestamps within the rolling window
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

  const signIn = useCallback(async (email: string, password: string) => {
    if (!checkRateLimit()) {
      return { error: "Rate limit exceeded. Please wait a minute." };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return { error: error.message };
    }
    attemptsRef.timestamps = []; // Clear on success
    toast.success("Signed in successfully!");
    return { error: null };
  }, [checkRateLimit, attemptsRef]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!checkRateLimit()) {
        return { error: "Rate limit exceeded. Please wait a minute." };
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        toast.error(error.message);
        return { error: error.message };
      }
      attemptsRef.timestamps = []; // Clear on success
      toast.success("Account created! Check your email to confirm.");
      return { error: null };
    },
    [checkRateLimit, attemptsRef],
  );

  const signInWithOAuth = useCallback(async (provider: OAuthProvider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out.");
    }
  }, []);

  /* ---------- Memoised value ---------- */

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, signIn, signUp, signInWithOAuth, signOut }),
    [user, session, loading, signIn, signUp, signInWithOAuth, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
