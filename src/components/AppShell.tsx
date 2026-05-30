import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Target, FolderKanban, Sparkles, UserSquare2,
  Download, Plug, Settings, Bell, LogOut, Globe2, ChevronRight,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { to: "/empresas", label: "Empresas", icon: Building2 },
  { to: "/pesquisa", label: "Prospecção", icon: Target },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/enriquecimento", label: "Enriquecimento", icon: Sparkles },
  { to: "/decisores", label: "Decisores", icon: UserSquare2 },
  { to: "/exportacoes", label: "Exportações", icon: Download },
  { to: "/integracoes", label: "Integrações", icon: Plug },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

type Profile = { full_name: string | null; credits_total: number; credits_used: number; plan_name: string | null };

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, credits_total, credits_used, plan_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  const credUsed = profile?.credits_used ?? 0;
  const credTotal = profile?.credits_total ?? 10000;
  const credLeft = Math.max(0, credTotal - credUsed);
  const pct = Math.min(100, (credUsed / credTotal) * 100);
  const name = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const initials = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  const current = nav.find((n) => pathname.startsWith(n.to));

  return (
    <div className="flex min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-sidebar-border bg-sidebar/85 backdrop-blur-2xl lg:flex">
        <div className="flex h-[68px] items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/30">
            <Globe2 className="h-5 w-5 text-primary" strokeWidth={2.25} />
            <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-lg -z-10" />
          </div>
          <div className="min-w-0">
            <div className="font-display text-[15px] font-bold leading-none tracking-tight">VMAX Atlas</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1.5">Inteligência Comercial B2B</div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Plataforma</div>
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link key={to} to={to} className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-primary/15 to-transparent text-foreground ring-1 ring-primary/20"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}>
                <Icon className={cn("h-4 w-4 transition", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} strokeWidth={1.75} />
                <span className="flex-1">{label}</span>
                {active && <span className="h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_oklch(0.78_0.14_75)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="mx-3 mb-3 rounded-xl border border-glass-border bg-gradient-to-b from-card/80 to-card/40 p-4">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Créditos</span>
            <span className="text-primary">{profile?.plan_name || "Enterprise"}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold tabular-nums">{credLeft.toLocaleString("pt-BR")}</span>
            <span className="text-xs text-muted-foreground">/ {credTotal.toLocaleString("pt-BR")}</span>
          </div>
          <div className="mt-2.5 h-1 rounded-full bg-secondary/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-gold-soft" style={{ width: `${pct}%` }} />
          </div>
          <button className="mt-3 w-full rounded-md border border-primary/30 bg-primary/10 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition">
            Adicionar créditos
          </button>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent/60 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-primary/30 text-xs font-bold text-primary">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">{name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{user?.email}</div>
            </div>
            <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="text-muted-foreground hover:text-foreground transition">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-border/60 bg-background/70 px-8 backdrop-blur-2xl">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-foreground/60">VMAX Atlas</span>
            {current && <><ChevronRight className="h-3 w-3" /><span className="text-foreground">{current.label}</span></>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="hidden md:inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition">
              <kbd className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
              <span>Buscar empresa, CNPJ, projeto…</span>
            </button>
            <button className="relative rounded-lg p-2 hover:bg-secondary/60 transition">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
            </button>
          </div>
        </header>
        <main className="px-6 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
