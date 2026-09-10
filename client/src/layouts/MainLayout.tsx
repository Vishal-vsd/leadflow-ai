import { NavLink, Outlet } from "react-router-dom";
import { LogOut, LayoutDashboard, Users } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r bg-background">
        <div className="border-b p-5">
          <h1 className="text-lg font-bold">LeadFlow AI</h1>
          <p className="text-xs text-muted-foreground">
            Lead management workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </NavLink>

          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Users className="size-4" />
            Leads
          </NavLink>
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 truncate text-sm font-medium">
            {user?.name}
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen pl-64">
        <Outlet />
      </main>
    </div>
  );
}