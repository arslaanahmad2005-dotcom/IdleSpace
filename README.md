# IdleSpace

IdleSpace is a marketplace platform connecting property owners with businesses and individuals looking for temporary commercial spaces by the hour (restaurants, studios, kitchens, classrooms, meeting rooms, etc.).

## Features

- **Secure User Authentication** (Supabase Auth: Email/Password, Google OAuth, Apple OAuth)
- **Protected Routes & Role State** (Dashboard, Profile management, Add Space listings, Booking checkout)
- **Property Listings & Search** (Categorized directory, real-time filters, price sliders)
- **Dynamic AI Insights** (AI pricing estimates, occupancy trends, tailored recommendations)
- **Booking Management** (Upcoming/past booking history, host dashboard)
- **Modern Responsive UI** (Dark mode toggle, glassmorphism, responsive navigation)

## Tech Stack

- **Framework**: React 19, Vite, TanStack Router & Start
- **Styling**: Tailwind CSS v4, Radix UI primitives, Lucide icons, Recharts
- **Backend / Authentication**: Supabase (`@supabase/supabase-js`)

## Security & Environment Configuration

### 1. Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Set the required environment variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> ⚠️ **CRITICAL SECURITY NOTICES**:
> - **Row Level Security (RLS)**: The `VITE_SUPABASE_ANON_KEY` is public-safe on the client side **ONLY IF** Row Level Security (RLS) is enabled and enforced on every table in your Supabase database. Ensure all tables (`spaces`, `bookings`, `profiles`, etc.) have RLS enabled with explicit policies before deploying to production.
> - **Never Expose Service Role Keys**: The Supabase `service_role` key must **NEVER** be committed, hardcoded, or placed in any `VITE_` environment variable or client code.
> - **Secret Rotation Warning**: If any API key, database password, or secret was previously committed or hardcoded anywhere in past commits or local drafts, consider it compromised and **rotate all credentials immediately** in their respective provider consoles (Supabase, Google Cloud, Stripe, etc.).

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Open in browser
# http://localhost:8080/
```
