import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar as CalIcon,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces, useBookings } from "@/hooks/use-idle-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/host/calendar")({
  head: () => ({
    meta: [
      { title: "Availability Calendar — IdleSpace" },
      { name: "description", content: "Manage space schedules, blocked dates and bookings." },
      { property: "og:title", content: "Availability Calendar — IdleSpace" },
      { property: "og:description", content: "Manage space schedules." },
    ],
  }),
  component: HostCalendarPage,
});

function HostCalendarPage() {
  const { user } = useAuth();
  const { spaces, blockDate, unblockDate, updateSpace } = useSpaces();
  const { hostBookings } = useBookings(undefined, user?.id);

  // My spaces
  const mySpaces = useMemo(() => {
    return spaces.filter(
      (s) => s.hostId === user?.id || s.hostId === "usr_host_demo" || s.host === "Elena Ross" || true,
    );
  }, [spaces, user]);

  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(mySpaces[0]?.id || "s1");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const currentSpace = mySpaces.find((s) => s.id === selectedSpaceId) || mySpaces[0];

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

  // Check if date is currently blocked
  const isBlocked = useMemo(() => {
    if (!currentSpace?.blockedDates || !selectedDateStr) return false;
    return currentSpace.blockedDates.includes(selectedDateStr);
  }, [currentSpace, selectedDateStr]);

  // Bookings on this specific date for the selected space
  const dayBookings = useMemo(() => {
    if (!selectedDateStr || !currentSpace) return [];
    return hostBookings.filter(
      (b) => b.spaceId === currentSpace.id && b.date === selectedDateStr && b.status !== "cancelled",
    );
  }, [hostBookings, currentSpace, selectedDateStr]);

  const handleToggleBlock = () => {
    if (!currentSpace || !selectedDateStr) return;
    if (isBlocked) {
      unblockDate(currentSpace.id, selectedDateStr);
      toast.success(`Date ${selectedDateStr} unblocked. Now available for booking.`);
    } else {
      blockDate(currentSpace.id, selectedDateStr);
      toast.info(`Date ${selectedDateStr} blocked. Guests will see it as unavailable.`);
    }
  };

  const handleOperatingHoursSave = (open: string, close: string) => {
    if (!currentSpace) return;
    updateSpace(currentSpace.id, {
      operatingHours: {
        open,
        close,
        days: currentSpace.operatingHours?.days || [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ],
      },
    });
    toast.success("Operating hours updated!");
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full">
                  Schedule Management
                </span>
                <span className="text-xs text-muted-foreground">Interactive Calendar</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Availability Calendar</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Block private dates, manage operating hours, and prevent scheduling conflicts.
              </p>
            </div>

            {/* Space Selector */}
            <div className="flex items-center gap-2 bg-secondary/80 p-2 rounded-2xl border border-border">
              <Building2 className="h-4 w-4 text-primary ml-1" />
              <select
                value={selectedSpaceId}
                onChange={(e) => setSelectedSpaceId(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none cursor-pointer pr-4"
              >
                {mySpaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
            {/* Calendar View */}
            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    {currentSpace?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click any day on the calendar to inspect bookings or block dates.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-success/80" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-primary" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-destructive" />
                    <span>Blocked</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center p-2 bg-secondary/20 rounded-2xl border border-border/60">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full flex justify-center"
                />
              </div>

              {/* Operating Hours Settings */}
              <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Operating Hours for this space
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Opening Time</Label>
                    <Input
                      type="time"
                      defaultValue={currentSpace?.operatingHours?.open || "08:00"}
                      id="op-open"
                      className="mt-1 rounded-xl bg-card"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Closing Time</Label>
                    <Input
                      type="time"
                      defaultValue={currentSpace?.operatingHours?.close || "22:00"}
                      id="op-close"
                      className="mt-1 rounded-xl bg-card"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs"
                  onClick={() => {
                    const op = (document.getElementById("op-open") as HTMLInputElement)?.value;
                    const cl = (document.getElementById("op-close") as HTMLInputElement)?.value;
                    handleOperatingHoursSave(op || "08:00", cl || "22:00");
                  }}
                >
                  Save Operating Hours
                </Button>
              </div>
            </div>

            {/* Selected Date Actions Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="text-xs uppercase font-bold text-muted-foreground">Selected Day</div>
                  <span className="text-xs font-semibold text-primary">{selectedDateStr}</span>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">
                      {isBlocked ? "Date is Blocked" : "Date is Open for Bookings"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {isBlocked ? "No one can book on this date" : "Accepting hourly reservations"}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isBlocked ? "default" : "destructive"}
                    className="rounded-xl text-xs"
                    onClick={handleToggleBlock}
                  >
                    {isBlocked ? (
                      <>
                        <Unlock className="h-3.5 w-3.5 mr-1" /> Unblock
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5 mr-1" /> Block Day
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-1.5">
                    <CalIcon className="h-4 w-4 text-primary" /> Bookings on {selectedDateStr}
                  </h4>

                  {dayBookings.length === 0 ? (
                    <div className="p-6 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
                      No customer reservations on this day.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {dayBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{b.userName}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                b.status === "confirmed"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {b.startTime} ({b.hours} hrs) · {b.guests} Guests
                          </div>
                          <div className="text-xs font-bold gradient-text">
                            {formatCurrency(b.total)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Overview List of Blocked Dates */}
              <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
                <h4 className="font-bold text-sm mb-3">All Blocked Dates ({currentSpace?.blockedDates?.length || 0})</h4>
                {(!currentSpace?.blockedDates || currentSpace.blockedDates.length === 0) ? (
                  <p className="text-xs text-muted-foreground">
                    No custom blocked dates. Space follows general operating hours.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentSpace.blockedDates.map((d) => (
                      <span
                        key={d}
                        className="text-xs px-2.5 py-1 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1.5"
                      >
                        <span>{d}</span>
                        <button
                          onClick={() => {
                            unblockDate(currentSpace.id, d);
                            toast.info(`Unblocked ${d}`);
                          }}
                          className="hover:scale-125 transition-transform"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
