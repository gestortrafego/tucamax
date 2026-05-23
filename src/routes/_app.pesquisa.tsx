import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Filter, Download, Bookmark, MapPin, Building2, ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import { empresas } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/pesquisa")({
  component: PesquisaPage,
});

const estados = ["SP", "RJ", "MG", "PR", "RS", "BA", "PE", "CE", "DF", "AM"];
const segmentos = ["Tecnologia", "Saúde", "Construção", "Varejo", "Educação", "Indústria", "Logística", "Agro", "Serviços", "Financeiro"];

function PesquisaPage() {
  const [q, setQ] = useState("");
  const [estadoSel, setEstadoSel] = useState<string[]>([]);
  const [segSel, setSegSel] = useState<string[]>([]);
  const [situacao, setSituacao] = useState("Todas");
  const [porte, setPorte] = useState("Todos");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return empresas.filter((e) => {
      if (q && !`${e.razaoSocial} ${e.nomeFantasia} ${e.cnpj}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (estadoSel.length && !estadoSel.includes(e.estado)) return false;
      if (segSel.length && !segSel.includes(e.segmento)) return false;
      if (situacao !== "Todas" && e.situacao !== situacao) return false;
      if (porte !== "Todos" && e.porte !== porte) return false;
      return true;
    });
  }, [q, estadoSel, segSel, situacao, porte]);

  const toggle = (set: string[], v: string, setter: (n: string[]) => void) =>
    setter(set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-primary">Pesquisa</div>
        <h1 className="font-display text-3xl font-bold mt-1">Encontre empresas em segundos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Busque por CNPJ, razão social ou nome fantasia. Filtre por localidade, segmento e mais.
        </p>
      </div>

      {/* Search bar */}
      <div className="rounded-2xl glass p-2">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground ml-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex.: 12.345.678/0001-90, Tucano Tecnologia, Aurora..."
            className="flex-1 bg-transparent py-3 text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-lg gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20">
            Buscar
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="rounded-2xl glass p-5 h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Filtros</h3>
          </div>

          <FilterBlock title="Estado">
            <div className="flex flex-wrap gap-1.5">
              {estados.map((e) => (
                <button
                  key={e}
                  onClick={() => toggle(estadoSel, e, setEstadoSel)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                    estadoSel.includes(e) ? "gradient-brand text-primary-foreground" : "bg-secondary hover:bg-secondary/70"
                  }`}
                >{e}</button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Segmento">
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {segmentos.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={segSel.includes(s)}
                    onChange={() => toggle(segSel, s, setSegSel)}
                    className="rounded border-border accent-primary"
                  />
                  {s}
                </label>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Situação cadastral">
            <Select value={situacao} onChange={setSituacao} options={["Todas", "Ativa", "Suspensa", "Baixada", "Inapta"]} />
          </FilterBlock>

          <FilterBlock title="Porte">
            <Select value={porte} onChange={setPorte} options={["Todos", "MEI", "ME", "EPP", "Demais"]} />
          </FilterBlock>

          <button
            onClick={() => { setEstadoSel([]); setSegSel([]); setSituacao("Todas"); setPorte("Todos"); }}
            className="mt-2 w-full rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
          >
            Limpar filtros
          </button>
        </aside>

        {/* Results */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-5 border-b border-border">
            <div>
              <div className="text-sm font-semibold">
                <span className="text-gradient-brand">{filtered.length}</span> empresas encontradas
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {selected.size > 0 && `${selected.size} selecionada(s) · `}
                Atualizado em tempo real
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={selected.size === 0} className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-medium hover:bg-secondary/70 disabled:opacity-40 transition">
                <Bookmark className="h-3.5 w-3.5" /> Salvar em projeto
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg gradient-brand px-3 py-2 text-xs font-semibold text-primary-foreground">
                <Download className="h-3.5 w-3.5" /> Exportar CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background/30">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 w-8"></th>
                  <th className="px-2 py-3 font-medium">Empresa</th>
                  <th className="px-2 py-3 font-medium">CNPJ</th>
                  <th className="px-2 py-3 font-medium">Localização</th>
                  <th className="px-2 py-3 font-medium">Segmento</th>
                  <th className="px-2 py-3 font-medium">Porte</th>
                  <th className="px-2 py-3 font-medium">Situação</th>
                  <th className="px-2 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((e) => (
                  <tr key={e.id} className={`border-t border-border/40 hover:bg-secondary/30 transition ${selected.has(e.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(e.id)} onChange={() => toggleRow(e.id)} className="rounded border-border accent-primary" />
                    </td>
                    <td className="px-2 py-3">
                      <Link to="/empresa/$id" params={{ id: e.id }} className="font-medium hover:text-primary">{e.nomeFantasia}</Link>
                      <div className="text-xs text-muted-foreground">{e.razaoSocial}</div>
                    </td>
                    <td className="px-2 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3 text-muted-foreground" />{e.cidade}/{e.estado}</div>
                    </td>
                    <td className="px-2 py-3"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs">{e.segmento}</span></td>
                    <td className="px-2 py-3 text-xs text-muted-foreground">{e.porte}</td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${e.situacao === "Ativa" ? "text-accent" : "text-destructive"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${e.situacao === "Ativa" ? "bg-accent" : "bg-destructive"}`} />
                        {e.situacao}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <button className="rounded-md p-1.5 hover:bg-secondary text-muted-foreground hover:text-primary">
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma empresa corresponde aos filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-lg bg-input/60 border border-border px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
