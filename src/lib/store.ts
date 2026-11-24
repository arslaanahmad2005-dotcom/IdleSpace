import type { Space } from "./dummy-data";
import { SPACES as INITIAL_SPACES, BOOKINGS as INITIAL_BOOKINGS, NOTIFICATIONS as INITIAL_NOTIFICATIONS, REVIEWS as INITIAL_REVIEWS } from "./dummy-data";

/* ========================================================================== */
/*  Entity Types                                                              */
/* ========================================================================== */

export type UserRole = "booker" | "host" | "admin";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  createdAt: string;
}

export interface SpaceListing extends Space {
  spaceType?: string;
  area?: string;
  address?: string;
  dailyPrice?: number;
  sizeSqFt?: number;
  minDuration?: number;
  maxDuration?: number;
  hostId?: string;
  rules?: string[];
  cancellationPolicy?: "flexible" | "moderate" | "strict";
  operatingHours?: {
    open: string;
    close: string;
    days: string[];
  };
  blockedDates?: string[];
  status?: "active" | "paused" | "pending_approval" | "flagged" | "inactive";
}

export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled" | "completed" | "upcoming";

export interface Booking {
  id: string;
  spaceId: string;
  spaceTitle: string;
  spaceImage: string;
  spaceCity: string;
  spaceCategory: string;
  userId: string;
  userName: string;
  userEmail: string;
  hostId: string;
  hostName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "14:00" or "2:00 PM"
  endTime: string; // e.g. "18:00" or "6:00 PM"
  hours: number;
  guests: number;
  hourlyPrice: number;
  subtotal: number;
  platformFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: "upi" | "card" | "venue";
  paymentStatus: "paid" | "pending";
  status: BookingStatus;
  cancellationReason?: string;
  createdAt: string;
  reviewed?: boolean;
}

export interface Review {
  id: string;
  spaceId: string;
  bookingId?: string;
  userId: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  body: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: "success" | "info" | "warning" | "error";
  link?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  spaceId: string;
  spaceTitle: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: "pending" | "resolved" | "dismissed";
}

/* ========================================================================== */
/*  Initial Seed Data                                                         */
/* ========================================================================== */

export const DEMO_USERS: AppUser[] = [
  {
    id: "usr_booker_demo",
    email: "ada@idlespace.demo",
    fullName: "Ada Lovelace",
    phone: "+91 98765 43210",
    city: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "booker",
    bio: "Product designer and event organizer searching for unique spaces for workshops and offsites.",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "usr_host_demo",
    email: "elena@idlespace.demo",
    fullName: "Elena Ross",
    phone: "+91 98111 22334",
    city: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    role: "host",
    bio: "Superhost running boutique creative studios and collaborative event spaces across Mumbai.",
    createdAt: "2026-01-10T08:30:00Z",
  },
  {
    id: "usr_admin_demo",
    email: "admin@idlespace.com",
    fullName: "Platform Admin",
    phone: "+91 99000 88776",
    city: "Bangalore, Karnataka",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    role: "admin",
    bio: "IdleSpace platform trust, safety, and operations administrator.",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

const INITIAL_EXTENDED_SPACES: SpaceListing[] = INITIAL_SPACES.map((s, idx) => ({
  ...s,
  spaceType: idx % 2 === 0 ? "Indoor Studio" : "Commercial Venue",
  area: s.city.split(",")[0] || "Downtown",
  address: `Plot ${10 + idx * 4}, Sector ${idx + 2}, ${s.city}`,
  dailyPrice: Math.round(s.price * 6.5),
  sizeSqFt: 350 + idx * 180,
  minDuration: 1,
  maxDuration: 12,
  hostId: idx === 0 || idx === 2 ? "usr_host_demo" : `host_${idx}`,
  rules: [
    "No smoking or open flames indoors",
    "Return furniture to original setup before departure",
    "Respect noise curfews after 10:00 PM",
    "Dispose of catering waste in designated bins",
  ],
  cancellationPolicy: idx % 3 === 0 ? "flexible" : idx % 3 === 1 ? "moderate" : "strict",
  operatingHours: {
    open: "08:00",
    close: "22:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  blockedDates: idx === 0 ? ["2026-11-28", "2026-12-05"] : [],
  status: "active",
}));

const INITIAL_DETAILED_BOOKINGS: Booking[] = [
  {
    id: "IS-9041",
    spaceId: "s1",
    spaceTitle: "Skyline Rooftop Studio",
    spaceImage: INITIAL_SPACES[0].image,
    spaceCity: INITIAL_SPACES[0].city,
    spaceCategory: INITIAL_SPACES[0].category,
    userId: "usr_booker_demo",
    userName: "Ada Lovelace",
    userEmail: "ada@idlespace.demo",
    hostId: "usr_host_demo",
    hostName: "Elena Ross",
    date: "2026-11-26",
    startTime: "2:00 PM",
    endTime: "6:00 PM",
    hours: 4,
    guests: 6,
    hourlyPrice: 7100,
    subtotal: 28400,
    platformFee: 2556,
    discount: 0,
    total: 30956,
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "upcoming",
    createdAt: "2026-11-20T14:22:00Z",
  },
  {
    id: "IS-8821",
    spaceId: "s3",
    spaceTitle: "Modern Meeting Loft",
    spaceImage: INITIAL_SPACES[2].image,
    spaceCity: INITIAL_SPACES[2].city,
    spaceCategory: INITIAL_SPACES[2].category,
    userId: "usr_booker_demo",
    userName: "Ada Lovelace",
    userEmail: "ada@idlespace.demo",
    hostId: "usr_host_demo",
    hostName: "Elena Ross",
    date: "2026-11-30",
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    hours: 3,
    guests: 8,
    hourlyPrice: 4000,
    subtotal: 12000,
    platformFee: 1080,
    discount: 1200,
    couponCode: "WELCOME",
    total: 11880,
    paymentMethod: "card",
    paymentStatus: "paid",
    status: "pending",
    createdAt: "2026-11-21T09:15:00Z",
  },
  {
    id: "IS-7650",
    spaceId: "s2",
    spaceTitle: "The Bakery Test Kitchen",
    spaceImage: INITIAL_SPACES[1].image,
    spaceCity: INITIAL_SPACES[1].city,
    spaceCategory: INITIAL_SPACES[1].category,
    userId: "usr_booker_demo",
    userName: "Ada Lovelace",
    userEmail: "ada@idlespace.demo",
    hostId: "host_1",
    hostName: "Marco Vitale",
    date: "2026-11-10",
    startTime: "6:00 AM",
    endTime: "10:00 AM",
    hours: 4,
    guests: 5,
    hourlyPrice: 5150,
    subtotal: 20600,
    platformFee: 1854,
    discount: 0,
    total: 22454,
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "completed",
    createdAt: "2026-11-05T18:00:00Z",
    reviewed: true,
  },
  {
    id: "IS-6102",
    spaceId: "s6",
    spaceTitle: "Golden Hour Classroom",
    spaceImage: INITIAL_SPACES[5].image,
    spaceCity: INITIAL_SPACES[5].city,
    spaceCategory: INITIAL_SPACES[5].category,
    userId: "usr_booker_demo",
    userName: "Ada Lovelace",
    userEmail: "ada@idlespace.demo",
    hostId: "host_5",
    hostName: "Sam Whitfield",
    date: "2026-10-14",
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    hours: 3,
    guests: 15,
    hourlyPrice: 2300,
    subtotal: 6900,
    platformFee: 621,
    discount: 0,
    total: 7521,
    paymentMethod: "card",
    paymentStatus: "paid",
    status: "cancelled",
    cancellationReason: "Schedule conflict with client presentation",
    createdAt: "2026-10-08T11:20:00Z",
  },
];

const INITIAL_DETAILED_REVIEWS: Review[] = [
  ...INITIAL_REVIEWS.map((r, i) => ({
    id: `rev_${i + 1}`,
    spaceId: "s1",
    userId: "usr_other",
    author: r.author,
    avatar: r.avatar,
    rating: r.rating,
    date: r.date,
    body: r.body,
  })),
  {
    id: "rev_demo_1",
    spaceId: "s2",
    bookingId: "IS-7650",
    userId: "usr_booker_demo",
    author: "Ada Lovelace",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    date: "Nov 2026",
    body: "The kitchen was impeccably clean and all high-end commercial ovens were warmed and ready. Elena and Marco made our pop-up bakery prep a dream!",
  },
];

const INITIAL_DETAILED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    userId: "usr_booker_demo",
    title: "Booking confirmed",
    body: "Your booking for Skyline Rooftop Studio on Nov 26 is confirmed.",
    time: "10m ago",
    unread: true,
    type: "success",
    link: "/dashboard",
    createdAt: "2026-11-22T12:00:00Z",
  },
  {
    id: "notif_2",
    userId: "usr_host_demo",
    title: "New booking request received",
    body: "Ada Lovelace requested 3 hours at Modern Meeting Loft for Nov 30.",
    time: "1h ago",
    unread: true,
    type: "info",
    link: "/host/manage-bookings",
    createdAt: "2026-11-22T11:00:00Z",
  },
  {
    id: "notif_3",
    userId: "usr_host_demo",
    title: "Payout processed",
    body: "₹28,400 has been transferred to your connected bank account.",
    time: "1d ago",
    unread: false,
    type: "success",
    link: "/host/earnings",
    createdAt: "2026-11-21T10:00:00Z",
  },
  {
    id: "notif_4",
    userId: "usr_booker_demo",
    title: "Leave a review",
    body: "How was your experience at The Bakery Test Kitchen? Share feedback.",
    time: "3d ago",
    unread: false,
    type: "info",
    link: "/space/s2",
    createdAt: "2026-11-19T10:00:00Z",
  },
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "rep_1",
    spaceId: "s8",
    spaceTitle: "Warehouse Event Space",
    reportedBy: "Guest User",
    reason: "Incorrect pricing posted for weekend sound engineer fee",
    date: "2026-11-18",
    status: "pending",
  },
];

/* ========================================================================== */
/*  Local Storage Keys                                                        */
/* ========================================================================== */

const STORAGE_KEYS = {
  CURRENT_USER: "idlespace_current_user_v2",
  SPACES: "idlespace_spaces_v2",
  BOOKINGS: "idlespace_bookings_v2",
  REVIEWS: "idlespace_reviews_v2",
  NOTIFICATIONS: "idlespace_notifications_v2",
  FAVOURITES: "idlespace_favourites_v2",
  REPORTS: "idlespace_reports_v2",
};

/* ========================================================================== */
/*  Safe Storage Helper                                                       */
/* ========================================================================== */

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage for ${key}`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("idlespace_store_updated", { detail: { key } }));
  } catch (err) {
    console.warn(`Error writing localStorage for ${key}`, err);
  }
}

/* ========================================================================== */
/*  Store API Functions                                                       */
/* ========================================================================== */

export const IdleSpaceStore = {
  // ---- Current User & Auth State ----
  getCurrentUser(): AppUser {
    return getStored<AppUser>(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  },

  setCurrentUser(user: AppUser | null): void {
    if (!user) {
      if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.dispatchEvent(new CustomEvent("idlespace_store_updated", { detail: { key: STORAGE_KEYS.CURRENT_USER } }));
      return;
    }
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  },

  switchUserRole(role: UserRole): AppUser {
    const current = this.getCurrentUser();
    // If switching to one of the canonical demo users:
    const matchedDemo = DEMO_USERS.find((u) => u.role === role);
    const updated: AppUser = matchedDemo ? { ...matchedDemo } : { ...current, role };
    this.setCurrentUser(updated);
    return updated;
  },

  loginAsDemo(role: UserRole): AppUser {
    const target = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
    this.setCurrentUser(target);
    return target;
  },

  // ---- Spaces ----
  getSpaces(): SpaceListing[] {
    return getStored<SpaceListing[]>(STORAGE_KEYS.SPACES, INITIAL_EXTENDED_SPACES);
  },

  getSpaceById(id: string): SpaceListing | undefined {
    return this.getSpaces().find((s) => s.id === id);
  },

  addSpace(space: Omit<SpaceListing, "id" | "rating" | "reviews">): SpaceListing {
    const spaces = this.getSpaces();
    const newId = `s_${Date.now()}`;
    const newSpace: SpaceListing = {
      ...space,
      id: newId,
      rating: 5.0,
      reviews: 0,
      status: space.status || "active",
      blockedDates: space.blockedDates || [],
    };
    const updated = [newSpace, ...spaces];
    setStored(STORAGE_KEYS.SPACES, updated);

    // Add notification to admin
    this.addNotification({
      userId: "usr_admin_demo",
      title: "New space listing published",
      body: `"${newSpace.title}" was published in ${newSpace.city}.`,
      type: "info",
      link: "/admin",
    });

    return newSpace;
  },

  updateSpace(id: string, updates: Partial<SpaceListing>): SpaceListing | null {
    const spaces = this.getSpaces();
    const index = spaces.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const updatedSpace = { ...spaces[index], ...updates };
    spaces[index] = updatedSpace;
    setStored(STORAGE_KEYS.SPACES, [...spaces]);
    return updatedSpace;
  },

  deleteSpace(id: string): boolean {
    const spaces = this.getSpaces();
    const filtered = spaces.filter((s) => s.id !== id);
    if (filtered.length === spaces.length) return false;
    setStored(STORAGE_KEYS.SPACES, filtered);
    return true;
  },

  toggleSpaceStatus(id: string): SpaceListing | null {
    const space = this.getSpaceById(id);
    if (!space) return null;
    const newStatus = space.status === "active" ? "paused" : "active";
    return this.updateSpace(id, { status: newStatus });
  },

  blockDateForSpace(spaceId: string, dateStr: string): boolean {
    const space = this.getSpaceById(spaceId);
    if (!space) return false;
    const dates = new Set(space.blockedDates || []);
    dates.add(dateStr);
    this.updateSpace(spaceId, { blockedDates: Array.from(dates) });
    return true;
  },

  unblockDateForSpace(spaceId: string, dateStr: string): boolean {
    const space = this.getSpaceById(spaceId);
    if (!space) return false;
    const dates = (space.blockedDates || []).filter((d) => d !== dateStr);
    this.updateSpace(spaceId, { blockedDates: dates });
    return true;
  },

  // ---- Bookings ----
  getBookings(): Booking[] {
    return getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_DETAILED_BOOKINGS);
  },

  getUserBookings(userId: string): Booking[] {
    return this.getBookings().filter((b) => b.userId === userId);
  },

  getHostBookings(hostId: string): Booking[] {
    return this.getBookings().filter((b) => b.hostId === hostId || hostId === "usr_host_demo");
  },

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  },

  createBooking(data: {
    spaceId: string;
    userId: string;
    userName: string;
    userEmail: string;
    date: string;
    startTime: string;
    endTime: string;
    hours: number;
    guests: number;
    hourlyPrice: number;
    subtotal: number;
    platformFee: number;
    discount: number;
    couponCode?: string;
    total: number;
    paymentMethod: "upi" | "card" | "venue";
  }): Booking {
    const space = this.getSpaceById(data.spaceId);
    if (!space) throw new Error("Space not found");

    // Overlap validation check
    const existing = this.getBookings().filter(
      (b) =>
        b.spaceId === data.spaceId &&
        b.date === data.date &&
        b.status !== "cancelled" &&
        b.status !== "rejected",
    );

    // If already booked for this specific time
    const conflict = existing.find(
      (b) => b.startTime === data.startTime || (b.status === "confirmed" && b.startTime === data.startTime),
    );
    if (conflict) {
      throw new Error(`This space is already booked on ${data.date} at ${data.startTime}.`);
    }

    const bookingId = `IS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...data,
      id: bookingId,
      spaceTitle: space.title,
      spaceImage: space.image,
      spaceCity: space.city,
      spaceCategory: space.category,
      hostId: space.hostId || "usr_host_demo",
      hostName: space.host,
      paymentStatus: "paid",
      status: "pending", // Host must approve, or confirmed if instant
      createdAt: new Date().toISOString(),
      reviewed: false,
    };

    const bookings = this.getBookings();
    setStored(STORAGE_KEYS.BOOKINGS, [newBooking, ...bookings]);

    // Send notifications
    this.addNotification({
      userId: data.userId,
      title: "Booking request submitted",
      body: `Your reservation request for ${space.title} (#${bookingId}) is submitted.`,
      type: "info",
      link: "/dashboard",
    });

    this.addNotification({
      userId: newBooking.hostId,
      title: "New booking request received",
      body: `${data.userName} requested ${data.hours} hrs at ${space.title} for ${data.date}.`,
      type: "info",
      link: "/host/manage-bookings",
    });

    return newBooking;
  },

  updateBookingStatus(bookingId: string, status: BookingStatus, cancellationReason?: string): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const b = bookings[index];
    const updated: Booking = { ...b, status, ...(cancellationReason ? { cancellationReason } : {}) };
    bookings[index] = updated;
    setStored(STORAGE_KEYS.BOOKINGS, [...bookings]);

    // Send corresponding notifications
    if (status === "confirmed") {
      this.addNotification({
        userId: b.userId,
        title: "Booking Confirmed! 🎉",
        body: `Host ${b.hostName} approved your reservation for ${b.spaceTitle} on ${b.date}.`,
        type: "success",
        link: `/booking-confirmed/${b.spaceId}`,
      });
    } else if (status === "rejected") {
      this.addNotification({
        userId: b.userId,
        title: "Booking Request Declined",
        body: `Host was unable to accept your reservation for ${b.spaceTitle} on ${b.date}.`,
        type: "warning",
        link: "/dashboard",
      });
    } else if (status === "cancelled") {
      this.addNotification({
        userId: b.hostId,
        title: "Booking Cancelled",
        body: `Reservation for ${b.spaceTitle} on ${b.date} was cancelled: ${cancellationReason || "By user"}.`,
        type: "warning",
        link: "/host/manage-bookings",
      });
    } else if (status === "completed") {
      this.addNotification({
        userId: b.userId,
        title: "Booking Completed — Review your stay",
        body: `Hope you enjoyed ${b.spaceTitle}! Click here to leave a review.`,
        type: "info",
        link: `/space/${b.spaceId}`,
      });
    }

    return updated;
  },

  // ---- Favourites / Wishlist ----
  getFavourites(userId?: string): string[] {
    const uid = userId || this.getCurrentUser().id;
    const allFavs = getStored<Record<string, string[]>>(STORAGE_KEYS.FAVOURITES, {
      usr_booker_demo: ["s1", "s4"],
    });
    return allFavs[uid] || [];
  },

  isFavourite(spaceId: string, userId?: string): boolean {
    const favs = this.getFavourites(userId);
    return favs.includes(spaceId);
  },

  toggleFavourite(spaceId: string, userId?: string): boolean {
    const uid = userId || this.getCurrentUser().id;
    const allFavs = getStored<Record<string, string[]>>(STORAGE_KEYS.FAVOURITES, {
      usr_booker_demo: ["s1", "s4"],
    });
    const currentList = allFavs[uid] || [];
    const exists = currentList.includes(spaceId);
    const updated = exists ? currentList.filter((id) => id !== spaceId) : [...currentList, spaceId];
    allFavs[uid] = updated;
    setStored(STORAGE_KEYS.FAVOURITES, allFavs);
    return !exists;
  },

  // ---- Reviews ----
  getReviews(spaceId?: string): Review[] {
    const all = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_DETAILED_REVIEWS);
    if (!spaceId) return all;
    return all.filter((r) => r.spaceId === spaceId);
  },

  addReview(data: {
    spaceId: string;
    bookingId?: string;
    userId: string;
    author: string;
    avatar: string;
    rating: number;
    body: string;
  }): Review {
    const allReviews = this.getReviews();
    const newRev: Review = {
      ...data,
      id: `rev_${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };

    const updatedReviews = [newRev, ...allReviews];
    setStored(STORAGE_KEYS.REVIEWS, updatedReviews);

    // Recalculate space rating and reviews count
    const spaceReviews = updatedReviews.filter((r) => r.spaceId === data.spaceId);
    const avgRating = Math.round((spaceReviews.reduce((acc, r) => acc + r.rating, 0) / spaceReviews.length) * 10) / 10;
    this.updateSpace(data.spaceId, {
      rating: avgRating,
      reviews: spaceReviews.length,
    });

    // Mark booking as reviewed if bookingId provided
    if (data.bookingId) {
      const bookings = this.getBookings();
      const bIdx = bookings.findIndex((b) => b.id === data.bookingId);
      if (bIdx !== -1) {
        bookings[bIdx].reviewed = true;
        setStored(STORAGE_KEYS.BOOKINGS, bookings);
      }
    }

    return newRev;
  },

  // ---- Notifications ----
  getNotifications(userId?: string): NotificationItem[] {
    const uid = userId || this.getCurrentUser().id;
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DETAILED_NOTIFICATIONS);
    return all.filter((n) => n.userId === uid || n.userId === "all");
  },

  getUnreadNotificationsCount(userId?: string): number {
    return this.getNotifications(userId).filter((n) => n.unread).length;
  },

  addNotification(item: Omit<NotificationItem, "id" | "createdAt" | "time" | "unread"> & { unread?: boolean }): NotificationItem {
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DETAILED_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time: "Just now",
      unread: item.unread ?? true,
      createdAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...all]);
    return newNotif;
  },

  markNotificationAsRead(id: string): void {
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DETAILED_NOTIFICATIONS);
    const index = all.findIndex((n) => n.id === id);
    if (index !== -1) {
      all[index].unread = false;
      setStored(STORAGE_KEYS.NOTIFICATIONS, [...all]);
    }
  },

  markAllNotificationsAsRead(userId?: string): void {
    const uid = userId || this.getCurrentUser().id;
    const all = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DETAILED_NOTIFICATIONS);
    const updated = all.map((n) => (n.userId === uid || n.userId === "all" ? { ...n, unread: false } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // ---- Reports ----
  getReports(): ReportItem[] {
    return getStored<ReportItem[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  },

  addReport(spaceId: string, reason: string, reportedBy: string): ReportItem {
    const space = this.getSpaceById(spaceId);
    const reports = this.getReports();
    const newRep: ReportItem = {
      id: `rep_${Date.now()}`,
      spaceId,
      spaceTitle: space?.title || "Unknown space",
      reportedBy,
      reason,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setStored(STORAGE_KEYS.REPORTS, [newRep, ...reports]);
    return newRep;
  },

  updateReportStatus(reportId: string, status: "pending" | "resolved" | "dismissed"): void {
    const reports = this.getReports();
    const idx = reports.findIndex((r) => r.id === reportId);
    if (idx !== -1) {
      reports[idx].status = status;
      setStored(STORAGE_KEYS.REPORTS, [...reports]);
    }
  },

  // ---- Reset to defaults ----
  resetAll(): void {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent("idlespace_store_updated", { detail: { key: "all" } }));
  },
};
