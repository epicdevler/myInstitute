import type { Metadata } from "next";
import { Toaster } from "@/app/components/ui/toaster";

export const metadata: Metadata = {
  title: "PTI | CET",
  description: "Course registration manager for ND",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      {children}

      <Toaster />
    </section>
  );
}
