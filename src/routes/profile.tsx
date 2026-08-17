import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Mail, Phone, MapPin, Camera, Star, Loader2, Download, Trash2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { REVIEWS } from "@/lib/dummy-data";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — IdleSpace" },
      { name: "description", content: "Manage your personal info, payment methods and reviews." },
      { property: "og:title", content: "Your profile — IdleSpace" },
      { property: "og:description", content: "Your IdleSpace profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const meta = user?.user_metadata ?? {};
  const [fullName, setFullName] = useState((meta.full_name as string) ?? "");
  const [phone, setPhone] = useState((meta.phone as string) ?? "");
  const [city, setCity] = useState((meta.city as string) ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const userEmail = user?.email ?? "";
  const initials =
    fullName
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ??
    userEmail.slice(0, 2).toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, phone, city },
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated!");
    }
  };

  const handleExportData = () => {
    const exportPayload = {
      id: user?.id,
      email: user?.email,
      fullName,
      phone,
      city,
      createdAt: user?.created_at,
      lastSignInAt: user?.last_sign_in_at,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `idlespace-personal-data-${user?.id ?? "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Personal data archive downloaded.");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    // Anonymize/wipe user metadata
    await supabase.auth.updateUser({
      data: { full_name: null, phone: null, city: null, deleted_at: new Date().toISOString() },
    });
    await signOut();
    setDeleting(false);
    toast.success("Account and personal data have been removed.");
    navigate({ to: "/" });
  };

  return (
    <ProtectedRoute>
    <SiteLayout>
      <PageHeader eyebrow="Profile" title="Your profile" subtitle="Personal info, payment methods and reviews." />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
          <div className="rounded-3xl bg-card border border-border p-6 text-center h-fit">
            <div className="relative mx-auto w-28 h-28">
              <div className="h-28 w-28 rounded-full gradient-primary grid place-items-center text-white text-2xl font-bold">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full gradient-primary grid place-items-center text-white shadow-elegant">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{fullName || "User"}</h2>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
            <div className="mt-4 flex items-center justify-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-warning text-warning" /> 4.9 · 23 reviews
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Personal information</h3>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 rounded-xl" /></div>
                <div><Label>Email</Label><Input value={userEmail} disabled className="mt-1.5 rounded-xl opacity-60" /></div>
                <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 rounded-xl" /></div>
                <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5 rounded-xl" /></div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="gradient-primary text-white" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save
                </Button>
                <Button variant="outline" onClick={() => { setFullName((meta.full_name as string) ?? ""); setPhone((meta.phone as string) ?? ""); setCity((meta.city as string) ?? ""); }}>Reset</Button>
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Payment methods</h3>
              <div className="mt-4 space-y-2">
                {[
                  { brand: "Visa", last4: "4421", exp: "12/28" },
                  { brand: "Mastercard", last4: "1187", exp: "09/27" },
                ].map((c) => (
                  <div key={c.last4} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded-lg gradient-primary grid place-items-center text-white text-xs font-bold">{c.brand[0]}</div>
                      <div>
                        <div className="text-sm font-semibold">{c.brand} •••• {c.last4}</div>
                        <div className="text-xs text-muted-foreground">Expires {c.exp}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2"><CreditCard className="h-4 w-4 mr-2" /> Add card</Button>
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Your reviews</h3>
              <div className="mt-4 space-y-3">
                {REVIEWS.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-secondary/50">
                    <div className="text-sm font-semibold">{r.author}</div>
                    <div className="flex gap-0.5 text-warning mt-1">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Settings</h3>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { icon: Mail, label: "Email notifications", desc: "Booking updates and receipts" },
                  { icon: Phone, label: "SMS alerts", desc: "Reminders and confirmations" },
                  { icon: MapPin, label: "Location services", desc: "Get better recommendations" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <s.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                    </div>
                    <div className="h-6 w-10 rounded-full gradient-primary p-0.5 flex items-center">
                      <div className="h-5 w-5 rounded-full bg-white ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy, Data Export & Deletion (GDPR / CCPA) */}
            <section className="rounded-3xl bg-card border border-destructive/20 p-6">
              <h3 className="font-semibold text-destructive">Privacy & Data Management</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Export a copy of your personal data archive or request account deletion.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="outline" className="rounded-xl text-xs" onClick={handleExportData}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export my data
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="rounded-xl text-xs">
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete account & personal data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will anonymize your profile data, remove your phone number, city, and full name, and sign you out permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                        disabled={deleting}
                      >
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Confirm Deletion
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </section>
          </div>
        </div>
      </div>
    </SiteLayout>
    </ProtectedRoute>
  );
}
