# VeriSpec Industrial Platform: Production Deployment & Go-Live Blueprint

This guide provides the complete, battle-tested roadmap for transitioning your VeriSpec / Inventra Industrial Inventory & Safety Verification Platform from local development to an enterprise-grade, high-availability, zero-downtime production environment.

---

## 1. Production Architecture Overview

```
                          [ Internet Traffic / Enterprise Users ]
                                             │
                                     ( Cloudflare CDN / WAF )
                                    ├── SSL / TLS 1.3 Termination
                                    ├── DDoS Mitigation & Edge Cache
                                    └── Security Headers & CSP
                                             │
                                  [ Next.js 16 App Server ]
                              (Vercel / AWS ECS / Railway / Render)
                                ├── App Router SSR & Dynamic Telemetry
                                ├── Server Action Security & RBAC Guards
                                └── OpenCode Zen AI Adapter
                                   │                   │
                     ┌─────────────┴────────┐          │
                     ▼                      ▼          ▼
            [ PostgreSQL 16 ]         [ Redis 7 ]   [ Cloudflare R2 / S3 ]
         (Supabase / Neon / RDS)       (Upstash)    (SDS Technical PDFs)
         ├── 816-Line Strict Schema    ├── Session Cache
         ├── Foreign Key Constraints   ├── Rate Limiting
         └── Immutable Audit Tables    └── Queue Daemon
```

---

## 2. Step-by-Step Production Deployment

### Step 1: Managed PostgreSQL Database Setup
VeriSpec is built on an enterprise relational data model with foreign key cascades, unique compound indexes, and immutable audit trails.

1. **Provision Managed Database**:
   - **Recommended Options**: [Supabase](https://supabase.com) (Free tier available), [Neon Postgres](https://neon.tech), or [AWS RDS PostgreSQL](https://aws.amazon.com/rds/).
   - Obtain your production connection string:
     ```env
     DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres?sslmode=require"
     ```
2. **Apply Database Schema**:
   Run schema sync from your build machine or CI/CD pipeline:
   ```bash
   npx prisma db push
   ```
3. **Execute Production Seed Script**:
   Seeds the mandatory 19 initial master products (10 PPE + 9 Chemical/Hygiene) and sets up the initial Owner administrator:
   ```bash
   npm run db:seed
   ```

---

### Step 2: Managed Redis Setup (Sessions & Rate Limiting)
1. **Provision Managed Redis**:
   - **Recommended**: [Upstash Redis](https://upstash.com) (Serverless Redis, free tier, low-latency globally).
2. **Configure Connection**:
   ```env
   REDIS_URL="rediss://default:[YOUR-TOKEN]@[YOUR-ENDPOINT].upstash.io:6379"
   ```
   *(Note: If left empty, the application automatically falls back to in-memory state tracking without crashing).*

---

### Step 3: Cloud Object Storage (SDS PDFs & Product Imagery)
1. **Provision Object Storage**:
   - **Recommended**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) (Zero egress fees, S3-compatible) or [AWS S3](https://aws.amazon.com/s3/).
2. **Configure Environment Variables**:
   ```env
   STORAGE_PROVIDER="s3"
   AWS_ACCESS_KEY_ID="your-access-key-id"
   AWS_SECRET_ACCESS_KEY="your-secret-access-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET_NAME="verispec-production-documents"
   ```

---

### Step 4: Production Secrets & Security Hardening
Generate cryptographic keys and lock down environment variables:

1. **Generate High-Entropy Auth Secret**:
   In PowerShell or bash, generate a 32+ character random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. **Set Environment Keys**:
   ```env
   NODE_ENV="production"
   AUTH_SECRET="[GENERATED_32_CHAR_HEX_KEY]"
   NEXTAUTH_URL="https://yourdomain.com"
   AI_PROVIDER_API_KEY="sk-your-actual-opencodezen-or-openai-key"
   AI_PROVIDER_BASE_URL="https://api.opencodezen.com/v1"
   ```

---

### Step 5: Hosting & Deployment Methods

#### Option A: Vercel (Fastest & Simplest)
1. Push your repository to GitHub or GitLab.
2. Link the repository to [Vercel](https://vercel.com).
3. Under **Settings &rarr; Environment Variables**, paste your production keys (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `REDIS_URL`, `AI_PROVIDER_API_KEY`).
4. Click **Deploy**. Vercel will automatically build and distribute the app across its global Edge Network.

#### Option B: Docker Container (Self-Hosted / AWS / Railway / Render / DigitalOcean)
Use the included multi-stage [`Dockerfile`](../Dockerfile) and [`docker-compose.yml`](../docker-compose.yml):
```bash
# Build production image
docker build -t verispec-platform:latest .

# Run with environment variables
docker run -d -p 3000:3000 --env-file .env verispec-platform:latest
```

---

## 3. Post-Deployment Verification Checklist

Before opening the site to internal facility managers and public safety auditors:

- [ ] **Health Check Verification**: Navigate to `https://yourdomain.com/api/health` and ensure status returns `HTTP 200 OK` with active database telemetry.
- [ ] **First-Run Owner Password Change**: Log into `/login` with initial setup credentials and immediately rotate password in the Owner Portal (`/admin`).
- [ ] **Sitemap & Robots Validation**: Verify `https://yourdomain.com/sitemap.xml` and `https://yourdomain.com/robots.txt` render clean XML and allow correct public routes.
- [ ] **Webhook Alert Test**: In `/management` &rarr; *Low-Stock Alerts & Webhooks*, click **Dispatch Notice** to confirm your Slack/Email webhook receives incident payloads.
- [ ] **Mobile Floor Scan Test**: Open `/management` on a smartphone, tap **Scan Barcode / QR**, and verify the camera targeting reticle reads warehouse shelf tags.
- [ ] **Zero-Hallucination Compliance Check**: Confirm [Caustic Soda](https://yourdomain.com/products/caustic-soda) retains the mandatory disclaimer: *"Requires manufacturer SDS/label verification"*.
