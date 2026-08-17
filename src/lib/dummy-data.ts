export type Space = {
  id: string;
  title: string;
  category: string;
  city: string;
  price: number;
  rating: number;
  reviews: number;
  host: string;
  hostAvatar: string;
  image: string;
  gallery: string[];
  amenities: string[];
  capacity: number;
  description: string;
};

const img = (seed: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&q=80`;

export const CATEGORIES = [
  { id: "restaurant", label: "Restaurants", icon: "UtensilsCrossed" },
  { id: "meeting", label: "Meeting Rooms", icon: "Users" },
  { id: "studio", label: "Studios", icon: "Camera" },
  { id: "classroom", label: "Classrooms", icon: "GraduationCap" },
  { id: "kitchen", label: "Kitchens", icon: "ChefHat" },
  { id: "cafe", label: "Cafés", icon: "Coffee" },
  { id: "conference", label: "Conference Halls", icon: "Presentation" },
  { id: "event", label: "Event Spaces", icon: "PartyPopper" },
];

export const SPACES: Space[] = [
  {
    id: "s1",
    title: "Skyline Rooftop Studio",
    category: "studio",
    city: "Mumbai, Maharashtra",
    price: 7100,
    rating: 4.9,
    reviews: 218,
    host: "Elena Ross",
    hostAvatar: img("1544005313-94ddf0286df2", 200, 200),
    image: img("1497366216548-37526070297c"),
    gallery: [
      img("1497366216548-37526070297c"),
      img("1524758631624-e2822e304c36"),
      img("1560448204-e02f11c3d0e2"),
      img("1522708323590-d24dbb6b0267"),
    ],
    amenities: ["Wi-Fi", "Projector", "Kitchen", "Parking", "AC", "Whiteboard"],
    capacity: 24,
    description:
      "A light-filled rooftop with panoramic city views. Perfect for product shoots, offsites, and intimate gatherings.",
  },
  {
    id: "s2",
    title: "The Bakery Test Kitchen",
    category: "kitchen",
    city: "Bangalore, Karnataka",
    price: 5150,
    rating: 4.8,
    reviews: 143,
    host: "Marco Vitale",
    hostAvatar: img("1500648767791-00dcc994a43e", 200, 200),
    image: img("1556909114-f6e7ad7d3136"),
    gallery: [img("1556909114-f6e7ad7d3136"), img("1466637574441-749b8f19452f")],
    amenities: ["Commercial Oven", "Mixer", "Cold Storage", "Wi-Fi"],
    capacity: 8,
    description: "A professional bakery kitchen available in off-hours for chefs and creators.",
  },
  {
    id: "s3",
    title: "Modern Meeting Loft",
    category: "meeting",
    city: "Hyderabad, Telangana",
    price: 4000,
    rating: 4.7,
    reviews: 96,
    host: "Priya Shah",
    hostAvatar: img("1438761681033-6461ffad8d80", 200, 200),
    image: img("1497366754035-f200968a6e72"),
    gallery: [img("1497366754035-f200968a6e72"), img("1519389950473-47ba0277781c")],
    amenities: ["Wi-Fi", "TV", "Whiteboard", "Coffee"],
    capacity: 12,
    description: "Bright and quiet loft designed for focused meetings and workshops.",
  },
  {
    id: "s4",
    title: "The Warm Corner Café",
    category: "cafe",
    city: "Pune, Maharashtra",
    price: 2900,
    rating: 4.9,
    reviews: 187,
    host: "Julien Beck",
    hostAvatar: img("1507003211169-0a1dd7228f2d", 200, 200),
    image: img("1521017432531-fbd92d768814"),
    gallery: [img("1521017432531-fbd92d768814"), img("1445116572660-236099ec97a0")],
    amenities: ["Wi-Fi", "Espresso Bar", "Sound System"],
    capacity: 30,
    description: "A cozy café available after hours for pop-ups, tastings, and community events.",
  },
  {
    id: "s5",
    title: "Riverside Conference Hall",
    category: "conference",
    city: "Chennai, Tamil Nadu",
    price: 11600,
    rating: 4.6,
    reviews: 74,
    host: "Amara Okafor",
    hostAvatar: img("1531123897727-8f129e1688ce", 200, 200),
    image: img("1517457373958-b7bdd4587205"),
    gallery: [img("1517457373958-b7bdd4587205"), img("1540575467063-178a50c2df87")],
    amenities: ["AV System", "Stage", "Catering", "Parking"],
    capacity: 120,
    description: "Large conference hall with river views and full AV production support.",
  },
  {
    id: "s6",
    title: "Golden Hour Classroom",
    category: "classroom",
    city: "Kolkata, West Bengal",
    price: 2300,
    rating: 4.8,
    reviews: 51,
    host: "Sam Whitfield",
    hostAvatar: img("1502378735452-bc7d86632805", 200, 200),
    image: img("1503676260728-1c00da094a0b"),
    gallery: [img("1503676260728-1c00da094a0b"), img("1523240795612-9a054b0db644")],
    amenities: ["Wi-Fi", "Projector", "Whiteboard", "Tables"],
    capacity: 20,
    description: "A calm classroom for workshops, tutoring, and small classes.",
  },
  {
    id: "s7",
    title: "Trattoria Private Room",
    category: "restaurant",
    city: "New Delhi, Delhi",
    price: 7900,
    rating: 4.9,
    reviews: 132,
    host: "Chiara Romano",
    hostAvatar: img("1544723795-3fb6469f5b39", 200, 200),
    image: img("1517248135467-4c7edcad34c4"),
    gallery: [img("1517248135467-4c7edcad34c4"), img("1552566626-52f8b828add9")],
    amenities: ["Full Menu", "Bar", "AV"],
    capacity: 40,
    description: "Private dining room in a beloved neighborhood trattoria.",
  },
  {
    id: "s8",
    title: "Warehouse Event Space",
    category: "event",
    city: "Gurugram, Haryana",
    price: 14900,
    rating: 4.7,
    reviews: 88,
    host: "Devon Lee",
    hostAvatar: img("1517841905240-472988babdf9", 200, 200),
    image: img("1519167758481-83f550bb49b3"),
    gallery: [img("1519167758481-83f550bb49b3"), img("1464366400600-7168b8af9bc3")],
    amenities: ["Sound System", "Lighting", "Bar", "Loading Dock"],
    capacity: 250,
    description: "A raw, cinematic warehouse ideal for launches and large events.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Nadia Petrov",
    role: "Founder, Studio Nord",
    quote:
      "IdleSpace helped us book a rooftop studio in under an hour. The whole booking experience felt like magic.",
    avatar: img("1494790108377-be9c29b29330", 200, 200),
  },
  {
    name: "Kenji Watanabe",
    role: "Head of Events, Cove",
    quote:
      "Our team offsites are 40% cheaper thanks to IdleSpace. Hosts are vetted and the spaces are stunning.",
    avatar: img("1500648767791-00dcc994a43e", 200, 200),
  },
  {
    name: "Amina Cole",
    role: "Owner, Sunday Kitchen",
    quote:
      "We now earn steady weekly income renting out our kitchen during off-hours. It just works.",
    avatar: img("1544005313-94ddf0286df2", 200, 200),
  },
];

export const NOTIFICATIONS = [
  { id: "n1", title: "Booking confirmed", body: "Skyline Rooftop Studio · Sat 2:00 PM", time: "2m", unread: true, type: "success" },
  { id: "n2", title: "New review", body: "Priya left a 5★ review on your listing.", time: "1h", unread: true, type: "info" },
  { id: "n3", title: "Payout sent", body: "₹1,03,000 sent to your bank ending 4421.", time: "1d", unread: false, type: "success" },
  { id: "n4", title: "Price suggestion", body: "AI recommends +12% for Friday evenings.", time: "2d", unread: false, type: "warning" },
];

export const REVIEWS = [
  { id: "r1", author: "Léa M.", avatar: img("1544005313-94ddf0286df2", 100, 100), rating: 5, date: "Aug 2025", body: "Absolutely stunning space. The host was incredibly responsive." },
  { id: "r2", author: "Jonas K.", avatar: img("1507003211169-0a1dd7228f2d", 100, 100), rating: 5, date: "Jul 2025", body: "Perfect for our team offsite. Would book again in a heartbeat." },
  { id: "r3", author: "Sara T.", avatar: img("1494790108377-be9c29b29330", 100, 100), rating: 4, date: "Jun 2025", body: "Beautiful light, great amenities. Wi-Fi could be a touch faster." },
];

export const REVENUE_DATA = [
  { month: "Jan", revenue: 265000, bookings: 24 },
  { month: "Feb", revenue: 340000, bookings: 31 },
  { month: "Mar", revenue: 319500, bookings: 28 },
  { month: "Apr", revenue: 431500, bookings: 41 },
  { month: "May", revenue: 506000, bookings: 48 },
  { month: "Jun", revenue: 602000, bookings: 56 },
  { month: "Jul", revenue: 697000, bookings: 63 },
  { month: "Aug", revenue: 755500, bookings: 71 },
];

export const DEMAND_DATA = [
  { day: "Mon", demand: 45, occupancy: 58 },
  { day: "Tue", demand: 52, occupancy: 62 },
  { day: "Wed", demand: 61, occupancy: 70 },
  { day: "Thu", demand: 74, occupancy: 82 },
  { day: "Fri", demand: 92, occupancy: 94 },
  { day: "Sat", demand: 98, occupancy: 96 },
  { day: "Sun", demand: 78, occupancy: 80 },
];

export const BOOKINGS = [
  { id: "b1", space: "Skyline Rooftop Studio", date: "Sep 24, 2026", time: "2:00 PM – 6:00 PM", status: "upcoming", total: 28400, image: SPACES[0].image },
  { id: "b2", space: "Modern Meeting Loft", date: "Sep 12, 2026", time: "10:00 AM – 12:00 PM", status: "upcoming", total: 8000, image: SPACES[2].image },
  { id: "b3", space: "The Bakery Test Kitchen", date: "Aug 03, 2026", time: "5:00 AM – 9:00 AM", status: "completed", total: 20600, image: SPACES[1].image },
  { id: "b4", space: "Warehouse Event Space", date: "Jul 18, 2026", time: "6:00 PM – 11:00 PM", status: "completed", total: 74500, image: SPACES[7].image },
  { id: "b5", space: "Golden Hour Classroom", date: "Jun 30, 2026", time: "9:00 AM – 12:00 PM", status: "cancelled", total: 6900, image: SPACES[5].image },
];

export const FAQS = [
  { q: "How does IdleSpace work?", a: "Businesses list unused spaces by the hour. Guests search, book, and pay securely — all in one flow." },
  { q: "Is my payment secure?", a: "Yes. Payments are processed through PCI-compliant providers with end-to-end encryption." },
  { q: "Can I cancel a booking?", a: "Free cancellation up to 24 hours before your booking. See each listing for host-specific policies." },
  { q: "How do payouts work for hosts?", a: "Payouts land in your bank account 24 hours after the booking completes." },
  { q: "Do you support insurance?", a: "Every booking includes a base host protection policy up to ₹8.3 Cr in damages." },
  { q: "How is pricing set?", a: "Hosts set prices. Our AI suggests dynamic pricing based on demand, seasonality, and comparable listings." },
];
