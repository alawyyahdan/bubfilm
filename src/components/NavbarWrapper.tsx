"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "ketua";

  // Hide Navbar on all admin pages
  if (pathname.startsWith(`/${adminPath}`)) return null;

  return <Navbar />;
}
