import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Bookmark, FolderKanban, Coins, Sparkles, TrendingUp, ArrowUpRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { atividadeSemana } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

type Empresa = { id: string; nome_fantasia: string | null; razao_social: string; cnpj: string; cidade: string | null; estado: string | null; segmento: string | null; situacao: string | null };
type Projeto = { id: string; name: string; status: string; created_at: string };

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
        supabase.from("companies").select("id, nome_fantasia, razao_social, cnpj, cidade, estado, segmento, situacao").order("created_at", { ascending: false }).limit(5),
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
    { icon: Building2, label: "Empresas encontradas", value: empresasCount.toLocaleString("pt-BR"), delta: "Base oficial", accent: "from-primary/30 to-primary/0" },
    { icon: Bookmark, label: "Leads salvos", value: leadsCount.toLocaleString("pt-BR"), delta: "Em projetos", accent: "from-accent/30 to-accent/0" },
    { icon: FolderKanban, label: "Projetos ativos", value: String(projetosCount), delta: "Atualizado agora", accent: "from-chart-3/30 to-chart-3/0" },
    { icon: Coins, label: "Créditos utilizados", value: credUsed.toLocaleString("pt-BR"), delta: `de ${credTotal.toLocaleString("pt-BR")}`, accent: "from-chart-4/30 to-chart-4/0" },
    { icon: Sparkles, label: "Empresas abertas hoje", value: "—", delta: "Em breve", accent: "from-chart-5/30 to-chart-5/0" },
  ];

  const maxBuscas = Math.max(...atividadeSemana.map((d) => d.buscas));
  const firstName = nome.split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-primary">Visão geral</div>
          <h1 className="font-display text-3xl font-bold mt-1">Bom dia{firstName ? `, ${firstName}` : ""} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Aqui está o resumo da sua operação comercial hoje.</p>
        </div>
        <Link to="/pesquisa" className="inline-flex items-center gap-2 rounded-lg gradient-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
          <Search className="h-4 w-4" /> Nova pesquisa
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ icon: Icon, label, value, delta, accent }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl glass p-5">
            <div className={`absolute -top-12 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} blur-2xl`} />
            <Icon className="h-5 w-5 text-primary relative" />
            <div className="mt-4 font-display text-3xl font-bold relative">{value}</div>
            <div className="mt-1 text-xs text-muted-foreground relative">{label}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent relative">
              <TrendingUp className="h-3 w-3" /> {delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl glass p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-semibold">Atividade da semana</h2>
              <p className="text-xs text-muted-foreground">Buscas e leads salvos nos últimos 7 dias</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Buscas</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Leads</span>
            </div>
          </div>
          <div className="flex items-end gap-4 h-48">
            {atividadeSemana.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1 h-40">
                  <div className="flex-1 rounded-t-md gradient-brand" style={{ height: `${(d.buscas / maxBuscas) * 100}%` }} />
                  <div className="flex-1 rounded-t-md bg-accent/60" style={{ height: `${(d.leads / maxBuscas) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{d.dia}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Projetos recentes</h2>
            <Link to="/projetos" className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline">
              Ver todos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {projetos.length === 0 && <div className="text-xs text-muted-foreground">Nenhum projeto ainda. Crie o primeiro na aba Projetos.</div>}
            {projetos.map((p) => (
              <Link key={p.id} to="/projetos" className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50 transition cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold bg-primary/20 text-primary">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Empresas recentes</h2>
            <p className="text-xs text-muted-foreground">Últimas empresas adicionadas à base</p>
          </div>
          <Link to="/pesquisa" className="text-xs font-medium text-primary hover:underline">Ir para pesquisa</Link>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-2 py-3 font-medium">Empresa</th>
                <th className="px-2 py-3 font-medium">CNPJ</th>
                <th className="px-2 py-3 font-medium">Cidade</th>
                <th className="px-2 py-3 font-medium">Segmento</th>
                <th className="px-2 py-3 font-medium">Situação</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((e) => (
                <tr key={e.id} className="border-b border-border/40 hover:bg-secondary/30 transition">
                  <td className="px-2 py-3 font-medium">{e.nome_fantasia || e.razao_social}</td>
                  <td className="px-2 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                  <td className="px-2 py-3 text-muted-foreground">{e.cidade}/{e.estado}</td>
                  <td className="px-2 py-3"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs">{e.segmento}</span></td>
                  <td className="px-2 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${e.situacao === "Ativa" ? "text-accent" : "text-destructive"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${e.situacao === "Ativa" ? "bg-accent" : "bg-destructive"}`} />
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
