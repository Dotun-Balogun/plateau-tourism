import Link from "next/link";
import { Compass } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { href: "/destinations", label: "All destinations" },
      { href: "/categories", label: "Categories" },
      { href: "/itineraries", label: "Trip planner" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Compass className="size-5" />
            <span>Discover Plateau State</span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            An integrated tourism multimedia system for exploring
            destinations through photos, video, and interactive maps.
          </p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <h3 className="text-sm font-medium">{group.heading}</h3>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Discover Plateau State. All rights reserved.
      </div>
    </footer>
  );
}
