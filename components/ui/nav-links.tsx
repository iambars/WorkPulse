"use client";

import { clsx } from "clsx";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "node:path";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Home1", href: "/dashboard1", icon: HomeIcon },
  { name: "Home2", href: "/dashboard2", icon: HomeIcon },
];

type Props = { collapsed: boolean };

export default function NavLinks({ collapsed }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 p-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "group relative flex h-12 grow items-center gap-2 rounded-md p-2 text-sm font-medium transition md:flex-none md:p-2 md:px-3",
              collapsed ? "justify-center" : "justify-center md:justify-start",
              {
                "bg-secondary/40 text-primary": pathname === link.href,
                "text-secondary hover:bg-secondary/10 hover:text-primary/80":
                  pathname !== link.href,
              },
            )}
          >
            <LinkIcon className="h-4 w-4" />
            {!collapsed && <p className="hidden md:block">{link.name}</p>}

            {collapsed && (
              <span className="bg-secondary/10 text-primary/80 pointer-events-none absolute left-16 rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                {link.name}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
