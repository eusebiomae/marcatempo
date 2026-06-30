import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Clock, Menu } from "lucide-react";

import { menu } from "../../constants/menu";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        flex flex-col
        shrink-0
        border-r border-border
        bg-sidebar
        text-sidebar-foreground
        transition-all
        duration-200
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 h-14 px-4 border-b border-border">
        <div className="grid place-items-center size-8 rounded-md bg-primary text-primary-foreground shrink-0">
          <Clock className="size-4" />
        </div>

        {!collapsed && (
          <span className="font-semibold tracking-tight">
            Marcatempo
          </span>
        )}

        {!collapsed && ( 
            <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent transition-colors"
                aria-label="Recolher menu"
            >
                <Menu className="size-4" />
            </button>
        )}

        {collapsed && (
            <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent transition-colors"
                aria-label="Expandir menu"
            >
                <ChevronRight className="size-4" />
            </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-1">
        {menu.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              rounded-md
              px-3 py-2
              text-sm
              transition-colors
              ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              }
            `
            }
            title={label}
          >
            <Icon className="size-4 shrink-0" />

            {!collapsed && (
              <span className="truncate">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <footer className="border-t border-border p-3 text-xs text-muted-foreground">
          100% Offline • IndexedDB
        </footer>
      )}
    </aside>
  );
}