import { useEffect, useState, useSyncExternalStore } from "react";
import {
  IdleSpaceStore,
  type AppUser,
  type Booking,
  type SpaceListing,
  type Review,
  type NotificationItem,
  type ReportItem,
  type UserRole,
} from "@/lib/store";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("idlespace_store_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("idlespace_store_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

/** Reactive hook to get current user & role */
export function useCurrentUser() {
  const [user, setUser] = useState<AppUser>(() => IdleSpaceStore.getCurrentUser());

  useEffect(() => {
    const update = () => setUser(IdleSpaceStore.getCurrentUser());
    return subscribe(update);
  }, []);

  const switchRole = (role: UserRole) => {
    const updated = IdleSpaceStore.switchUserRole(role);
    setUser(updated);
    return updated;
  };

  const loginAsDemo = (role: UserRole) => {
    const target = IdleSpaceStore.loginAsDemo(role);
    setUser(target);
    return target;
  };

  const updateProfile = (data: Partial<AppUser>) => {
    const current = IdleSpaceStore.getCurrentUser();
    const updated = { ...current, ...data };
    IdleSpaceStore.setCurrentUser(updated);
    setUser(updated);
    return updated;
  };

  return { user, switchRole, loginAsDemo, updateProfile };
}

/** Reactive hook to get and update spaces */
export function useSpaces() {
  const [spaces, setSpaces] = useState<SpaceListing[]>(() => IdleSpaceStore.getSpaces());

  useEffect(() => {
    const update = () => setSpaces(IdleSpaceStore.getSpaces());
    return subscribe(update);
  }, []);

  return {
    spaces,
    getSpace: (id: string) => spaces.find((s) => s.id === id) || IdleSpaceStore.getSpaceById(id),
    addSpace: IdleSpaceStore.addSpace.bind(IdleSpaceStore),
    updateSpace: IdleSpaceStore.updateSpace.bind(IdleSpaceStore),
    deleteSpace: IdleSpaceStore.deleteSpace.bind(IdleSpaceStore),
    toggleStatus: IdleSpaceStore.toggleSpaceStatus.bind(IdleSpaceStore),
    blockDate: IdleSpaceStore.blockDateForSpace.bind(IdleSpaceStore),
    unblockDate: IdleSpaceStore.unblockDateForSpace.bind(IdleSpaceStore),
  };
}

/** Reactive hook to get and manage bookings */
export function useBookings(userId?: string, hostId?: string) {
  const [allBookings, setAllBookings] = useState<Booking[]>(() => IdleSpaceStore.getBookings());

  useEffect(() => {
    const update = () => setAllBookings(IdleSpaceStore.getBookings());
    return subscribe(update);
  }, []);

  const userBookings = userId ? allBookings.filter((b) => b.userId === userId) : allBookings;
  const hostBookings = hostId ? allBookings.filter((b) => b.hostId === hostId || hostId === "usr_host_demo") : allBookings;

  return {
    allBookings,
    userBookings,
    hostBookings,
    createBooking: IdleSpaceStore.createBooking.bind(IdleSpaceStore),
    updateStatus: IdleSpaceStore.updateBookingStatus.bind(IdleSpaceStore),
  };
}

/** Reactive hook to get and toggle favourites */
export function useFavourites(userId?: string) {
  const [favourites, setFavourites] = useState<string[]>(() => IdleSpaceStore.getFavourites(userId));

  useEffect(() => {
    const update = () => setFavourites(IdleSpaceStore.getFavourites(userId));
    return subscribe(update);
  }, [userId]);

  const toggle = (spaceId: string) => {
    const isNowFav = IdleSpaceStore.toggleFavourite(spaceId, userId);
    setFavourites(IdleSpaceStore.getFavourites(userId));
    return isNowFav;
  };

  const isFav = (spaceId: string) => favourites.includes(spaceId);

  return { favourites, toggle, isFav };
}

/** Reactive hook for notifications */
export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    IdleSpaceStore.getNotifications(userId),
  );

  useEffect(() => {
    const update = () => setNotifications(IdleSpaceStore.getNotifications(userId));
    return subscribe(update);
  }, [userId]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return {
    notifications,
    unreadCount,
    markAsRead: IdleSpaceStore.markNotificationAsRead.bind(IdleSpaceStore),
    markAllAsRead: () => IdleSpaceStore.markAllNotificationsAsRead(userId),
    addNotification: IdleSpaceStore.addNotification.bind(IdleSpaceStore),
  };
}

/** Reactive hook for reviews */
export function useReviews(spaceId?: string) {
  const [reviews, setReviews] = useState<Review[]>(() => IdleSpaceStore.getReviews(spaceId));

  useEffect(() => {
    const update = () => setReviews(IdleSpaceStore.getReviews(spaceId));
    return subscribe(update);
  }, [spaceId]);

  return {
    reviews,
    addReview: IdleSpaceStore.addReview.bind(IdleSpaceStore),
  };
}

/** Reactive hook for reports */
export function useReports() {
  const [reports, setReports] = useState<ReportItem[]>(() => IdleSpaceStore.getReports());

  useEffect(() => {
    const update = () => setReports(IdleSpaceStore.getReports());
    return subscribe(update);
  }, []);

  return {
    reports,
    addReport: IdleSpaceStore.addReport.bind(IdleSpaceStore),
    updateReportStatus: IdleSpaceStore.updateReportStatus.bind(IdleSpaceStore),
  };
}
