# MEDILINK Online Pharmacy — React Frontend

A complete blue-and-green online pharmacy frontend built with React, Next-compatible routing and Vite/Vinext. It includes real product-style images and browser-based demo functionality.

## Run on Windows

1. Install Node.js 22 LTS from https://nodejs.org/.
2. Extract this ZIP to a normal folder such as `Desktop/MEDILINK`.
3. Open that folder in VS Code.
4. Select **Terminal → New Terminal**.
5. Run:

```bash
npm install
npm run dev
```

6. Open the local address shown in the terminal (normally `http://localhost:5173`).

On Windows, you can also double-click `START_MEDILINK.bat`; it installs missing packages and starts the site for you.

The local development server runs without the Cloudflare Workers emulator, so it does not depend on the Windows Miniflare/workerd native runtime. The Cloudflare plugin remains enabled only for production builds.

If PowerShell blocks `npm.ps1`, use Command Prompt, or run `npm.cmd install` and `npm.cmd run dev`.

## Included features

- Responsive Home, Medicines, Health Essentials, Personal Care and Wellness pages
- 36 products with generated healthcare product photography
- Product search, category filters, prescription filters, stock filter and sorting
- Working page navigation and product details
- Favourites saved in browser storage
- Working cart, quantity updates, delivery calculation and checkout
- Frontend order confirmation and order tracking history
- Local demo account profile
- Prescription form with validation and local submission history
- Responsive mobile menu and detailed footer

## Important demo note

This is a frontend project. Cart, account, favourites, orders and prescription references are saved only in the browser using `localStorage`. Prescription files are not uploaded to a server and card payments are not processed. A secure backend, database, authentication, payment provider and pharmacist workflow must be added before production use.
