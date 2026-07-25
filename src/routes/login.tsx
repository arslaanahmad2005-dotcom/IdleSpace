import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 gradient-primary animate-gradient" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white, transparent 40%), radial-gradient(circle at 80% 70%, white, transparent 40%)" }} />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">IdleSpace</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight">Every space has a second life.</h2>
            <p className="mt-3 text-white/80 max-w-md">Join thousands of businesses unlocking new revenue from spaces sitting empty.</p>
          </div>
          <div className="text-xs text-white/60">© 2026 IdleSpace</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white"><Sparkles className="h-4 w-4" /></div>
            <span className="text-lg font-bold">IdleSpace</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to continue to your dashboard.</p>

          <div className="mt-8 space-y-3">
            <Button variant="outline" className="w-full rounded-xl h-11">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.6 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6C12.2 13.3 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z"/><path fill="#FBBC05" d="M10.3 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.8-6C.9 16.7 0 20.2 0 24s.9 7.3 2.5 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2.1 15.2-5.6l-7.3-5.7c-2 1.4-4.6 2.3-7.9 2.3-6.4 0-11.8-3.8-13.7-9.1l-7.8 6C6.4 42.6 14.6 48 24 48z"/></svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full rounded-xl h-11">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pw">Password</Label>
                <Link to="/login" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative mt-1.5">
                <Input id="pw" type={show ? "text" : "password"} placeholder="••••••••" className="h-11 rounded-xl pr-10" />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
            </div>
            <Button className="w-full h-11 rounded-xl gradient-primary text-white shadow-elegant hover:opacity-95">
              Sign in <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            New to IdleSpace? <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
