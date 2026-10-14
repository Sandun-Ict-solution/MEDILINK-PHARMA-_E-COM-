<div align="center">

# 🩺 MEDILINK
### Pharmaceutical E-Commerce & Pharmacy Operations Platform

**Medicine discovery · Online orders · Prescription review · Pharmacy administration · AI health information**

![Status](https://img.shields.io/badge/status-development%20%2F%20integration%20review-orange)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-149eca)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-288d46)
![Database](https://img.shields.io/badge/database-MongoDB-47a248)

</div>

> **Project status:** MEDILINK is a functional-development e-commerce project with multiple integrated modules. Screenshots document interfaces and some recorded workflows, **not independent certification that every integration is production-ready**. See [Testing & Limitations](#testing--limitations).

## Contents

- [Overview](#overview)
- [Application Screenshots](#application-screenshots)
- [Features](#features)
- [Application Workflow](#application-workflow)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Admin Access](#admin-access)
- [Payments, Email, GPS & AI](#payments-email-gps--ai)
- [Testing & Limitations](#testing--limitations)
- [Security & Medical Safety](#security--medical-safety)
- [Contact](#contact)

## Overview

**MEDILINK** is a pharmacy-focused web application that combines core e-commerce functionality with prescription-related workflows and pharmacy administration. It aims to make it easier for registered customers to find healthcare products, manage a cart, submit orders, view order history, upload prescriptions for professional review, and access pharmacy support tools.

A separate administrative workspace provides order processing, inventory/GRN entry, sales reporting, prescription review, campaigns and delivery operations. An animated AI Health Helper offers **general educational wellness information**, not diagnosis or a substitute for clinical care.

### User roles

| Role | Primary responsibilities |
| --- | --- |
| Guest | Public homepage and non-restricted information; purchasing requires account access |
| Customer | Sign in, discover products, manage cart, order, upload prescriptions, view own orders, request reviews |
| Administrator | Manage authorized operational tasks and account access through a separate admin workspace |
| Pharmacist / authorized reviewer | Review prescriptions, communicate with customers where the account is appropriately verified/authorized |
| Delivery rider | Access assigned deliveries and voluntarily share supported GPS location information |

## Application Screenshots

The following images were captured from MEDILINK application screenshots. Certain identifying details are intentionally obscured. The original application screenshots may reflect development/test data.

### Admin overview and order operations

![MEDILINK admin overview](docs/screenshots/admin-overview.webp)

*Admin overview — operational navigation and summary counts.*

![MEDILINK admin orders](docs/screenshots/admin-orders.webp)

*Admin orders — recorded orders and status-management actions. Buttons shown do not alone prove a successful state transition.*

### Customer prescriptions and orders

![Prescription upload and records](docs/screenshots/prescription-upload.webp)

*Customer prescription form and visible review statuses.*

![Customer order history](docs/screenshots/customer-orders.webp)

*Customer order history — payment labels, order statuses, and progress tracker.*

### Pharmacy operations

| Product GRN | Sales analytics |
| --- | --- |
| ![GRN screen](docs/screenshots/product-grn.webp) | ![Sales reporting](docs/screenshots/sales-analytics.webp) |

| Prescription review | Delivery & GPS |
| --- | --- |
| ![Admin prescription queue](docs/screenshots/prescription-review.webp) | ![GPS delivery management](docs/screenshots/delivery-gps.webp) |

### Customer services

| Return / refund review | Refill reminders and reviews |
| --- | --- |
| ![Return review](docs/screenshots/returns-review.webp) | ![Refills and reviews](docs/screenshots/refills-reviews.webp) |

| Enhanced pharmacy services | Marketing campaigns |
| --- | --- |
| ![Pharmacist and delivery services](docs/screenshots/pharmacy-services.webp) | ![Campaign form](docs/screenshots/campaign-studio.webp) |

## Features

### Customer portal

- Account registration, sign-in, email verification and password recovery UI/flows.
- Google sign-in integration option, subject to OAuth setup.
- Product catalogue, category browsing, search and product details.
- Cart management including product removal, quantity and total calculations.
- Delivery details, checkout and cash-on-delivery order flow.
- Card checkout integration through PayHere hosted payments, **dependent on provider configuration and certification**.
- Order history, order status indicators, and customer notifications.
- Prescription document upload (PDF/image) with consent and review-status display.
- Return/refund **review requests**, not instant automatic refunds.
- Refill date planning; automated outbound reminders require scheduler/delivery verification.
- Product review submissions for moderation.
- General-health AI assistant and pharmacist messaging interfaces.

### Admin / pharmacy workspace

- Separate role-restricted administrative dashboard and navigation.
- Order listing and status action controls, including dispatch, cancellation and delivery completion where permitted.
- Product/inventory operations, stock batches and **GRN (Goods Received Notes)** entry.
- Prescription review queue, review notes, and approve/reject actions subject to reviewer authorization and professional verification.
- Sales analytics showing order value, daily breakdowns and popular items; **recorded order value is not equal to settled revenue or audited profit**.
- Marketing campaign creation, media inputs, publishing controls and homepage campaign integration.
- Delivery assignment, consent-based rider location sharing and latest-position map display.
- Customer notification and administrator invitation capabilities.

## Application Workflow

```mermaid
flowchart TD
    A[Public welcome page] --> B[Customer login / registration]
    B --> C[Discover & product catalogue]
    C --> D[Product detail & cart]
    D --> E[Checkout & delivery details]
    E --> F{Payment method}
    F -->|Cash on delivery| G[Recorded order]
    F -->|Configured hosted card gateway| H[Provider checkout & callback verification]
    H --> G
    G --> I[My Orders & status tracking]
    J[Upload prescription] --> K[Authorized manual review]
    K --> L[Status / review notification]
    M[Authorized admin] --> N[Orders, inventory, GRN & reporting]
    N --> I
```

Prescription approval does **not** authorize automatic dispensing: dispensing and substitutions require qualified pharmacist review and applicable legal checks.

## Technology Stack

| Layer | Technology / approach |
| --- | --- |
| Web UI | **React 19**, TypeScript, CSS / responsive layouts |
| Frontend tooling | Vite / Vinext-style routing (as configured in the current frontend source) |
| Server | Node.js **22+**, Express.js |
| Database | MongoDB Atlas/local MongoDB, Mongoose ODM |
| Authentication | JWT-based sessions, password hashing (`bcryptjs`), role/email authorization |
| Validation / security utilities | Zod, Helmet, CORS, express-rate-limit |
| Email | Nodemailer + SMTP (Gmail supported with properly configured App Password) |
| AI health helper | Backend-integrated **OpenRouter** model endpoint; optional provider configuration |
| Online payment | PayHere hosted checkout integration (external merchant onboarding required) |
| GPS/map | Browser Geolocation with permission, location API, OpenStreetMap display / map links |
| Media | Upload interfaces and backend upload handling, subject to deployment storage configuration |

### Development techniques

- **Component-based UI design:** reusable product, navigation and chatbot components.
- **RESTful API architecture:** UI requests flow through authenticated Express routes.
- **CRUD operations:** products, customer data, orders, inventory records and operational entities as implemented.
- **Role-based access control:** sensitive pharmacy/admin actions require server-side permission checks.
- **Stateful checkout:** cart review and order confirmation; gateway success must be independently confirmed.
- **Responsive design:** mobile/tablet/desktop layouts and reduced-motion friendly animations.
- **Manual prescription review:** staff workflow and review notes; not autonomous prescribing.

## Architecture

```mermaid
flowchart LR
    Browser[React customer and admin UI] -->|HTTPS REST / cookies| API[Express API]
    API --> DB[(MongoDB)]
    API --> Email[SMTP email provider]
    API --> AI[OpenRouter AI API]
    API --> Pay[PayHere checkout and notifications]
    Rider[Rider browser + consent] --> API
    API --> Map[Last reported GPS coordinates]
    Map --> Browser
```

API credentials belong **only on the backend**. Frontend pages should never embed `OPENROUTER_API_KEY`, database passwords, payment merchant secrets, SMTP passwords or JWT secrets.

## Repository Structure

Example when adding this README to the complete MEDILINK fullstack repository:

```text
MEDILINK/
├── README.md
├── docs/
│   └── screenshots/
│       ├── admin-overview.webp
│       ├── admin-orders.webp
│       ├── prescription-upload.webp
│       ├── customer-orders.webp
│       ├── product-grn.webp
│       ├── sales-analytics.webp
│       ├── prescription-review.webp
│       ├── delivery-gps.webp
│       ├── returns-review.webp
│       ├── refills-reviews.webp
│       ├── pharmacy-services.webp
│       └── campaign-studio.webp
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── scripts/
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── app/
    ├── public/
    ├── package.json
    └── .env.example
```

## Local Setup

### Prerequisites

- Node.js **22+** (per project package engines) and npm.
- A reachable MongoDB database and a database user with appropriate permissions.
- Environment variables set for the backend and frontend.
- Optional: SMTP credentials, OpenRouter API key, Google OAuth setup, and PayHere sandbox credentials for the corresponding features.

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

**Backend terminal:**

```bash
cd backend
npm install
npm run dev
```

**Frontend terminal:**

```bash
cd frontend
npm install
npm run dev
```

Visit the local frontend URL printed by Vite (typically `http://localhost:5173`). The backend is configured to use port 4000 in the documented local setup.

> On Windows, the frontend's `npm run build` script invokes a Bash-based build helper. Use Git Bash/WSL where required; do not assume PowerShell alone supports that build script.

### 2. Health check

From PowerShell:

```powershell
Test-NetConnection 127.0.0.1 -Port 4000
Invoke-RestMethod http://localhost:4000/api/health
```

Expected healthy response resembles:

```json
{"status":"ok","database":"connected"}
```

If the frontend says `Unable to reach MEDILINK API`, verify that the backend starts successfully, MongoDB connects, the frontend URL is correct and CORS allows the actual browser origin.

## Environment Variables

Create `backend/.env` from `backend/.env.example` and `frontend/.env.local` from the frontend example. **Do not commit `.env`, `.env.local`, keys, session cookies, customer exports or real prescription records.**

**Frontend (`frontend/.env.local`):**

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Backend (`backend/.env`) — example placeholders only:**

```dotenv
NODE_ENV=development
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
API_PUBLIC_URL=http://localhost:4000
MONGODB_URI=mongodb+srv://USERNAME:REPLACE_PASSWORD@YOUR_CLUSTER.mongodb.net/medilink
JWT_SECRET=REPLACE_WITH_LONG_RANDOM_SECRET
ADMIN_EMAIL=approved.admin@example.com
ADMIN_ALLOWED_EMAILS=approved.admin@example.com

# Optional SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.sender@gmail.com
SMTP_PASS=REPLACE_WITH_NEW_APP_PASSWORD
MAIL_FROM="MEDILINK <your.sender@gmail.com>"

# Optional AI
OPENROUTER_API_KEY=REPLACE_WITH_NEW_PRIVATE_KEY
OPENROUTER_MODEL=openai/gpt-4o-mini

# Optional payment gateway
PAYHERE_ENV=sandbox
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
PAYHERE_NOTIFY_URL=
STORE_CURRENCY=LKR

# Optional Google Sign-in
GOOGLE_CLIENT_ID=
```

Variable names are based on the inspected integrated project. Configuration and provider account requirements must be checked for the deployment version.

## Admin Access

1. Create/identify a valid registered user account and verify its email.
2. Configure `ADMIN_EMAIL` and `ADMIN_ALLOWED_EMAILS` **on the backend**, using an approved email address.
3. Follow the version's secure bootstrap/invitation workflow; do not directly change client-side role data.
4. Run `npm run admin:status` in `backend/` to inspect the account status (without displaying secrets).
5. Use `/secure-admin/login` and navigate to `/secure-admin` once authenticated.

**Important:** An allowlisted email alone is not proof of authorization. Password/Google ID-token verification, email ownership and server-side role checks still apply. Staff access to prescription records must also be restricted to authorized qualified personnel.

## Payments, Email, GPS & AI

| Integration | Operational conditions / limitations |
| --- | --- |
| **PayHere** | Requires real sandbox/merchant configuration, signed notifications, callback testing and provider approval. A UI payment option is **not** proof of settlement. |
| **SMTP** | Needs a valid sender account, credentials, deliverability verification and correct mail templates; check spam and delivery errors. |
| **OpenRouter** | Calls run from backend and require a valid key and model access. Medical content is **general education only**. |
| **Delivery map** | Shows a rider's last authorized reported position, not a guaranteed continuous live route or ETA. Require location consent and freshness indicators. |
| **Refunds** | Return/refund forms create review requests. Automatic financial refunds are not asserted as active. |
| **Refill reminders** | Stored schedules do not guarantee automatic email delivery without a tested scheduler and email service. |

## Testing & Limitations

### Evidence from recorded demonstration and development checks

- Application screenshots show catalogue/account-related interfaces, order history, prescription statuses, returns/refills forms, admin orders, GRN and sales reports.
- Recorded demonstration and user tests have shown a confirmed order screen and received MEDILINK email messages, but this does not replace full regression testing.
- A direct OpenRouter API test returned **HTTP 200** and an AI response; the complete browser-to-backend chatbot route still needs end-to-end validation.
- Backend syntax and ZIP integrity checks were reported passed in earlier project handoffs.
- **Frontend production build, live card transactions, live GPS, prescription audit and all CRUD paths have not been independently verified end-to-end.**

### Deployment checklist

- [ ] Frontend production build completes with dependencies locked.
- [ ] Backend runs with production environment validation and operational health checks.
- [ ] All credentials previously exposed in messages are revoked/rotated.
- [ ] MongoDB authentication, IP/network rules, backups and recovery procedures are configured.
- [ ] User registration, login, logout, verification, reset-password and Google sign-in tested.
- [ ] Role boundaries tested (guest/customer/admin/pharmacist/rider), including direct API calls.
- [ ] Product → cart → checkout → order → fulfilment tested in a clean environment.
- [ ] Stock changes and GRN duplicate prevention verified under concurrent requests.
- [ ] Prescription upload security, pharmacist approvals and review audit trail tested.
- [ ] SMTP delivery, notification templates and bounce/error handling tested.
- [ ] PayHere sandbox payment + webhook signature + replay/idempotency tested.
- [ ] Real rider consent, GPS freshness and customer-order ownership checked.
- [ ] Rate limits, audit logs, CSP/CORS, cookies, secure headers and upload limits reviewed.
- [ ] Legal, licensing, medicine advertising, dispensing and data-protection requirements reviewed before public launch.

## Security & Medical Safety

- Do not store committed secrets or actual patient/prescription images in a public repository.
- Sanitize screenshots and use fictional/test customer accounts for demonstrations.
- Secure password-reset tokens, cookies and role authorization server-side; use HTTPS in production.
- Restrict access to uploaded prescriptions and retain auditable review decisions.
- Prescription approval is **not** a substitute for required pharmacist checks or local pharmacy regulation.
- The AI chatbot should not diagnose conditions, prescribe medicines, recommend prescription substitutes or replace urgent medical attention.
- Delivery GPS must only be exposed to permitted parties and must be disabled/restricted after fulfilment.

## Contact

**MEDILINK Lanka Pharmacy**  
Email: **medilinklankapharma@gmail.com**

---

<div align="center">

**MEDILINK — A pharmacy-focused e-commerce development project**

*Screenshots reflect the application as captured during development. Features requiring third-party services are subject to provider configuration and verification.*

</div>
