import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Camera,
  Star,
  Loader2,
  Download,
  Trash2,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — IdleSpace" },
      {
        name: "description",
        content: "Manage your personal info, account roles and preferences.",
      },
      { property: "og:title", content: "Your profile — IdleSpace" },
      { property: "og:description", content: "Your IdleSpace profile." },
    ],
  }),
  component: Profile,
});

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
];

function Profile() {
  const { user, appUser, updateProfile, switchRole, signOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(appUser?.fullName || user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(appUser?.phone || user?.user_metadata?.phone || "");
  const [city, setCity] = useState(appUser?.city || user?.user_metadata?.city || "Mumbai, Maharashtra");
  const [bio, setBio] = useState(appUser?.bio || "");
  const [avatar, setAvatar] = useState(appUser?.avatar || AVATAR_PRESETS[0]);
  const [role, setRole] = useState<UserRole>(appUser?.role || "booker");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      bio: bio.trim(),
      avatar,
      role,
    });
    setSaving(false);
  };

  const handleExportData = () => {
    const exportPayload = {
      id: user?.id,
      email: user?.email,
      fullName,
      phone,
      city,
      bio,
      role,
      avatar,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `idlespace-profile-archive-${user?.id || "data"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Profile data archive downloaded.");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await signOut();
    setDeleting(false);
    toast.success("Account and session wiped.");
    navigate({ to: "/" });
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <PageHeader
          eyebrow="Account Settings"
          title="Personal Profile"
          subtitle="Manage your identity, role permissions, and notification preferences."
        />

        <div className="mx-auto max-w-4xl px-4 pb-24">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar & Persona Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-soft flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={avatar}
                  alt={fullName}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl font-bold text-foreground">{fullName || "Your Name"}</h2>
                  <span className="text-xs font-bold uppercase tracking-wider gradient-primary text-white px-2.5 py-0.5 rounded-full">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{user?.email}</p>

                {/* Choose Avatar Preset */}
                <div className="pt-2">
                  <span className="text-xs text-muted-foreground block mb-1.5">Choose Avatar:</span>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`h-9 w-9 rounded-full overflow-hidden border-2 transition-all ${
                          avatar === preset ? "border-primary scale-110 shadow-sm" : "border-transparent opacity-60"
                        }`}
                      >
                        <img src={preset} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Permissions Selection */}
            <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-soft space-y-4">
              <div>
                <h3 className="font-bold text-lg">Account Mode & Role</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select your primary platform experience. You can switch personas anytime.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("booker")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    role === "booker"
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <User className="h-5 w-5 text-primary mb-2" />
                  <div className="font-bold text-sm">Booker Persona</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Browse spaces, book hourly, leave reviews.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("host")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    role === "host"
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <Building2 className="h-5 w-5 text-accent mb-2" />
                  <div className="font-bold text-sm">Host Persona</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    List unused spaces, approve requests, earn payouts.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    role === "admin"
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
                  <div className="font-bold text-sm">Admin Persona</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Moderate listings, view platform metrics.
                  </div>
                </button>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-soft space-y-4">
              <h3 className="font-bold text-lg">Contact Information</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-name">Full Name</Label>
                  <Input
                    id="p-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 rounded-xl h-11"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="p-email">Email Address</Label>
                  <Input
                    id="p-email"
                    value={user?.email || ""}
                    disabled
                    className="mt-1.5 rounded-xl h-11 bg-secondary/50 text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-phone">Phone Number</Label>
                  <Input
                    id="p-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 rounded-xl h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="p-city">City & Region</Label>
                  <Input
                    id="p-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 rounded-xl h-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="p-bio">Bio / Business Description</Label>
                <Textarea
                  id="p-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio with hosts or guests..."
                  className="mt-1.5 rounded-xl min-h-24"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="gradient-primary text-white shadow-elegant rounded-xl px-8"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving Changes…
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </div>
            </div>

            {/* Privacy & Account Operations */}
            <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-soft flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm">Data Privacy & Archival</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download a complete copy of your reservations, ratings, and profile settings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportData}
                  className="rounded-xl text-xs"
                >
                  <Download className="h-4 w-4 mr-1.5" /> Export Data
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-xl text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete IdleSpace Account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will clear your local sessions and wipe personal profile data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="rounded-xl bg-destructive text-white"
                      >
                        Yes, Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
