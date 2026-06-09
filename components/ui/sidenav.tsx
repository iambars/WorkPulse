"use client";

import { useState } from "react";
import SignoutButton from "./signout-button";
import { NavLinks } from "@/components/ui";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={`border-card flex h-screen flex-col border-r shadow-lg transition-all duration-300 ${
        collapsed ? "w-16" : "w-50"
      }`}
    >
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-y-2 md:space-x-0">
        <div
          className={`flex items-center p-2 ${collapsed ? "justify-center" : "justify-start"}`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-secondary/10 text-primary group relative rounded-md p-2 transition"
          >
            {collapsed ? (
              <>
                <PanelLeftOpen className="h-3 w-3" />
                <span className="bg-secondary/10 text-primary/80 pointer-events-none absolute top-1/2 left-full ml-6 -translate-y-1/2 rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  Expand
                </span>
              </>
            ) : (
              <>
                <PanelLeftClose className="h-3 w-3" />
                <span className="bg-secondary/10 text-primary/80 pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>

        <NavLinks collapsed={collapsed} />
        <div className="hidden w-full flex-1 md:block"></div>
        <SignoutButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
