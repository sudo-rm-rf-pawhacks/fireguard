import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"

import "./globals.css";

export const metadata: Metadata = {
  title: "FireGuard",
  description: "A Wildfire Prediction Model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-600 min-h-screen w-full flex flex-col">
      <Analytics />
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
