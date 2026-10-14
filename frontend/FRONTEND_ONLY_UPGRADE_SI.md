# MEDILINK Frontend-only upgrade

- Increased body, buttons, nav tabs, form controls (medium scale).
- Refined card checkout UI. Card option is intentionally disabled unless existing backend `/api/payments/methods` reports `methods.card=true`. Hosted PayHere flow is preserved; no card fields are stored in frontend. Actual charges require configured/approved PayHere backend and verified webhook.
- Admin login now verifies `/api/admin/auth/login` followed by `/api/auth/me` before navigation. Password visibility and improved session-mismatch message added. Cannot fix incorrect password, role, backend database, CORS or cookies from frontend alone.
- New frontend files can replace matching files in existing frontend. Backend source unchanged.
- Run `npm install` then `npm run dev` inside frontend folder. Verify NEXT_PUBLIC_API_URL matches backend.
- NEVER paste real credentials into chat. Rotate previously exposed MongoDB, SMTP, JWT and OpenAI keys.
