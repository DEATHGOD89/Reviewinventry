# VeriSpec Architecture & Security Boundary Guide

## 1. System Topology & Separation of Concerns

```
[ Public Visitors ]          [ Management Staff ]          [ Owner / Admin ]
        |                              |                           |
        v                              v                           v
  Public Pages                 Management Portal              Owner Portal
 (SSR / Static Cache)           (Role-Guarded)              (MFA / Secret Guard)
        \                              |                           /
         \                             v                          /
          -----> [ Server-Side Domain Services Layer ] <---------
                            |                 |
                +-----------+                 +-----------+
                v                                         v
     [ Data Storage: PostgreSQL ]                [ Redis Cache & Rates ]
```

## 2. Security Boundaries & Zero-Leakage Policy
- **Suppliers & Landed Costs**: Private purchase prices, wholesale costs, supplier emails, and lead times are stored in isolated models and are never serialized to public clients.
- **External Purchase Links**: All external seller links strictly point to owner-allowlisted domains (`amazon.in`, `indiamart.com`, `moglix.com`, etc.) and open in a new tab with clear labeling. Arbitrary URL redirects are rejected.
- **AI Integration Isolation**: The `AI_PROVIDER_API_KEY` is maintained strictly as a server environment secret. It is never included in client bundles. All AI outputs are labeled `AI_DRAFT` and require human verification.
- **Audit Immutability**: Every stock adjustment, review moderation action, user role change, and product draft creation produces an immutable audit record.

## 3. High-Traffic Caching Strategy
- Public product pages and catalogue lists are statically prerendered and cached.
- Indicative exchange rates use an in-memory cache refreshed on scheduled intervals.
- Community reviews are cached at the product aggregate level and invalidated whenever a moderator approves a new review.
