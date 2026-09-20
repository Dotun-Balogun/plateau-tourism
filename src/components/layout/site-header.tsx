import Link from "next/link";
import { Compass, LayoutDashboard, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/auth/user-menu";
import { getCurrentUserWithProfile, isStaffRole } from "@/lib/supabase/current-user";

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/itineraries", label: "Trip Planner" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export async function SiteHeader() {
  const { user, profile } = await getCurrentUserWithProfile();
  const isStaff = isStaffRole(profile?.role);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Compass className="size-5" />
          <span>Discover Plateau State</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {isStaff && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="size-3.5" />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <UserMenu
              fullName={profile?.full_name ?? null}
              avatarUrl={profile?.avatar_url ?? null}
              email={user.email}
              isStaff={isStaff}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {NAV_LINKS.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
            {isStaff && (
              <DropdownMenuItem asChild>
                <Link href="/admin">Admin dashboard</Link>
              </DropdownMenuItem>
            )}
            {user ? (
              <DropdownMenuItem asChild>
                <Link href="/itineraries">My itineraries</Link>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">Sign in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/sign-up">Get started</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
