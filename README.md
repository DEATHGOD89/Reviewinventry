# VeriSpec Intel — High-Traffic Inventory & Trusted Review Platform

VeriSpec is a production-quality product inventory, specification verification, and trusted review platform. 

> [!IMPORTANT]
> **This is NOT an e-commerce store.** Users cannot place orders or make payments on this website. It is an inventory management, comparison, and trusted review platform. All purchase links redirect to approved external seller marketplaces in a new tab ("Buy from external seller").

---

## Visual Theme & Design System

The platform features an ultra-modern, high-contrast editorial tech theme inspired by the reference design:
- **Floating Pill Navigation**: Minimalist frosted glass navbar with section links, quick search trigger, and portal access.
- **Hero Showcase**: Bold headline (*"Feel the Future"*), central 360&deg; product view, floating interactive spec callout pills with indicator lines (*"Latex-Free Status"*, *"Barrier Testing"*), dark frosted glass cards, and live telemetry counters (*19 Master Items*, *100% Audit-Logged*).
- **Vision & 3-Angle Perspective Section**: Editorial clarity manifesto with interactive perspective carousel.
- **Cinematic Dark Feature Section**: High-contrast obsidian showcase highlighting PPE standards, chemical containment rules, and immutable audit logs.
- **Community Testimonials**: Dimensional rating cards with verified auditor badges, pros/cons, and quotes.
- **Watermark Footer**: Dark multi-column footer with massive subtle watermark branding, ISO compliance tags, and non-store transparency declarations.

---

## Initial Product Master (19 Items)

All initial products are seeded strictly as `DRAFT` / `UNVERIFIED` with zero fabricated facts:

### PPE & Safety Products (10 items)
1. **Cap** (`VS-PPE-001`, Head & Face Protection, disposable)
2. **Mask** (`VS-PPE-002`, Head & Face Protection, particulate barrier)
3. **Shoe cover** (`VS-PPE-003`, Foot Protection, cleanroom overshoe)
4. **Lab coat** (`VS-PPE-004`, Protective Clothing, reusable garment)
5. **Nitrile gloves** (`VS-PPE-005`, Gloves, synthetic examination)
6. **Cotton gloves** (`VS-PPE-006`, Gloves, knitted inspection)
7. **Chemical gloves** (`VS-PPE-007`, Gloves, heavy-duty barrier)
8. **Safety shoes** (`VS-PPE-008`, Foot Protection, steel-toe industrial)
9. **Black nitrile gloves** (`VS-PPE-009`, Gloves, automotive/tactical)
10. **Electrical gloves** (`VS-PPE-010`, Gloves, dielectric insulating)

### Cleaning, Hygiene & Chemical Products (9 items)
11. **Caustic soda** (`VS-CHM-011`, Sodium Hydroxide; hazard class, active ingredients, and PPE marked *"Requires manufacturer SDS/label verification"*)
12. **Divo Flow** (`VS-CHM-012`, Unverified trademarked name placeholder)
13. **Softcare Plus Sanitizer** (`VS-HYG-013`, Unverified trademarked name placeholder)
14. **Suma Det.** (`VS-CHM-014`, Stored strictly as single initial record)
15. **Toilet cleaner** (`VS-CHM-015`, Sanitary descaler placeholder)
16. **Handwash** (`VS-HYG-016`, Bulk liquid hand soap placeholder)
17. **Suma Breakup** (`VS-CHM-017`, Heavy-duty degreaser placeholder)
18. **Garbage bags** (`VS-WST-018`, Heavy-duty refuse containment)
19. **Dustbin** (`VS-WST-019`, Industrial pedal waste container)

---

## Tech Stack

- **Framework**: Next.js (App Router, current stable release, TypeScript strict mode)
- **Database**: PostgreSQL with Prisma ORM (43 normalized tables)
- **Styling**: Tailwind CSS + custom high-contrast frosted glass design system
- **Security & RBAC**: JWT Sessions with Role-Based Access Control (`PUBLIC_VISITOR`, `REGISTERED_REVIEWER`, `MANAGEMENT_STAFF`, `OWNER_ADMIN`, `MODERATOR`)
- **Inventory & Telemetry**: Stock movements with mandatory justification reasons and immutable audit logging
- **Storage**: Pluggable storage adapter (Local disk fallback + AWS S3 / Cloudflare R2 compatible)
- **Containerization**: Multi-stage `Dockerfile` and `docker-compose.yml`

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+ or 24+
- npm 10+

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The defaults in `.env.example` work out of the box with zero external credentials required)*

### 4. Run Automated Tests
```bash
npm run test
```
*(Runs 10 workflow tests verifying catalog integrity, mandatory reasons, currency converter, and review moderation)*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker Deployment

To launch the full production environment (PostgreSQL 16, Redis 7, and Next.js Web App):

```bash
docker-compose up -d --build
```

Access:
- Web App: [http://localhost:3000](http://localhost:3000)
- Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## Database Migration & Seeding (PostgreSQL)

When running against a live PostgreSQL instance:

```bash
# Push schema to database
npx prisma db push

# Seed 19 initial master products, categories, locations, and environment users
npm run db:seed
```

---

## Default Roles & Access

| Role | Portal Route | Default Email | Default Password (Configurable in .env) |
|---|---|---|---|
| **Owner / Admin** | `/admin` | `owner@verispec.local` | `ChangeMeOnFirstLogin2026!` |
| **Management Staff** | `/management` | `manager@verispec.local` | `ManagerAccess2026!` |
| **Field Reviewer** | `/products` | `reviewer@verispec.local` | `ReviewerAccess2026!` |

---

## Backup & Recovery Instructions

### PostgreSQL Backup
```bash
docker exec -t verispec-postgres pg_dumpall -c -U postgres > backup_$(date +%Y%m%d_%H%M%S).sql
```

### PostgreSQL Restore
```bash
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i verispec-postgres psql -U postgres -d inventry_db
```

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx               # High-contrast Visora-style Homepage
│   │   │   ├── products/              # Catalogue & search with multi-facet filters
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx    # Product Detail: Specs, SDS, Reviews, External Buy links
│   │   │   ├── compare/page.tsx       # Up to 4 products side-by-side comparison
│   │   │   ├── reviews/page.tsx       # Community & auditor review registry
│   │   │   ├── glossary/page.tsx      # Standards & chemical glossary
│   │   │   ├── safety/page.tsx        # Safety disclaimers & non-store rules
│   │   │   ├── disclaimer/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   └── accessibility/page.tsx
│   │   ├── management/page.tsx        # Management Portal (Inventory, Products, Moderation)
│   │   ├── admin/page.tsx             # Owner Portal (Audit Logs, Users, API Secrets)
│   │   ├── login/page.tsx             # RBAC Authentication page
│   │   └── api/
│   │       ├── auth/                  # Login / Logout session handlers
│   │       └── health/                # JSON Telemetry health check
│   ├── components/
│   │   ├── home/                      # HeroShowcase, Vision, Features, ReviewsCarousel
│   │   ├── layout/                    # Floating Pill Navbar, Dark Watermark Footer
│   │   └── ui/                        # VerificationBadge, CurrencySelector
│   └── lib/
│       ├── auth.ts                    # JWT Session engine & RBAC guards
│       ├── audit.ts                   # Immutable audit logger
│       ├── catalog-data.ts            # Master data snapshot of 19 initial products
│       ├── prisma.ts                  # PostgreSQL Prisma client singleton
│       └── services/
│           ├── inventory.ts           # Stock movements with mandatory reasons
│           ├── reviews.ts             # Anti-spam review moderation
│           ├── currency.ts            # ISO 4217 converter with disclaimer
│           ├── storage.ts             # Pluggable S3/R2/Local file storage
│           └── ai.ts                  # Safe server-side AI provider adapter
├── prisma/
│   ├── schema.prisma                  # 43 normalized PostgreSQL models
│   └── seed.ts                        # Master seed script
├── public/
│   └── templates/                     # CSV product and inventory import templates
├── tests/
│   └── workflows.test.ts              # Native automated test suite
├── Dockerfile                         # Production multi-stage Docker build
└── docker-compose.yml                 # Orchestration (PostgreSQL, Redis, App)
```
