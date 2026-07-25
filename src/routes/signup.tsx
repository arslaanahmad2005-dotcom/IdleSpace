import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white"><Sparkles className="h-4 w-4" /></div>
            <span className="text-lg font-bold">IdleSpace</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Start booking spaces in under 60 seconds.</p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 rounded-xl">Google</Button>
            <Button variant="outline" className="h-11 rounded-xl">Apple</Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Ada Lovelace" className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="pw2">Confirm</Label>
                <Input id="pw2" type="password" className="mt-1.5 h-11 rounded-xl" />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-1" />
              <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </Label>
            </div>
            <Button className="w-full h-11 rounded-xl gradient-primary text-white shadow-elegant">
              Create account <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 gradient-mesh animate-gradient" />
        <div className="absolute inset-0 grid place-items-center p-12">
          <div className="max-w-md text-center">
            <div className="mx-auto h-24 w-24 rounded-3xl gradient-primary grid place-items-center shadow-glow animate-float">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-8 text-3xl font-bold tracking-tight">Unlock the world's spare hours.</h2>
            <p className="mt-3 text-muted-foreground">Join a community of hosts and guests reimagining what "closed" means.</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {["12.4k spaces", "84 cities", "5.0★ avg"].map((t) => (
                <div key={t} className="glass rounded-xl p-3 text-xs font-medium">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
