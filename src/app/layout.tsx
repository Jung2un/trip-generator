import React from "react";
import "../styles/globals.css";
import type { Metadata } from "next";
import LayoutClient from "@/app/LayoutClient";

export const metadata: Metadata = {
  title: "TripGen",
  description: "AI가 여행 일정을 만들어주는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ko" className="dark">
        <body className={"bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300 antialiased"}>
          <LayoutClient >
            <main className="pt-16">
              {children}
            </main>
          </LayoutClient>
        </body>
      </html>
  );
}
