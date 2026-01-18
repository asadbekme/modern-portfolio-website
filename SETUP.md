# Portfolio Admin Dashboard - Setup Guide

## Overview

This guide explains the complete setup for making the Projects section dynamic with Supabase and implementing an Admin Dashboard.

## 📋 Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js 18+ installed
3. All dependencies installed (see Installation)

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr @tanstack/react-query @tanstack/react-table axios
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

## 🗄️ Database Setup

### 1. Create Tables

Run the SQL script in `lib/supabase/schema.sql` in your Supabase SQL Editor:

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `lib/supabase/schema.sql`
4. Execute the script

This creates:
- `projects` table (non-translatable data)
- `project_translations` table (translations for en, ru, uz)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps

### 2. Schema Design Rationale

**Why a relational translations table?**
- **Scalability**: Easy to add new languages without schema changes
- **Normalization**: Reduces data redundancy
- **Maintainability**: Single source of truth per translation
- **Flexibility**: Can fetch all languages or specific ones easily

**Why separate projects and translations?**
- Non-translatable fields (image, URLs, tech) stay in main table
- Clear separation of concerns
- Better indexing opportunities

## 🔐 Authentication Setup

### 1. Enable Email/Password Auth

In Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable "Email" provider
3. Configure email settings as needed

### 2. Create Admin User

1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password
4. Save the credentials (you'll use these to log in)

### 3. Row Level Security (RLS)

The schema includes RLS policies:
- **Public**: Can read published projects
- **Authenticated**: Can manage all projects (admin)

These policies are already defined in the schema SQL script.

## 📁 Project Structure

```
app/
├── [locale]/              # Public site with i18n
│   ├── _components/
│   │   └── projects.tsx   # Updated to fetch from API
│   └── layout.tsx         # Includes QueryProvider
├── admin/                 # Admin routes (protected)
│   ├── login/
│   │   └── page.tsx       # Login page
│   ├── layout.tsx         # Auth check (redirects if not logged in)
│   └── dashboard/
│       ├── layout.tsx     # Sidebar layout
│       └── projects/
│           ├── page.tsx   # Projects CRUD page
│           └── _components/
│               └── project-form.tsx
└── api/
    ├── projects/
    │   └── route.ts       # Public GET endpoint
    └── admin/
        └── projects/
            ├── route.ts   # GET, POST
            └── [id]/
                └── route.ts  # PUT, DELETE

lib/
└── supabase/
    ├── client.ts          # Browser client
    ├── server.ts          # Server client
    ├── middleware.ts      # Middleware client
    └── schema.sql         # Database schema

components/
└── data-table.tsx         # Reusable DataTable component

providers/
└── query-provider.tsx     # TanStack Query provider

types/
└── database.ts            # TypeScript types
```

## 🚀 Usage

### Admin Dashboard

1. Navigate to `/admin/login`
2. Log in with your admin credentials
3. You'll be redirected to `/admin/dashboard` (which redirects to `/admin/projects`)
4. Manage projects:
   - **Create**: Click "Add Project"
   - **Edit**: Click the edit icon (pencil)
   - **Delete**: Click the delete icon (trash)
   - **Toggle Publish**: Click the eye icon

### Public Site

The Projects section on the home page (`/`) now:
- Fetches projects dynamically from Supabase
- Shows only published projects
- Displays content in the current locale (en/ru/uz)
- Falls back gracefully if no projects are available

## 🔑 Key Features

### Authentication

- **Server-side protection**: All `/admin/*` routes check authentication server-side
- **Session persistence**: Uses Supabase SSR for cookie-based sessions
- **Automatic session refresh**: Middleware refreshes expired sessions
- **Secure logout**: Clears session on server and client

### Data Management

- **CRUD operations**: Full Create, Read, Update, Delete for projects
- **Multi-language support**: Manage translations for en, ru, uz in one form
- **Publish/Draft**: Control visibility without deleting
- **Display order**: Control project ordering

### UI Components

- **Reusable DataTable**: Built with TanStack Table, can be used for other entities
- **Form validation**: React Hook Form + Zod for type-safe validation
- **Error handling**: Toast notifications for user feedback
- **Loading states**: Proper loading and error states throughout

## 🛠️ API Endpoints

### Public

- `GET /api/projects?locale=en` - Get published projects for a locale

### Admin (Protected)

- `GET /api/admin/projects` - Get all projects (including drafts)
- `POST /api/admin/projects` - Create new project
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

### Auth

- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Sign out user
- `GET /api/auth/session` - Check current session

## 📝 TypeScript Types

All database types are defined in `types/database.ts`:

```typescript
type Project = {
  id: string;
  image: string;
  live_url: string | null;
  github_url: string | null;
  tech: string[];
  is_published: boolean;
  display_order: number;
  // ...
};

type ProjectTranslation = {
  id: string;
  project_id: string;
  locale: "en" | "ru" | "uz";
  title: string;
  description: string;
  // ...
};
```

## 🔒 Security Considerations

1. **RLS Policies**: Database-level security via Supabase RLS
2. **Server-side Auth Checks**: Every admin route verifies authentication
3. **Input Validation**: Zod schemas validate all form inputs
4. **Type Safety**: TypeScript ensures type correctness
5. **Environment Variables**: Sensitive keys only in `.env.local` (not committed)

## 🐛 Troubleshooting

### "Unauthorized" errors

- Check that you're logged in: `/admin/login`
- Verify RLS policies are enabled in Supabase
- Check browser console for auth errors

### Projects not showing on public site

- Verify projects are marked as `is_published = true`
- Check that translations exist for the current locale
- Check browser console for API errors

### Database connection issues

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Ensure Supabase project is active
- Check Supabase logs for errors

## 📚 Next Steps

- Add image upload functionality (Supabase Storage)
- Implement bulk operations (delete multiple, reorder)
- Add project categories/tags
- Implement version history/audit log
- Add export/import functionality

## 🎯 Architecture Decisions Explained

### Why TanStack Query?

- Efficient data fetching with caching
- Automatic refetching on window focus (disabled for admin)
- Optimistic updates support
- Built-in loading/error states

### Why TanStack Table?

- Fully typed with TypeScript
- Highly customizable
- Built-in sorting, filtering, pagination
- Reusable across different data types

### Why Axios?

- Better error handling than fetch
- Request/response interceptors
- Automatic JSON parsing
- Widely adopted and well-documented

### Why React Hook Form + Zod?

- Performance (uncontrolled components)
- Built-in validation with Zod
- Type inference from Zod schemas
- Excellent TypeScript support
