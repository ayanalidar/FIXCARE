import { isAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdmin();
  if (!authed) {
    // Login page renders without the shell
    return <div className="min-h-screen">{children}</div>;
  }
  return <AdminShell>{children}</AdminShell>;
}
