import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Search, FolderKanban, Sparkles, Settings,
  Bell, CreditCard, LogOut,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import mascot from "@/assets/tucamax-mascot.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pesquisa", label: "Pesquisa", icon: Search },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/enriquecimento", label: "Enriquecimento", icon: Sparkles },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

type Profile = { full_name: string | null; credits_total: number; credits_used: number };

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, credits_total, credits_used").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  const credUsed = profile?.credits_used ?? 0;
  const credTotal = profile?.credits_total ?? 10000;
  const pct = Math.min(100, (credUsed / credTotal) * 100);
  const name = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const initials = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />
            <img src={mascot} alt="Mascote Tucamax" className="relative h-11 w-11 object-contain drop-shadow-[0_4px_12px_rgba(245,140,50,0.45)]" />
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-none">Tucamax</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">B2B Intelligence</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link key={to} to={to} className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active ? "bg-primary/15 text-primary shadow-sm shadow-primary/10" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}>
                <Icon className="h-4 w-4" />
                {label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl glass p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-accent">
            <CreditCard className="h-3.5 w-3.5" /> Créditos
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold">{(credTotal - credUsed).toLocaleString("pt-BR")}</span>
            <span className="text-xs text-muted-foreground">/ {credTotal.toLocaleString("pt-BR")}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full gradient-brand" style={{ width: `${pct}%` }} />
          </div>
          <button className="mt-3 w-full rounded-md gradient-brand py-1.5 text-xs font-semibold text-primary-foreground">
            Adicionar créditos
          </button>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-xs font-bold text-primary-foreground">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">{name}</div>
              <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-6 backdrop-blur-xl">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Velocidade que voa alto</div>
          </div>
          <button className="relative rounded-lg p-2 hover:bg-secondary">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </button>
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
