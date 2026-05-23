import { createFileRoute } from "@tanstack/react-router";
import { Plus, FolderKanban, MoreHorizontal, Copy, Edit3, Archive, Eye, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { projetos as initial, type Projeto } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/projetos")({
  component: ProjetosPage,
});

function ProjetosPage() {
  const [list, setList] = useState<Projeto[]>(initial);
  const [tab, setTab] = useState<"ativos" | "arquivados">("ativos");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const filtered = list.filter((p) => (tab === "ativos" ? !p.arquivado : p.arquivado));

  const create = () => {
    if (!newName.trim()) return;
    setList([
      { id: `p${Date.now()}`, nome: newName, descricao: newDesc, leads: 0, criadoEm: new Date().toISOString().slice(0, 10), atualizadoEm: new Date().toISOString().slice(0, 10), arquivado: false, cor: "orange" },
      ...list,
    ]);
    setNewName(""); setNewDesc(""); setShowNew(false);
  };

  const duplicate = (p: Projeto) => setList([{ ...p, id: `p${Date.now()}`, nome: `${p.nome} (cópia)`, criadoEm: new Date().toISOString().slice(0, 10) }, ...list]);
  const archive = (id: string) => setList(list.map((p) => (p.id === id ? { ...p, arquivado: !p.arquivado } : p)));
  const rename = (id: string) => {
    const n = prompt("Novo nome do projeto:");
    if (n) setList(list.map((p) => (p.id === id ? { ...p, nome: n } : p)));
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="group relative overflow-hidden rounded-2xl glass p-6 hover:border-primary/40 transition">
            <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl ${p.cor === "orange" ? "bg-primary/20" : p.cor === "yellow" ? "bg-accent/20" : "bg-chart-3/20"}`} />
            <div className="flex items-start justify-between relative">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.cor === "orange" ? "bg-primary/20 text-primary" : p.cor === "yellow" ? "bg-accent/20 text-accent" : "bg-chart-3/20 text-chart-3"}`}>
                <FolderKanban className="h-5 w-5" />
              </div>
              <div className="relative">
                <button onClick={() => setMenuFor(menuFor === p.id ? null : p.id)} className="rounded-md p-1.5 hover:bg-secondary">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuFor === p.id && (
                  <div className="absolute right-0 top-9 z-10 w-44 rounded-lg glass shadow-xl p-1 text-sm">
                    {[
                      { icon: Eye, label: "Visualizar leads", fn: () => {} },
                      { icon: Edit3, label: "Renomear", fn: () => rename(p.id) },
                      { icon: Copy, label: "Duplicar", fn: () => duplicate(p) },
                      { icon: Archive, label: p.arquivado ? "Desarquivar" : "Arquivar", fn: () => archive(p.id) },
                    ].map(({ icon: Icon, label, fn }) => (
                      <button key={label} onClick={() => { fn(); setMenuFor(null); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary text-left">
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold relative">{p.nome}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 relative">{p.descricao}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground relative">
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {p.leads} leads</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(p.atualizadoEm).toLocaleDateString("pt-BR")}</span>
            </div>
            <button className="mt-4 w-full rounded-lg border border-border bg-secondary/30 py-2 text-xs font-medium hover:bg-secondary transition relative">
              Visualizar leads
            </button>
          </div>
        ))}
      </div>

      {/* New project modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-md rounded-2xl glass p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-semibold">Criar novo projeto</h2>
            <p className="text-xs text-muted-foreground mt-1">Dê um nome e descrição para começar a salvar leads.</p>
            <div className="mt-5 space-y-3">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do projeto" className="w-full rounded-lg bg-input/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Descrição (opcional)" rows={3} className="w-full rounded-lg bg-input/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowNew(false)} className="rounded-lg px-4 py-2 text-sm hover:bg-secondary">Cancelar</button>
              <button onClick={create} className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">Criar projeto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
