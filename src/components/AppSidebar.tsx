import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Timer,
  Calendar,
  FolderKanban,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  Database,
  Menu,
  Clock,
} from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tracker", label: "Time Tracker", icon: Timer },
  { to: "/calendar", label: "Calendário", icon: Calendar },
  { to: "/projects", label: "Projetos", icon: FolderKanban },
  { to: "/clients", label: "Clientes", icon: Users },
  { to: "/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/backup", label: "Backup", icon: Database },
  { to: "/settings", label: "Configurações", icon: SettingsIcon },
] as const;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={`shrink-0 border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      } flex flex-col`}
    >
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        <div className="size-8 rounded-md bg-primary text-primary-foreground grid place-items-center shrink-0">
          <Clock className="size-4" />
        </div>
        {!collapsed && <span className="font-semibold tracking-tight">Marcatempo</span>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-4" />
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              }`}
              title={label}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="p-3 text-xs text-muted-foreground border-t border-border">
          100% offline · IndexedDB
        </div>
      )}
    </aside>
  );
}
