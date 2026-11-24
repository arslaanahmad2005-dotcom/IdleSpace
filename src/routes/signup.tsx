import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight, Loader2, Eye, EyeOff, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { UserRole } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — IdleSpace" },
      { name: "description", content: "Create your IdleSpace account and start booking or hosting spaces by the hour." },
      { property: "og:title", content: "Create account — IdleSpace" },
      { property: "og:description", content: "Book or host spaces by the hour." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<UserRole>("booker");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { signUp, signInAsDemo, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (!loading && user) {
    if (user.role === "host") return <Navigate to="/host/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error } = await signUp(email.trim(), password, name.trim(), role);
    setSubmitting(false);

    if (!error) {
      if (role === "host") {
        navigate({ to: "/host/dashboard" });
      } else {
        navigate({ to: "/dashboard" });
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1 bg-background">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">IdleSpace</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Join the premier marketplace for booking and hosting spaces.
          </p>

          {/* Role Selection Tabs */}
          <div className="mt-6">
            <Label className="text-xs uppercase text-muted-foreground font-semibold">I want to:</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("booker")}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  role === "booker"
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <div className={`p-2 rounded-xl ${role === "booker" ? "gradient-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Book Spaces</div>
                  <div className="text-xs text-muted-foreground">Find & reserve hourly venues</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("host")}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  role === "host"
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <div className={`p-2 rounded-xl ${role === "host" ? "gradient-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Host Spaces</div>
                  <div className="text-xs text-muted-foreground">Monetize your unused space</div>
                </div>
              </button>
            </div>
          </div>

          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="Ada Lovelace"
                className="mt-1.5 h-11 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="ada@example.com"
                className="mt-1.5 h-11 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="6+ characters"
                    className="h-11 rounded-xl pr-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm">Confirm</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    className="h-11 rounded-xl"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 gradient-primary text-white shadow-elegant hover:opacity-95 rounded-xl font-medium mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating account…
                </>
              ) : (
                <>
                  Create {role === "host" ? "Host" : "Booker"} Account <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Side */}
      <div className="relative hidden lg:block overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 gradient-primary animate-gradient" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, white, transparent 40%), radial-gradient(circle at 30% 80%, white, transparent 40%)",
          }}
        />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="text-xs uppercase tracking-widest text-white/70">Welcome to IdleSpace</div>
          <div>
            <h2 className="text-4xl font-bold leading-tight">Turn idle hours into recurring income.</h2>
            <p className="mt-4 text-white/80 max-w-md text-base leading-relaxed">
              Whether you have a commercial kitchen, high-rise meeting loft, or photographic studio, list it in minutes and start receiving bookings.
            </p>
          </div>
          <div className="text-xs text-white/60">Protected by PCI-compliant payments & ₹8.3 Cr host guarantee.</div>
        </div>
      </div>
    </div>
  );
}
