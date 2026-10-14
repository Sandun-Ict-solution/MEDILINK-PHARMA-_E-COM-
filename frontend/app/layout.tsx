import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "./store";
import SessionGate from "./SessionGate";

export const metadata: Metadata = {
  title: "MEDILINK Online Pharmacy",
  applicationName: "MEDILINK Online Pharmacy",
  description: "Medicines, healthcare essentials and pharmacist-supported prescription services in one convenient place.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [{ url: "/medilink-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/medilink-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider><SessionGate>{children}</SessionGate></StoreProvider>
      </body>
    </html>
  );
}
