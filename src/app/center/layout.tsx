import React from "react";

export default function RootCenterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="relative">{children}</main>;
}
