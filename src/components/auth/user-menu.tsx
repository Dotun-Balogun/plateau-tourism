import Link from "next/link";
import { LayoutDashboard, LogOut, MapPinned } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/auth/actions";

type Props = {
  fullName: string | null;
  avatarUrl: string | null;
  email: string | null | undefined;
  isStaff: boolean;
};

export function UserMenu({ fullName, avatarUrl, email, isStaff }: Props) {
  const initials =
    (fullName || email || "?")
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName ?? ""} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {fullName || email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/itineraries">
            <MapPinned className="size-4" />
            My itineraries
          </Link>
        </DropdownMenuItem>
        {isStaff && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LayoutDashboard className="size-4" />
              Admin dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={signOut} className="w-full">
            <button type="submit" className="flex w-full items-center gap-2">
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
