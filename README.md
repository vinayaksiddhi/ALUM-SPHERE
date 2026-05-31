# Alum-Sphere 🎓🚀

Alum-Sphere is a cutting-edge platform designed to bridge the gap between students and university alumni. Built with modern web technologies, it facilitates dynamic mentorship matching, real-time messaging, project collaboration, and robust Q&A sessions.

## 🌟 Key Features

### 1. Student & Alumni Portals
- **Role-Based Dashboards:** Separate, tailored experiences for Students and Alumni.
- **Matchmaking Engine:** Connects students with alumni based on colleges, graduation years, industry expertise, and departments.
- **Dynamic Portfolios:** Alumni and students can manage their bios, technical skills, and project showcases.

### 2. Real-Time WhatsApp-Style Chat
- **Instant Messaging:** Built with **Supabase Broadcast Channels** for sub-100ms message delivery without refreshing.
- **Optimistic UI:** Messages appear instantly on the sender's screen while resolving in the background.
- **Real-Time Notification Badges:** Sidebar indicators alert you to new messages instantly.

### 3. Connections Network
- **Connection Requests:** Students can send mentorship requests to alumni.
- **Status Updates:** Track request statuses (Pending, Accepted, Rejected) in real-time.
- **Automatic Match Syncing:** Acceptance of a connection immediately spins up a secure conversation channel between the users.

### 4. Q&A and Discussions
- **Collegiate Q&A:** A dedicated space for students to ask questions and alumni to provide industry insights.
- **Real-Time Commenting:** Add comments and engage in discussions that sync instantly across all clients.
- **Like Systems:** Upvote helpful questions to highlight trending collegiate topics.

### 5. Project Showcases
- **Prototype Sharing:** Students can post "Looking for Contributors" or "In Progress" projects.
- **Tech Stack Filtering:** Projects display clear technology tags for easy discovery.
- **Real-Time Project Feeds:** New projects appear dynamically in the dashboard feeds as soon as they are posted.

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React 19, TailwindCSS v4, Framer Motion
- **UI Components:** Radix UI primitives, Lucide Icons, Glassmorphism design system
- **Authentication:** Clerk
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma Client with `prisma/adapter-pg`
- **Real-Time:** Supabase Realtime (WebSockets & Broadcasts)

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- npm or pnpm
- Supabase Account
- Clerk Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/alum-sphere.git
   cd alum-sphere
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase Realtime & Storage
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Prisma Postgres Pool
   DATABASE_URL=your_transaction_pool_url
   DIRECT_URL=your_session_pool_url
   ```

4. **Run Prisma Migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture Notes

- **Optimized Network Fetching:** The dashboards employ debounced WebSocket listeners to consolidate rapid real-time database changes into a single smooth server fetch.
- **Bypassing RLS with Prisma:** The backend securely writes to Postgres via Prisma Server Actions, side-stepping public RLS friction while still populating Postgres logical replication logs.
- **Broadcast Delivery:** Client-side WebSockets use Supabase Broadcast for high-speed chat delivery directly between connected browsers.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the issues page.
