# Atse Yohannes Alumni Association (AYAA)

Full-stack website + admin CMS + member portal for the Atse Yohannes Alumni Association.

## Stack

- **Frontend:** React 19 + Vite + TypeScript + emotion + framer-motion + react-router
- **Data:** Firestore via React Query (with seed-data fallback if Firebase isn't configured)
- **Auth:** Firebase Authentication (Email/Password)
- **Storage:** Firebase Storage (uploads abstracted; pluggable to Cloudinary later)
- **Hosting:** Firebase Hosting
- **Project:** `atse-yohannes` (region: `nam5` US multi-region, plan: Blaze)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in Firebase web config
npm run dev
```

Public site renders with seed data even before `.env.local` is filled.

## Deploy

The Firebase CLI must be authenticated to `tigrayinsights@gmail.com`:
```bash
firebase login:list   # confirm tigrayinsights@gmail.com is logged in
```

Then:
```bash
npm run deploy             # build + deploy hosting + rules + indexes
npm run deploy:hosting     # build + deploy only the static site
npm run deploy:rules       # deploy only Firestore + Storage rules
```

## Project structure

```
src/
├─ components/
│  ├─ admin/       Admin shell (AdminLayout, CollectionManager, ItemEditor, ImageUpload, FieldInput)
│  ├─ auth/        ProtectedRoute
│  ├─ events/      RsvpModal
│  ├─ layout/      Header, Footer, Layout
│  ├─ sections/    Public homepage sections (Hero, Programs, ProjectsOverview, ...)
│  ├─ ui/          Button, Card
│  └─ NewsletterSignup.tsx
├─ pages/
│  ├─ admin/       Setup, Login, Dashboard, HeroEditor, SettingsEditor,
│  │               ApplicationsManager, MembersManager, RsvpsManager, SubmissionsManager
│  └─ ...          Public pages (Home, About, Projects, ...) + Member portal pages
├─ admin/          schemas.ts — declarative collection schemas drive all CRUD editors
├─ services/       content.service.ts (read-through), seed.service.ts, upload.service.ts
├─ hooks/          useAuth, useContent (React Query), useDocumentTitle
├─ providers/      AuthProvider, QueryProvider, SmoothScrollProvider
├─ config/         firebase.ts (lazy-init Firebase clients)
├─ data/           content.ts (seed/fallback data)
└─ utils/          iconMap.ts (lucide name → component)
```

## URL map

### Public
| Path | Page |
|---|---|
| `/` | Home (Hero, ImpactMetrics, Programs, ImpactStory, ProjectsOverview, CommunityGallery, GetInvolved, AlumniNetwork, LatestUpdates, FinalCTA) |
| `/about` | About (mission, values, how-we-work, leadership) |
| `/projects` | Project listings |
| `/impact` | Key achievement metrics + featured story |
| `/resources` | Resources hub (public + member-gated items) |
| `/get-involved` | Membership + volunteer + donate paths |
| `/events` | Event listings + RSVP modal |
| `/donate` | Donation tiers |
| `/news` | News & updates listings |
| `/contact` | Contact form + org info |

### Member portal (signed-in users)
| Path | Page |
|---|---|
| `/portal/signup` | Member account signup |
| `/portal/login` | Member sign-in |
| `/portal/apply` | Membership application form |
| `/portal` | Member dashboard (status, profile, member-only quick links) |

### Admin (admin/super_admin role only)
| Path | Page |
|---|---|
| `/admin/setup` | First-time super_admin claim (locks after first use) |
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard with collection counts + one-click "Seed Firestore" |
| `/admin/hero` | Hero editor |
| `/admin/settings` | Org info, contacts, social links, story content |
| `/admin/programs` `/admin/projects` `/admin/news` `/admin/events` `/admin/leadership` `/admin/chapters` `/admin/donationTiers` `/admin/resources` `/admin/impactMetrics` | Schema-driven CRUD |
| `/admin/applications` | Review membership applications, approve/reject |
| `/admin/members` | Member directory + visibility toggles |
| `/admin/rsvps` | Event RSVPs across all events |
| `/admin/inbox` | Contact form submissions + newsletter subscribers |

## Firestore data model

| Collection | Owner | Description |
|---|---|---|
| `users/{uid}` | system | Auth user → role |
| `system/bootstrap` | system | One-shot sentinel for super_admin bootstrap |
| `content/{hero,org,story,about,committees}` | admin | Singleton site content |
| `programs`, `projects`, `news`, `events`, `leadership`, `chapters`, `donationTiers`, `resources`, `impactMetrics`, `values`, `howWeWork` | admin | Site collections (Firestore rules: public read, admin write) |
| `membershipApplications/{id}` | user | Member's application; admin approves/rejects |
| `members/{uid}` | user/admin | Member profile (one per user) |
| `events/{slug}/rsvps/{id}` | public | Event RSVPs (public write, admin read) |
| `contactSubmissions/{id}` | public | Contact form submissions (public write, admin read) |
| `newsletterSubscriptions/{id}` | public | Newsletter signups |

## First-time setup workflow

1. Deploy: `npm run deploy`
2. Visit `/admin/setup` on the deployed site → create the first super_admin account
3. From the admin Dashboard, click **"Seed Firestore from local content"** to copy seed data
4. Edit Hero / Settings / etc. via the admin
5. Members can now sign up at `/portal/signup`, apply at `/portal/apply`, you approve from `/admin/applications`

## Image strategy

- Public-static images: `public/` (deployed as-is by Firebase Hosting)
- Admin uploads: Firebase Storage via `src/services/upload.service.ts`
- Future Cloudinary migration: set `VITE_UPLOAD_PROVIDER=cloudinary` and fill `VITE_CLOUDINARY_*` — no other code changes
- All large `<img>` tags use `loading="lazy"`

## Security model

- Firestore rules in `firestore.rules` enforce roles (`super_admin > admin > member > guest`)
- Storage rules in `storage.rules` mirror — admin writes to `site/`, `projects/`, `news/`, `events/`, `resources/public/`; members can read `resources/members/`; users own `users/{uid}/*`
- Admin role can only be granted by another admin (rule-enforced)
- Bootstrap is one-shot: the `/system/bootstrap` document gates the special "first user becomes super_admin" path

## Content abstraction

`useContent` hooks read through `contentService`, which transparently:
- Returns Firestore data when available
- Falls back to `src/data/content.ts` seed data when Firestore is empty/unconfigured

This means the public site renders correctly with no backend, the dev server works without `.env.local`, and the admin can edit via Firestore once configured.

## Things to do later

- Migrate Storage to Cloudinary (free tier, no Blaze required) — flip env var
- Add EmailJS for contact form / RSVP confirmations (free 200/mo) — no backend
- Add a deploy preview on PRs (Firebase Hosting channels)
- Lighthouse pass + image optimization (responsive `srcset`)
- Add a richer event detail page with photo gallery
- Donation flow (Stripe Payment Links — no Cloud Functions needed)
