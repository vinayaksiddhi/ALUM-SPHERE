# AlumSphere Phase 3 Backend Architecture

This document provides a comprehensive overview of the backend architecture, server actions, and database integrations implemented during Phase 3 of the AlumSphere platform.

## Overview
Phase 3 transitions the platform from using static mock data to dynamic, production-ready PostgreSQL queries via Prisma ORM and Supabase. The primary modules completed are:
1.  **Alumni Matchmaking & Search**
2.  **Connection Request Workflow**
3.  **Real-Time Messaging System**

---

## 1. Alumni Matchmaking & Search

### Objective
Allow students to search for alumni based on various criteria (company, department, passing year, skills) and retrieve real data.

### Implementation Details
*   **Action File**: `app/actions/search-alumni.ts`
*   **Function**: `searchAlumni(filters)`
*   **Logic**:
    1. Retrieves the current authenticated user's ID via Supabase Auth.
    2. Fetches the current user's profile to identify their college.
    3. Queries the `alumni_profiles` table using Prisma, filtering by the user's college (to restrict matches to the same institution).
    4. Applies optional filters (companies, departments, passing years).
    5. Implements a textual search against `company`, `job_title`, `department`, `name` (joined from the `profiles` table), and `expertise` array.
    6. Calculates a base `matchScore` by comparing the alumni's department and skills against the student's profile.
    7. Checks the `connection_requests` table to determine the `connectionStatus` (PENDING, ACCEPTED) to dynamically configure the UI buttons.

---

## 2. Connection Request Workflow

### Objective
Enable students and alumni to send, receive, accept, and decline connection requests.

### Implementation Details
*   **Action Files**: `app/actions/connection-request.ts`, `app/actions/get-connections.ts`
*   **Functions**:
    *   `sendConnectionRequest(receiverId)`: Creates a new row in the `connection_requests` table with a status of `PENDING`. Prevents duplicate requests.
    *   `getConnections()`: Fetches all connection requests where the current user is either the sender or receiver. It joins the `profiles`, `student_profiles`, and `alumni_profiles` tables to provide full context to the frontend.
    *   `updateConnectionStatus(connectionId, status)`: Allows the receiver of a request to update the status to `ACCEPTED` or `REJECTED`.
*   **Automation**: If a request is `ACCEPTED`, a new conversation is automatically instantiated in the `conversations` table, and both users are added to `conversation_participants`.

---

## 3. Real-Time Messaging System

### Objective
Provide a platform for connected students and alumni to communicate seamlessly.

### Implementation Details
*   **Action File**: `app/actions/messages.ts`
*   **Functions**:
    *   `getConversations()`: Queries the `conversations` table for any conversation where the current user is a participant. It joins the other participant's profile data (name, avatar, role) and fetches the most recent message to display in the sidebar preview.
    *   `getMessages(conversationId)`: Retrieves all messages for a specific conversation, ordered by creation time.
    *   `sendMessage(conversationId, content)`: Inserts a new row into the `messages` table and revalidates the cache to update the UI.
*   **Frontend Integration**: The UI (`MessagesPage`) uses React state to implement optimistic UI updates, ensuring that sent messages appear instantly while the server action processes the database insertion in the background.

---

## Database Schema Highlights

The implementation relies heavily on the following Prisma models:
*   `profiles`: The root table containing user authentication links (Clerk ID), names, and avatars.
*   `alumni_profiles` / `student_profiles`: Extended tables containing role-specific data (college, department, passing year, expertise/skills).
*   `connection_requests`: Manages the state of networking requests between users.
*   `conversations` & `conversation_participants`: Manages chat rooms and access control.
*   `messages`: Stores the actual chat content, linked to conversations and senders.

## Maintenance Notes
*   All server actions enforce authorization by verifying the active session via `createSupabaseServerClient().auth.getUser()`.
*   Ensure that any schema modifications to Prisma are accompanied by `npx prisma generate` to update the TypeScript types across the server actions.
*   The connection pool configuration in `lib/db.ts` uses `@prisma/adapter-pg` to ensure smooth operation within Next.js Serverless and Turbopack environments.
