"use client";

import React from "react";
import dynamic from "next/dynamic";
import { HeroUIProvider } from "@heroui/system";
import DeleteChatModal from "@/components/DeleteChatModal";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: true });

export default function LayoutClient({ children }: { children: React.ReactNode; }) {
  return (
    <HeroUIProvider>
      <Header />
      <Sidebar />
      {children}
      <DeleteChatModal />
    </HeroUIProvider>
  );
}
