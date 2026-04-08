"use client";
import { Provider } from "@/app/components/ui/provider";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider storageKey="myInstituteV1" enableSystem={false}>
          {children}
        </Provider>
        <NextTopLoader color="blue" />
        <Analytics />
      </body>
    </html>
  );
}
