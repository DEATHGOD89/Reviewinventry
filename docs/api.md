# VeriSpec / Inventra API Documentation

This document describes the HTTP API routes, authentication contracts, request payloads, and response structures for the platform.

---

## 1. Authentication & Session

### `POST /api/auth/login`
Authenticates credentials and establishes an HTTP-only secure session cookie.

**Request Payload:**
```json
{
  "email": "owner@verispec.local",
  "password": "ChangeMeOnFirstLogin2026!"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "id": "usr-owner-01",
    "email": "owner@verispec.local",
    "name": "System Owner",
    "role": "OWNER_ADMIN"
  }
}
```

**Error Response (`401 Unauthorized`):**
```json
{
  "error": "Invalid credentials. Please verify your email and password."
}
```

---

### `POST /api/auth/logout`
Terminates the current session and clears the session cookie.

**Response (`200 OK`):**
```json
{
  "success": true
}
```

---

## 2. Health & Monitoring

### `GET /api/health`
Kubernetes and uptime monitor health check returning telemetry.

**Response (`200 OK`):**
```json
{
  "status": "healthy",
  "uptimeSeconds": 482,
  "timestamp": "2026-09-07T15:52:00.000Z",
  "version": "1.0.0",
  "catalog": {
    "initialMasterProductsCount": 19,
    "auditLogsRecorded": 15
  },
  "environment": {
    "nodeEnv": "production",
    "aiProviderConfigured": false,
    "defaultCurrency": "INR"
  }
}
```

---

## 3. Product & Inventory Services

### `POST /api/inventory/adjustment` (Management / Owner Only)
Records a stock change across warehouses. Enforces mandatory reason recording.

**Request Payload:**
```json
{
  "productId": "prod-001",
  "movementType": "STOCK_IN",
  "quantity": 50,
  "mandatoryReason": "Supplier consignment delivery batch 8840"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "newStock": 500,
  "message": "Stock updated for Cap. Previous: 450, Current: 500."
}
```

---

## 4. Review Submission & Moderation

### `POST /api/reviews/submit` (Registered Reviewer)
Submits a field assessment. All submissions enter `PENDING` moderation.

**Request Payload:**
```json
{
  "productId": "prod-005",
  "productName": "Nitrile gloves",
  "reviewerName": "A. Sharma (Safety Auditor)",
  "reviewerEmail": "auditor@pharma.local",
  "rating": 5,
  "title": "Cleanroom barrier trial",
  "content": "Pinhole integrity maintained throughout 6 hour solvent packaging trial.",
  "pros": "Consistent cuff elasticity",
  "cons": "Requires formal EN 374 chemical chart upload"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Thank you! Your review has been submitted and is currently in the moderation queue for verification.",
  "review": {
    "id": "rev-1788796261891",
    "status": "PENDING"
  }
}
```
