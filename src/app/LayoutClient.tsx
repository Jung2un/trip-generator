"use client";

import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false});

export default function LayoutClient() {
  return (
    <>
      <Header />
      <Sidebar />
      <Toaster position="top-center" />
    </>
  );
}
