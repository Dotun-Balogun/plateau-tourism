import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Compass, FolderTree, LayoutDashboard, MapPin } from "lucide-react";

import { getCurrentUserWithProfile, isStaffRole } from "@/lib/supabase/current-user";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/login?redirectTo=/admin");
  }

  if (!isStaffRole(profile?.role)) {
    redirect("/");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[200px_1fr]">
      <aside className="space-y-1">
        <div className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold text-muted-foreground">
          <Compass className="size-4" />
          Admin
        </div>
        {ADMIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
