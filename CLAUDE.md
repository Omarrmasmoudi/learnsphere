# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                 # Next.js dev server on http://localhost:3000
npm run build               # production build
npm run lint                # next lint (ESLint 9, eslint-config-next)
npx tsc --noEmit            # type-check — the build will NOT catch type errors (see below)
npx prisma migrate dev      # apply/create migrations against DATABASE_URL
npx prisma generate         # regenerate @prisma/client after schema changes

# Sentiment service (needed for course feedback; see sentiment-service/README.md)
cd sentiment-service && .venv/Scripts/python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Vitest, jsdom and Testing Library are installed as dev dependencies, but there is no `test` script, no vitest config, and no test files in the main tree yet. Run a single test with `npx vitest run path/to/file.test.ts` once a config exists.

`next.config.mjs` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, so `npm run build` succeeding says nothing about lint or types — run `npm run lint` and `npx tsc --noEmit` explicitly.

Required env vars are listed in `.env.example`: `DATABASE_URL` (PostgreSQL), `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, `UPLOADTHING_TOKEN`, `SENTIMENT_SERVICE_URL`.

## Architecture

Next.js 15 App Router + React 19, TypeScript, Prisma on PostgreSQL, Tailwind + shadcn/ui (`components/ui/` is generated shadcn code; `@/*` path alias maps to the repo root). A separate Python FastAPI service in `sentiment-service/` does speech-to-text and sentiment scoring.

### Auth and sessions
- Sessions are HS256 JWTs (via `jose`) stored in an **httpOnly cookie** named `session`. The token's `sub` is the numeric user id; nothing else is in the payload.
- `lib/auth/session.ts` is edge-safe (no Prisma, no Node APIs) because `middleware.ts` imports it. Keep it that way.
- `middleware.ts` only checks that a valid session exists and only for page routes in its `matcher` (`/teacher/*`, `/become-teacher`); it redirects to `/login?next=...`. API routes are not matched and must authenticate themselves, returning 401/403 JSON.
- Server-side, use `getSessionUserId()` (cookie only, no DB) or `getCurrentUser()` (DB lookup + role) from `lib/action/auth.ts`.
- Login/register/logout routes under `app/api/auth/` set or clear the cookie with `sessionCookieOptions`; passwords are hashed with `bcrypt`.

### Roles
- There is no role column. Role is derived from the presence of `Teacher` / `Admin` relation rows on `User`: `roleFrom()` in `lib/auth/roles.ts` returns `ADMIN | TEACHER | STUDENT`. `canTeach()` is true for teachers and admins.
- `lib/auth/roles.ts` is pure and imported by client components — don't add server imports there.
- `app/teacher/layout.tsx` redirects non-teachers to `/become-teacher`, but that is navigation only. **Every teacher API route must repeat the `getCurrentUser()` + `canTeach()` check** and scope queries to `instructorId: user.id` (see `app/api/create-courses/`).
- `POST /api/become-teacher` upgrades the current user by creating a `Teacher` row.

### Data model (`prisma/schema.prisma`)
`User` (int id) → `Course` (uuid string id, `instructorId`, denormalized `instructorName`, `published` flag; table `courses`) → `Section` (`sections`) → `Video` (`videos`). `Enrollment` (unique per user+course), `Rating` and `CourseFeedback` (unique per user+course) link users to courses. All child relations cascade on delete. Public course listings (`/api/courses`) only return `published: true` courses.

### Course API layout
- `app/api/courses` — public reads (published only).
- `app/api/create-courses` (POST) and `app/api/create-courses/[id]` (PATCH) — teacher create/edit, including nested sections and videos.
- `app/api/teachercourses` — the signed-in teacher's own courses.
- Server actions in `lib/action/` (`courses.ts`, `teacher-courses.ts`) are used alongside the API routes.
- `lib/data/courses.ts` is static mock course data, not the database.

### Uploads
UploadThing: the file router is `lib/uploadthingConfig.ts` (`courseImage` up to 4MB, `courseVideo` up to 512MB), exposed at `app/api/uploadThings/route.ts`; client helpers are in `lib/utils/uploadthing.ts`. Uploads store the returned file URL on `Course.image`/`Course.video`/`Video.url`.

### Course feedback / sentiment
- Students leave written or spoken feedback from the course page (`components/courses/course-feedback.tsx`). It is scored 1–5 stars and teachers see it at `/teacher/courses/[id]/feedback`.
- Flow: browser → `POST /api/courses/[id]/feedback` → `lib/sentiment/service.ts` → `sentiment-service/` (Whisper + multilingual BERT) → upserted into `CourseFeedback`. The browser never calls the Python service directly.
- Voice notes are converted to 16 kHz mono 16-bit WAV **in the browser** (`lib/utils/wav.ts`) so the Python side needs no ffmpeg. Only the transcript is stored, never audio.
- `lib/sentiment/labels.ts` is pure (imported by client components); `lib/sentiment/service.ts` is server-only. `SentimentServiceError` carries a status and a user-safe message that the route passes through.
- Anyone signed in except the course's instructor can leave feedback on a published course. It is not gated on `Enrollment`, because nothing creates enrollments yet (the payment page is a mock).
- `sentiment-service/requirements.txt` pins `transformers<5`: 5.x fails to import with the torch 2.6 CPU build.
