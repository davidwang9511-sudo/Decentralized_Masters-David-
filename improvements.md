# Notes on Trade-offs & Areas for Improvement

This project was completed within a limited 4–6 hour window, requiring several intentional trade-offs in architecture, security, and UX. Below is a clear breakdown of decisions made and proposed improvements for a production-ready implementation.

---

## ⚖️ Trade-offs Made

### 1. Simplified Authentication Flow
- Implemented minimal OTP verification + wallet connection.
- MFA steps (SMS, Email, WebAuthn) were simplified or omitted.

**Improvement:** Implement full Dynamic Headless MFA, including per-action verification and device binding.

---

### 2. Lightweight State Management
- Used React Context instead of Zustand/Redux.

**Improvement:** Migrate to Zustand with persistence for scalable and optimized state handling.

---

### 3. Limited Error Handling
- No global Axios interceptors.
- No retry logic.
- Basic error UI.

**Improvement:** Add interceptors, toast notifications, and React error boundaries.

---

### 4. Simplified Backend Architecture
- Single signature service.
- Minimal logging.
- No layered architecture.

**Improvement:** Add Pino/Winston logging, multi-layer architecture, and Redis-based rate limiting.

---

### 5. No Database Integration
- No persisted users, sessions, MFA states, or logs.

**Improvement:** Integrate PostgreSQL or DynamoDB for persistent user, wallet, and signature activity records.

---

### 6. Basic UI/UX
- Minimal styling.
- No animations, breakpoints, or toasts.

**Improvement:** Introduce shadcn/ui, motion animations, loaders, better empty states.

---

### 7. Limited Test Coverage
- Only core backend tests included.

**Improvement:** Add component tests, context tests, and end-to-end auth flow tests.

---

### 8. No Production Deployment Tuning
- Basic Vercel/Render setup.

**Improvement:** Add CDN caching, Cloudflare security rules, API gateway, and autoscaling.

---

## 🚀 Areas I Would Improve With More Time
- Full Headless MFA implementation.
- Real database with full audit trail.
- Production-grade monitoring (OpenTelemetry, Prometheus).
- Harden signature verification to prevent replay attacks.
- CI/CD pipeline (GitHub Actions).
- Enhanced UI polish with animations and step-by-step flows.

