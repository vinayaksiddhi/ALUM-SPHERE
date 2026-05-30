# AlumSphere 🎓

AlumSphere is a modern, high-performance web platform designed to bridge the gap between university students and alumni. It features a high-tech "glassmorphic" UI, intelligent matching algorithms, and role-based dashboards for networking, mentorship, and career growth.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack enabled)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Animations
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Authentication:** [Supabase Auth](https://supabase.com/docs/guides/auth) (SSR integration)
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** [Prisma](https://www.prisma.io/)

---

## ✨ Key Features

1. **Role-Based Architecture:** Dedicated onboarding flows and customized dashboards for `STUDENT` and `ALUMNI`.
2. **Magic Link & OAuth Authentication:** Secure passwordless email login and Google OAuth powered by Supabase.
3. **Just-in-Time (JIT) Provisioning:** Automatic database record synchronization immediately after authentication.
4. **Intelligent Matching Algorithm:** Matches students with relevant alumni based on department, skills, and areas of interest/expertise.
5. **Connection System:** Send and receive connection requests directly within the platform.
6. **Premium UI/UX:** Dark-mode native, glowing gradients, micro-interactions, and glassmorphism cards.

---

## 🏗️ Architecture & Historical Context

### Authentication Migration
The project initially used Clerk for authentication but was migrated entirely to **Supabase Auth** to achieve:
- Tighter integration between authentication and the database (Row Level Security ready).
- Built-in OAuth providers without third-party redirection loops.
- Elimination of complex `isLoaded` race conditions via server-side session checks (`@supabase/ssr`).

### Database Strategy
- **Prisma via Pooler:** The application connects to Supabase using a Transaction Connection Pooler (`pgbouncer=true`) to prevent connection exhaustion in serverless environments.
- **Data Model:** A base `profiles` table handles core user identity, while `student_profiles` and `alumni_profiles` handle role-specific data. They are linked via one-to-one relations.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm

### 2. Environment Variables
Create a `.env` file in the root of your project. You will need a Supabase project.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Prisma Database Connections
# (Found in Supabase Database Settings -> Connection String -> URI -> Transaction mode)
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-pooler.supabase.com:6543/postgres?pgbouncer=true"

# (Direct connection for Prisma migrations, usually port 5432)
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-pooler.supabase.com:5432/postgres"
```

### 3. Database Initialization
This project uses Prisma. To sync the schema with your database, run:
```bash
npx prisma generate
npx prisma db push
```
*(Note: There is a `supabase_schema.sql` file in the repository for reference, but Prisma acts as the source of truth for the application layer.)*

### 4. Run the Development Server
Start the Next.js development server using Turbopack for maximum compilation speed:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

- `/app`: Next.js App Router pages, layouts, and API routes.
  - `/app/api`: Backend API endpoints (e.g., matching logic, connection requests).
  - `/app/actions`: Next.js Server Actions for secure data mutation (e.g., saving profiles).
  - `/app/setup`: The multi-step onboarding wizard for new users.
  - `/app/dashboard`: Role-specific interfaces for students and alumni.
- `/components`: Reusable React components (shadcn UI, layout elements, modals).
- `/lib`: Utility functions, database singletons, and Supabase client initializers.
- `/prisma`: Database schema definition (`schema.prisma`).

---

## 🔒 Security Notes
- The `.env` file and `supabase_schema.sql` (if it contains sensitive keys) are excluded via `.gitignore`.
- Next.js Middleware (`middleware.ts`) actively intercepts requests to ensure `/dashboard` and `/setup` paths are only accessible to authenticated users with valid Supabase session cookies.
