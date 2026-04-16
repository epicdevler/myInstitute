"use client";
import { Provider } from "@/app/components/ui/provider";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider storageKey="myInstituteV1" enableSystem={false}>
            {children}
            <Toaster />
          </Provider>
        </QueryClientProvider>
        <NextTopLoader color="blue" />
        <Analytics />
      </body>
    </html>
  );
}
