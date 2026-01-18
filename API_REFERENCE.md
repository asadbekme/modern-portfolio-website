# API Reference

## Public Endpoints

### Get Projects by Locale
```
GET /api/projects?locale=en
```

**Query Parameters:**
- `locale` (required): `en` | `ru` | `uz`

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "title": "Project Title",
      "description": "Project description",
      "image": "/projects/project1.png",
      "tech": ["React", "Next.js"],
      "liveUrl": "https://example.com",
      "githubUrl": "https://github.com/user/repo"
    }
  ]
}
```

**Notes:**
- Only returns published projects (`is_published = true`)
- Automatically filters by locale
- Public endpoint - no authentication required

---

## Admin Endpoints

All admin endpoints require authentication. Include session cookie in requests.

### Get All Projects (Admin)
```
GET /api/admin/projects
```

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "image": "/projects/project1.png",
      "live_url": "https://example.com",
      "github_url": "https://github.com/user/repo",
      "tech": ["React", "Next.js"],
      "is_published": true,
      "display_order": 0,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "translations": {
        "en": {
          "title": "Project Title",
          "description": "Project description"
        },
        "ru": {
          "title": "Название проекта",
          "description": "Описание проекта"
        },
        "uz": {
          "title": "Loyiha nomi",
          "description": "Loyiha tavsifi"
        }
      }
    }
  ]
}
```

**Notes:**
- Returns all projects (including drafts)
- Includes all translations
- Requires authentication

---

### Create Project
```
POST /api/admin/projects
```

**Request Body:**
```json
{
  "image": "/projects/project1.png",
  "live_url": "https://example.com",
  "github_url": "https://github.com/user/repo",
  "tech": ["React", "Next.js", "TypeScript"],
  "is_published": false,
  "display_order": 0,
  "translations": {
    "en": {
      "title": "Project Title",
      "description": "Project description"
    },
    "ru": {
      "title": "Название проекта",
      "description": "Описание проекта"
    },
    "uz": {
      "title": "Loyiha nomi",
      "description": "Loyiha tavsifi"
    }
  }
}
```

**Response:** `201 Created`
```json
{
  "project": {
    "id": "uuid",
    // ... project data
  }
}
```

**Validation:**
- `image`: Must be valid URL
- `live_url`: Optional, must be valid URL if provided
- `github_url`: Optional, must be valid URL if provided
- `tech`: Array of strings, at least one required
- `translations`: All three locales (en, ru, uz) required with title and description

---

### Update Project
```
PUT /api/admin/projects/[id]
```

**Request Body:** Same as Create Project

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Notes:**
- Updates project and all translations
- Uses upsert for translations (creates if doesn't exist)

---

### Delete Project
```
DELETE /api/admin/projects/[id]
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Notes:**
- Cascades to delete all translations (via database CASCADE)
- Cannot be undone

---

## Authentication Endpoints

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    // ... other user fields
  },
  "session": {
    "access_token": "...",
    // ... session data
  }
}
```

**Errors:**
- `400`: Email or password missing
- `401`: Invalid credentials

**Notes:**
- Sets session cookie automatically
- Session persists across requests

---

### Logout
```
POST /api/auth/logout
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Notes:**
- Clears session cookie
- Redirect to `/admin/login` after logout

---

### Check Session
```
GET /api/auth/session
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

**If not authenticated:**
```json
{
  "user": null
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

**Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not authenticated)
- `404`: Not Found
- `500`: Internal Server Error

---

## Example Usage

### Fetch projects in a component:
```typescript
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { data } = useQuery({
  queryKey: ["projects", locale],
  queryFn: async () => {
    const response = await axios.get(`/api/projects?locale=${locale}`);
    return response.data;
  },
});
```

### Create project:
```typescript
await axios.post("/api/admin/projects", {
  image: "/projects/project1.png",
  live_url: "https://example.com",
  github_url: "https://github.com/user/repo",
  tech: ["React", "Next.js"],
  is_published: true,
  display_order: 0,
  translations: {
    en: { title: "My Project", description: "Description" },
    ru: { title: "Мой проект", description: "Описание" },
    uz: { title: "Mening loyiham", description: "Tavsif" },
  },
});
```

---

## Authentication Flow

1. User visits `/admin/login`
2. Enters email/password
3. Frontend calls `POST /api/auth/login`
4. Backend authenticates with Supabase
5. Session cookie is set
6. User redirected to `/admin/dashboard`
7. All subsequent requests include session cookie
8. Middleware refreshes session if expired
9. Server-side checks verify authentication on each request
