import type { Metadata } from "next";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

// import css file
import "./globals.css";

export const metadata: Metadata = {
  title: "CENI RDC - Elections",
  description:
    "Election présidentielle, législatives nationales, législatives provinciales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
