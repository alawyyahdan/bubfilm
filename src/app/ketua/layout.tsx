// Separate layout for admin routes — no Navbar, no header
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
