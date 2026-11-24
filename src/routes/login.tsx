import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2, ShieldCheck, UserCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { UserRole } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — IdleSpace" },
      { name: "description", content: "Sign in to your IdleSpace account." },
      { property: "og:title", content: "Sign in — IdleSpace" },
      { property: "og:description", content: "Sign in to your IdleSpace account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { signIn, signInWithOAuth, signInAsDemo, user, loading } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect based on role
  if (!loading && user) {
    if (user.role === "host") return <Navigate to="/host/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (!error) {
      navigate({ to: "/dashboard" });
    }
  };

  const handleDemoSignIn = (role: UserRole) => {
    signInAsDemo(role);
    if (role === "host") {
      navigate({ to: "/host/dashboard" });
    } else if (role === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setForgotSent(true);
    toast.success("Password reset instructions simulated to " + forgotEmail);
    setTimeout(() => {
      setForgotOpen(false);
      setForgotSent(false);
      setForgotEmail("");
    }, 2000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand Hero Side */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 gradient-primary animate-gradient" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white, transparent 40%), radial-gradient(circle at 80% 70%, white, transparent 40%)",
          }}
        />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">IdleSpace</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight">Every space has a second life.</h2>
            <p className="mt-3 text-white/80 max-w-md text-base leading-relaxed">
              Join thousands of businesses unlocking flexible revenue from spaces sitting idle, and bookers finding perfect venues on demand.
            </p>
          </div>
          <div className="text-xs text-white/60">© 2026 IdleSpace Inc. All rights reserved.</div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">IdleSpace</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to access your bookings, spaces, or admin panel.
          </p>

          {/* Quick Demo Login Picker */}
          <div className="mt-6 p-4 rounded-2xl bg-secondary/60 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> 1-Click Demo Profiles:
              </span>
              <span className="text-[10px] text-primary font-medium">Instant Test</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-xs hover:border-primary font-medium"
                onClick={() => handleDemoSignIn("booker")}
              >
                <UserCheck className="h-3.5 w-3.5 mr-1 text-primary" /> Booker
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-xs hover:border-primary font-medium"
                onClick={() => handleDemoSignIn("host")}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1 text-accent" /> Host
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-xs hover:border-primary font-medium"
                onClick={() => handleDemoSignIn("admin")}
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Admin
              </Button>
            </div>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">OR SIGN IN WITH EMAIL</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="ada@idlespace.demo or your@email.com"
                className="mt-1.5 h-11 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" /> Reset password
                      </DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    {forgotSent ? (
                      <div className="p-4 rounded-xl bg-success/10 text-success text-sm font-medium text-center">
                        ✓ Password reset link sent! Please check your inbox.
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-4 mt-2">
                        <div>
                          <Label htmlFor="forgot-email">Email</Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="you@domain.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="mt-1.5 rounded-xl"
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="w-full gradient-primary text-white rounded-xl shadow-elegant"
                          >
                            Send Reset Link
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-xl pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 gradient-primary text-white shadow-elegant hover:opacity-95 rounded-xl text-sm font-medium mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
