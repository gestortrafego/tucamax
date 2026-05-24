import { createFileRoute } from "@tanstack/react-router";
import { Plus, FolderKanban, MoreHorizontal, Edit3, Archive, Eye, Calendar, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/projetos")({
  component: ProjetosPage,
});

type Projeto = { id: string; name: string; status: string; created_at: string; leads?: number };
type Empresa = { id: string; nome_fantasia: string | null; razao_social: string; cnpj: string; cidade: string | null; estado: string | null };

function ProjetosPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Projeto[]>([]);
  const [tab, setTab] = useState<"ativos" | "arquivados">("ativos");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Projeto | null>(null);
  const [leadsView, setLeadsView] = useState<Empresa[]>([]);

  const load = async () => {
    if (!user) return;
    const { data: projects } = await supabase.from("projects").select("id, name, status, created_at").order("created_at", { ascending: false });
    const ids = (projects ?? []).map(p => p.id);
    let counts: Record<string, number> = {};
    if (ids.length) {
      const { data: pc } = await supabase.from("project_companies").select("project_id").in("project_id", ids);
      counts = (pc ?? []).reduce((acc: Record<string, number>, r: { project_id: string }) => {
        acc[r.project_id] = (acc[r.project_id] || 0) + 1; return acc;
      }, {});
    }
    setList((projects ?? []).map(p => ({ ...p, leads: counts[p.id] || 0 })));
  };

  useEffect(() => { load(); }, [user]);

  const filtered = list.filter((p) => (tab === "ativos" ? p.status === "ativo" : p.status === "arquivado"));

  const create = async () => {
    if (!newName.trim() || !user) return;
    const { error } = await supabase.from("projects").insert({ name: newName, user_id: user.id });
    if (error) return toast.error(error.message);
    setNewName(""); setShowNew(false);
    toast.success("Projeto criado!");
    load();
  };

  const archive = async (p: Projeto) => {
    const next = p.status === "ativo" ? "arquivado" : "ativo";
    const { error } = await supabase.from("projects").update({ status: next }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  };

  const rename = async (id: string) => {
    const n = prompt("Novo nome do projeto:");
    if (!n) return;
    const { error } = await supabase.from("projects").update({ name: n }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const openLeads = async (p: Projeto) => {
    setViewing(p);
    const { data } = await supabase
      .from("project_companies")
      .select("companies(id, nome_fantasia, razao_social, cnpj, cidade, estado)")
      .eq("project_id", p.id);
    setLeadsView(((data ?? []).map((r: { companies: Empresa }) => r.companies).filter(Boolean)) as Empresa[]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-primary">Projetos</div>
          <h1 className="font-display text-3xl font-bold mt-1">Organize sua prospecção</h1>
          <p className="text-sm text-muted-foreground mt-1">Agrupe leads em projetos por campanha, segmento ou time.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-lg gradient-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Novo projeto
        </button>
      </div>

      <div className="flex items-center gap-1 rounded-lg glass p-1 w-fit">
        {(["ativos", "arquivados"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${tab === t ? "gradient-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "ativos" ? "Ativos" : "Arquivados"}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl glass p-12 text-center">
          <FolderKanban className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <div className="font-display text-lg font-semibold">Nenhum projeto {tab === "ativos" ? "ativo" : "arquivado"}</div>
          <p className="text-sm text-muted-foreground mt-1">Crie seu primeiro projeto para começar a organizar leads.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="group relative overflow-hidden rounded-2xl glass p-6 hover:border-primary/40 transition">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl bg-primary/20" />
            <div className="flex items-start justify-between relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div className="relative">
                <button onClick={() => setMenuFor(menuFor === p.id ? null : p.id)} className="rounded-md p-1.5 hover:bg-secondary">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuFor === p.id && (
                  <div className="absolute right-0 top-9 z-10 w-44 rounded-lg glass shadow-xl p-1 text-sm">
                    {[
                      { icon: Eye, label: "Visualizar leads", fn: () => openLeads(p) },
                      { icon: Edit3, label: "Renomear", fn: () => rename(p.id) },
                      { icon: Archive, label: p.status === "arquivado" ? "Desarquivar" : "Arquivar", fn: () => archive(p) },
                    ].map(({ icon: Icon, label, fn }) => (
                      <button key={label} onClick={() => { fn(); setMenuFor(null); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary text-left">
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold relative">{p.name}</h3>
            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground relative">
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {p.leads} leads</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(p.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
            <button onClick={() => openLeads(p)} className="mt-4 w-full rounded-lg border border-border bg-secondary/30 py-2 text-xs font-medium hover:bg-secondary transition relative">
              Visualizar leads
            </button>
          </div>
        ))}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-md rounded-2xl glass p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-semibold">Criar novo projeto</h2>
            <p className="text-xs text-muted-foreground mt-1">Dê um nome para começar a salvar leads.</p>
            <div className="mt-5 space-y-3">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do projeto" className="w-full rounded-lg bg-input/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowNew(false)} className="rounded-lg px-4 py-2 text-sm hover:bg-secondary">Cancelar</button>
              <button onClick={create} className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">Criar projeto</button>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setViewing(null)}>
          <div className="w-full max-w-3xl max-h-[80vh] overflow-auto rounded-2xl glass p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">{viewing.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">{leadsView.length} empresas salvas neste projeto</p>
              </div>
              <button onClick={() => setViewing(null)} className="rounded-md p-1.5 hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 overflow-x-auto">
              {leadsView.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">Nenhum lead salvo ainda neste projeto.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="px-2 py-3 font-medium">Empresa</th>
                      <th className="px-2 py-3 font-medium">CNPJ</th>
                      <th className="px-2 py-3 font-medium">Localização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsView.map((e) => (
                      <tr key={e.id} className="border-b border-border/40">
                        <td className="px-2 py-3 font-medium">{e.nome_fantasia || e.razao_social}</td>
                        <td className="px-2 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                        <td className="px-2 py-3 text-muted-foreground">{e.cidade}/{e.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
