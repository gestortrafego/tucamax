import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Bookmark, FolderKanban, Coins, Sparkles, TrendingUp, ArrowUpRight, Target, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { atividadeSemana } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

type Empresa = { id: string; nome_fantasia: string | null; razao_social: string; cnpj: string; cidade: string | null; estado: string | null; segmento: string | null; situacao: string | null };
type Projeto = { id: string; name: string; status: string; created_at: string };

const estadosMapa = [
  { uf: "SP", oport: 1842, pct: 100 },
  { uf: "RJ", oport: 1124, pct: 61 },
  { uf: "MG", oport: 987, pct: 53 },
  { uf: "PR", oport: 712, pct: 39 },
  { uf: "RS", oport: 668, pct: 36 },
  { uf: "SC", oport: 542, pct: 29 },
  { uf: "BA", oport: 489, pct: 27 },
  { uf: "PE", oport: 391, pct: 21 },
  { uf: "CE", oport: 312, pct: 17 },
  { uf: "DF", oport: 287, pct: 16 },
];

function Dashboard() {
  const { user } = useAuth();
  const [empresasCount, setEmpresasCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [projetosCount, setProjetosCount] = useState(0);
  const [credUsed, setCredUsed] = useState(0);
  const [credTotal, setCredTotal] = useState(10000);
  const [recentes, setRecentes] = useState<Empresa[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count: ec }, { count: lc }, { count: pc }, { data: prof }, { data: emp }, { data: prj }] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("project_companies").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "ativo"),
        supabase.from("profiles").select("full_name, credits_total, credits_used").eq("id", user.id).maybeSingle(),
        supabase.from("companies").select("id, nome_fantasia, razao_social, cnpj, cidade, estado, segmento, situacao").order("created_at", { ascending: false }).limit(6),
        supabase.from("projects").select("id, name, status, created_at").eq("status", "ativo").order("created_at", { ascending: false }).limit(4),
      ]);
      setEmpresasCount(ec ?? 0);
      setLeadsCount(lc ?? 0);
      setProjetosCount(pc ?? 0);
      if (prof) {
        setCredUsed(prof.credits_used);
        setCredTotal(prof.credits_total);
        setNome(prof.full_name || "");
      }
      setRecentes((emp ?? []) as Empresa[]);
      setProjetos((prj ?? []) as Projeto[]);
    })();
  }, [user]);

  const cards = [
    { icon: Building2, label: "Empresas mapeadas", value: empresasCount.toLocaleString("pt-BR"), delta: "Base nacional", trend: "+2.4%" },
    { icon: Bookmark, label: "Leads qualificados", value: leadsCount.toLocaleString("pt-BR"), delta: "Em projetos ativos", trend: "+12%" },
    { icon: FolderKanban, label: "Projetos ativos", value: String(projetosCount), delta: "Atualizado agora", trend: "" },
    { icon: Coins, label: "Créditos disponíveis", value: (credTotal - credUsed).toLocaleString("pt-BR"), delta: `de ${credTotal.toLocaleString("pt-BR")}`, trend: "" },
    { icon: Sparkles, label: "Empresas abertas hoje", value: "218", delta: "Em todo o Brasil", trend: "+5%" },
  ];

  const maxBuscas = Math.max(...atividadeSemana.map((d) => d.buscas));
  const firstName = nome.split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <div className="space-y-10 max-w-[1400px]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Dashboard</div>
          <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Visão Comercial Nacional</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Monitore empresas, leads, créditos e oportunidades em tempo real{firstName ? `, ${firstName}` : ""}.
          </p>
        </div>
        <Link to="/pesquisa" className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15 transition">
          <Target className="h-4 w-4" /> Iniciar prospecção
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ icon: Icon, label, value, delta, trend }) => (
          <div key={label} className="group relative overflow-hidden rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-5 transition hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
              {trend && <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary"><TrendingUp className="h-3 w-3" />{trend}</span>}
            </div>
            <div className="mt-5 font-display text-[28px] font-bold tabular-nums leading-none">{value}</div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-1 text-[10px] text-muted-foreground/70">{delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2 rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-display text-base font-semibold">Mapa de oportunidades por estado</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Distribuição nacional de empresas ativas com potencial comercial</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary"><MapPin className="h-3 w-3" /> Brasil</span>
          </div>
          <div className="space-y-2.5">
            {estadosMapa.map((e) => (
              <div key={e.uf} className="flex items-center gap-3">
                <span className="w-8 text-xs font-mono font-semibold text-muted-foreground">{e.uf}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary/40 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary/80 to-gold-soft/60 rounded-full" style={{ width: `${e.pct}%` }} />
                </div>
                <span className="w-16 text-right text-xs font-medium tabular-nums">{e.oport.toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade */}
        <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-display text-base font-semibold">Atividade comercial</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 7 dias</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {atividadeSemana.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-0.5 h-32">
                  <div className="flex-1 rounded-t bg-primary/80" style={{ height: `${(d.buscas / maxBuscas) * 100}%` }} />
                  <div className="flex-1 rounded-t bg-primary/30" style={{ height: `${(d.leads / maxBuscas) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.dia}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary/80" /> Buscas</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary/30" /> Leads</span>
          </div>
        </div>
      </div>

      {/* Projetos estratégicos */}
      <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-base font-semibold">Projetos estratégicos recentes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Operações comerciais em andamento</p>
          </div>
          <Link to="/projetos" className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline">
            Ver todos <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {projetos.length === 0 && <div className="col-span-full text-xs text-muted-foreground py-6 text-center">Nenhum projeto ativo. Crie o primeiro na aba Projetos.</div>}
          {projetos.map((p) => (
            <Link key={p.id} to="/projetos" className="group rounded-lg border border-border/60 bg-background/30 p-4 hover:border-primary/30 hover:bg-background/50 transition">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold bg-primary/10 text-primary ring-1 ring-primary/20">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
              </div>
              <div className="mt-3 truncate text-sm font-semibold">{p.name}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">Criado em {new Date(p.created_at).toLocaleDateString("pt-BR")}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabela empresas recentes */}
      <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div>
            <h2 className="font-display text-base font-semibold">Empresas recentes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Últimas empresas adicionadas à sua base</p>
          </div>
          <Link to="/empresas" className="text-xs font-medium text-primary hover:underline">Ver todas</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground bg-background/30">
                <th className="px-6 py-3 font-semibold">Empresa</th>
                <th className="px-2 py-3 font-semibold">CNPJ</th>
                <th className="px-2 py-3 font-semibold">Localização</th>
                <th className="px-2 py-3 font-semibold">Segmento</th>
                <th className="px-6 py-3 font-semibold text-right">Situação</th>
              </tr>
            </thead>
            <tbody>
              {recentes.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-xs text-muted-foreground">Nenhuma empresa salva ainda. Inicie uma prospecção.</td></tr>
              )}
              {recentes.map((e) => (
                <tr key={e.id} className="border-t border-border/40 hover:bg-secondary/20 transition">
                  <td className="px-6 py-3 font-medium">{e.nome_fantasia || e.razao_social}</td>
                  <td className="px-2 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                  <td className="px-2 py-3 text-muted-foreground text-xs">{e.cidade}/{e.estado}</td>
                  <td className="px-2 py-3"><span className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[11px]">{e.segmento}</span></td>
                  <td className="px-6 py-3 text-right">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${e.situacao === "Ativa" ? "text-primary" : "text-destructive"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${e.situacao === "Ativa" ? "bg-primary" : "bg-destructive"}`} />
                      {e.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
