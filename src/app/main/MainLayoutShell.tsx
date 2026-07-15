"use client";

import { usePathname } from "next/navigation";
import MainHeader from "@/components/layout/main/MainHeader";
import MainFooter from "@/components/layout/main/MainFooter";

const MODAL_ONLY_PATHS = new Set([
  "/main/cookie-setting",
  "/main/cookie-setting/preferences",
]);

export default function MainLayoutShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  if (MODAL_ONLY_PATHS.has(pathname)) {
    return children;
  }

  return (
    <>
      <MainHeader />
      {children}
      <MainFooter />
    </>
  );
}
