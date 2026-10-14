# MEDILINK 

## Requirements
- Node.js >=22, MongoDB local or MongoDB Atlas, a real SMTP server, Google OAuth web client ID, PayPal REST sandbox credentials.
- The supplied MEDILINK files contained configuration but **not the React source pages/components**; frontend-integration/medilink-api.ts must be wired into the original app manually.
- The supplied `paypal-demo(1).zip` is a **PHP** demo; this backend instead uses PayPal REST Orders v2 directly from Node.js. Do not put PHP secrets or PayPal secrets into the frontend.

## Windows local setup
1. `cd backend`
2. `npm install`
3. `copy .env.example .env` and edit `.env`.
4. Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
5. Start MongoDB; `npm run dev`.
6. Check http://localhost:4000/api/health (database should show connected).
7. Add `VITE_MEDILINK_API_URL=http://localhost:4000` to the **React app** `.env.local`; copy `frontend-integration/medilink-api.ts` into its source code, then wire login/register/Google button, favourites and checkout to these APIs.
8. Frontend origin must exactly match `FRONTEND_ORIGIN` (e.g., http://localhost:5173).

## Google login
Create Google OAuth 2.0 Web application credentials. Set `GOOGLE_CLIENT_ID` **backend only** and the same public client ID in frontend Google Identity Services configuration. The Google button returns an `ID token` as `credential`, which the frontend posts to `/api/auth/google`. Server validates token signature, issuer, audience and verified email. Never trust raw email/name sent by the browser as OAuth proof.

## Email
Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` and `API_PUBLIC_URL`. Registration issues a one-day, single-use verification link. Without SMTP the notification record becomes `not_configured`, and password signup users cannot complete verification. Notifications are logged with sent/failed/not_configured status, but **there is no background retry worker**. Order emails follow verified capture; admins can send updates through `POST /api/admin/updates`. Configure `ADMIN_EMAIL` only for an email which has been verified and is yours; restart to assign role. Do not use a public admin signup form.

## PayPal
Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV=sandbox`, `PAYPAL_CURRENCY=USD`. Server reads product prices from MongoDB (never trusts a browser-submitted total), creates a pending order, calls PayPal Orders v2, and compares returned order id, capture status, currency, amount, and custom_id before marking paid. Use PayPal sandbox test buyer accounts for acceptance testing. Set live credentials only after successful sandbox verification and merchant readiness.

**Critical: currency:** PayPal cannot be assumed to support LKR as transaction currency. Demo default is USD; choose a supported merchant currency and determine an authorized price/conversion model before accepting payments. The sample assumes prices in the configured currency, stored as integer minor units. No arbitrary LKR to USD conversion is included.

**Critical: product and prescription controls:** This backend rejects prescription-required products until a licensed dispensing/approval workflow exists. It does not accept or store prescription uploads. The client must NOT treat the frontend's existing localStorage orders as paid orders. Populate authoritative SKU/price/stock via admin endpoint. The initial product catalogue is empty. Stock checks occur on order submission, but stock reservation, stock decrement, concurrent oversell protection, payment reconciliation webhooks, refunds, secure session rotation, account recovery, delivery workflow, audit/export/backup policies and privacy/legal review must be implemented before accepting real customers. Do not advertise this as production-ready or 100% tested.

## REST endpoints
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | DB health |
| POST | `/api/auth/register` | email/password registration |
| GET | `/api/auth/verify-email?token=...` | consume verification link |
| POST | `/api/auth/resend-verification` | resend email |
| POST | `/api/auth/login` | login (verified email required) |
| POST | `/api/auth/google` | Google ID-token login |
| GET | `/api/auth/me` | current user |
| POST | `/api/auth/logout` | clear session cookie |
| GET | `/api/products` | available catalogue |
| POST | `/api/admin/products` | admin product upsert |
| GET/PUT | `/api/favourites` | per-account favourites |
| POST/GET | `/api/orders` | order submit and list |
| POST | `/api/paypal/create-order` | create PayPal checkout |
| POST | `/api/paypal/capture-order` | capture and verify payment |
| POST | `/api/admin/updates` | admin bulk customer updates |
| GET | `/api/admin/notices` | email status records |

## Example API calls
Registration:
```json
{"name":"Example Customer","email":"customer@example.com","password":"ReplaceWithLongPassword123!"}
```
Admin product creation (login as ADMIN_EMAIL first):
```json
{"sku":"ITEM001","name":"Example non-prescription item","priceMinor":1299,"currency":"USD","stock":40,"prescriptionRequired":false}
```
Order submission:
```json
{"items":[{"sku":"ITEM001","quantity":2}],"address":"Delivery address"}
```
PayPal creation and capture calls take `{ "orderId": "<mongo order ID>" }`.

## Deployment cautions
Use HTTPS, real secrets management, a proper persistent MongoDB instance, controlled CORS, monitoring, backups, CSRF protection as appropriate for your deployment, and ensure email delivery configuration works. Do not commit `.env` or store plaintext customer passwords or PayPal secrets in MongoDB. Cookies are HTTP-only and become Secure in NODE_ENV=production; cross-domain frontend/backend deployments need deliberately configured cookie and CSRF policy.
