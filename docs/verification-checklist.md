# Verification Checklist & Production Readiness

## 1. Features Implemented & Operational
- [x] **Next.js App Router Architecture**: Current stable Next.js release with TypeScript strict mode.
- [x] **Futuristic High-Contrast Design Theme**: Replicates the reference image's visual structure (floating pill navigation, hero with interactive callouts and indicator lines, dark frosted cards, stats counters, vision carousel, and dark cinematic feature section).
- [x] **19 Initial Master Products Seeded**:
  - 10 PPE & Safety Products (Cap, Mask, Shoe cover, Lab coat, Nitrile gloves, Cotton gloves, Chemical gloves, Safety shoes, Black nitrile gloves, Electrical gloves)
  - 9 Cleaning, Hygiene & Waste Products (Caustic soda, Divo Flow, Softcare Plus Sanitizer, Suma Det., Toilet cleaner, Handwash, Suma Breakup, Garbage bags, Dustbin)
  - Suma Det. stored strictly once.
  - All records marked as `DRAFT` and `UNVERIFIED`.
- [x] **Zero Fabricated Claims**:
  - Caustic soda and chemical attributes explicitly marked: *"Requires manufacturer SDS/label verification"*.
  - No invented certifications, prices, or health claims.
- [x] **Non-Store Architecture**:
  - External purchase buttons open verified supplier links in a new tab ("Buy from external seller").
  - No checkout or payment processing.
- [x] **Indicative Currency Converter**: ISO 4217 support (default INR, USD, EUR, GBP, AED) with clear indicative disclaimer and source timestamp.
- [x] **Inventory Operations with Mandatory Reasons**: Manual adjustments reject reasons shorter than 5 characters and log immutable audit entries.
- [x] **Review Moderation Queue**: Registered reviewer submissions start as `PENDING` until approved by management/owner.
- [x] **Role-Based Access Control (RBAC)**: Clean separation between Public visitor, Registered reviewer, Management staff, and Owner/Admin.
- [x] **Docker Infrastructure**: Multi-stage `Dockerfile` and `docker-compose.yml` (PostgreSQL 16, Redis 7, App).
- [x] **Automated Test Suite**: 10 workflow tests passing with 0 failures.

---

## 2. Features Requiring Real Production Credentials
- [ ] **AI Provider Adapter**: Configure `AI_PROVIDER_API_KEY` (server-side secret) in production `.env` to enable live LLM draft suggestions.
- [ ] **Live Exchange Rates API**: Add real forex provider API key to `EXCHANGE_RATE_API_KEY` to replace static baseline rates.
- [ ] **Object Storage (S3 / Cloudflare R2)**: Provide `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET` for production media uploads.
- [ ] **Production PostgreSQL Database**: Set `DATABASE_URL` pointing to the live PostgreSQL instance.

---

## 3. Data Requiring Owner Verification
- [ ] **Chemical Safety Data Sheets (SDS)**: Upload official manufacturer SDS documents for Caustic Soda, Suma Det., Divo Flow, Suma Breakup, and Toilet Cleaner.
- [ ] **Trademarked Formulation Identities**: Confirm manufacturer, active ingredients, and brand names for Divo Flow, Softcare Plus Sanitizer, Suma Det., and Suma Breakup.
- [ ] **PPE Test Certificates**: Upload EN ISO 374-1 test reports for Chemical Gloves, ASTM D120 voltage ratings for Electrical Gloves, and EN ISO 20345 certs for Safety Shoes.
- [ ] **Supplier Purchase Contracts**: Register verified supplier purchase prices and lead times in the private management directory.
