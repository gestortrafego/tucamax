import { createFileRoute } from "@tanstack/react-router";
import { Plus, FolderKanban, MoreHorizontal, Edit3, Archive, Eye, Calendar, Users, X, Copy } from "lucide-react";
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
    toast.success("Projeto criado");
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

  const duplicate = async (p: Projeto) => {
    if (!user) return;
    const { error } = await supabase.from("projects").insert({ name: `${p.name} (cópia)`, user_id: user.id });
    if (error) return toast.error(error.message);
    toast.success("Projeto duplicado");
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
    <div className="space-y-7 max-w-[1400px]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Projetos</div>
          <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Organize sua operação comercial</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Agrupe empresas por campanha, cidade, segmento, equipe ou estratégia.
          </p>
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15 transition">
          <Plus className="h-4 w-4" /> Novo projeto
        </button>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-glass-border bg-card/60 backdrop-blur-xl p-1 w-fit">
        {(["ativos", "arquivados"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${tab === t ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "ativos" ? "Ativos" : "Arquivados"}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-12 text-center">
          <FolderKanban className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <div className="font-display text-base font-semibold">Nenhum projeto {tab === "ativos" ? "ativo" : "arquivado"}</div>
          <p className="text-sm text-muted-foreground mt-1">Crie seu primeiro projeto para organizar a operação.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="group relative rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-5 hover:border-primary/30 transition">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 text-primary">
                <FolderKanban className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${p.status === "ativo" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${p.status === "ativo" ? "bg-primary" : "bg-muted-foreground"}`} />
                  {p.status === "ativo" ? "Ativo" : "Arquivado"}
                </span>
                <div className="relative">
                  <button onClick={() => setMenuFor(menuFor === p.id ? null : p.id)} className="rounded-md p-1.5 hover:bg-secondary/60 transition">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {menuFor === p.id && (
                    <div className="absolute right-0 top-9 z-10 w-48 rounded-lg border border-glass-border bg-popover backdrop-blur-2xl shadow-xl p-1 text-sm">
                      {[
                        { icon: Eye, label: "Visualizar leads", fn: () => openLeads(p) },
                        { icon: Edit3, label: "Renomear", fn: () => rename(p.id) },
                        { icon: Copy, label: "Duplicar", fn: () => duplicate(p) },
                        { icon: Archive, label: p.status === "arquivado" ? "Desarquivar" : "Arquivar", fn: () => archive(p) },
                      ].map(({ icon: Icon, label, fn }) => (
                        <button key={label} onClick={() => { fn(); setMenuFor(null); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-secondary/60 text-left text-[13px]">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h3 className="mt-4 font-display text-base font-semibold truncate">{p.name}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded-md border border-border/60 bg-background/30 px-3 py-2">
                <div className="text-muted-foreground inline-flex items-center gap-1"><Users className="h-3 w-3" /> Empresas</div>
                <div className="mt-0.5 font-display text-sm font-bold tabular-nums">{p.leads}</div>
              </div>
              <div className="rounded-md border border-border/60 bg-background/30 px-3 py-2">
                <div className="text-muted-foreground inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Criado</div>
                <div className="mt-0.5 font-medium">{new Date(p.created_at).toLocaleDateString("pt-BR")}</div>
              </div>
            </div>
            <button onClick={() => openLeads(p)} className="mt-4 w-full rounded-md border border-border bg-secondary/30 py-2 text-xs font-medium hover:bg-secondary/60 transition">
              Visualizar empresas salvas
            </button>
          </div>
        ))}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-md rounded-xl border border-glass-border bg-popover backdrop-blur-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-lg font-semibold">Criar novo projeto</h2>
            <p className="text-xs text-muted-foreground mt-1">Dê um nome para começar a salvar empresas.</p>
            <div className="mt-5">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex.: Prospecção SaaS Sudeste Q3" className="w-full rounded-md bg-input/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowNew(false)} className="rounded-md px-4 py-2 text-sm hover:bg-secondary/60">Cancelar</button>
              <button onClick={create} className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15">Criar projeto</button>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setViewing(null)}>
          <div className="w-full max-w-3xl max-h-[80vh] overflow-auto rounded-xl border border-glass-border bg-popover backdrop-blur-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">{viewing.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">{leadsView.length} empresas salvas neste projeto</p>
              </div>
              <button onClick={() => setViewing(null)} className="rounded-md p-1.5 hover:bg-secondary/60"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 overflow-x-auto">
              {leadsView.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">Nenhuma empresa salva ainda neste projeto.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="px-2 py-3 font-semibold">Empresa</th>
                      <th className="px-2 py-3 font-semibold">CNPJ</th>
                      <th className="px-2 py-3 font-semibold">Localização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsView.map((e) => (
                      <tr key={e.id} className="border-b border-border/40">
                        <td className="px-2 py-3 font-medium">{e.nome_fantasia || e.razao_social}</td>
                        <td className="px-2 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                        <td className="px-2 py-3 text-muted-foreground text-xs">{e.cidade}/{e.estado}</td>
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
