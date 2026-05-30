import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Filter, Download, Bookmark, MapPin, Building2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { empresas } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/pesquisa")({
  component: PesquisaPage,
});

const estados = ["SP", "RJ", "MG", "PR", "RS", "BA", "PE", "CE", "DF", "AM"];
const segmentos = ["Tecnologia", "Saúde", "Construção", "Varejo", "Educação", "Indústria", "Logística", "Agro", "Serviços", "Financeiro"];
const chipsFiltros = ["CNPJ", "CNAE", "Cidade", "Estado", "Segmento", "Porte", "Situação"];

function PesquisaPage() {
  const [q, setQ] = useState("");
  const [chip, setChip] = useState("CNPJ");
  const [estadoSel, setEstadoSel] = useState<string[]>([]);
  const [segSel, setSegSel] = useState<string[]>([]);
  const [situacao, setSituacao] = useState("Todas");
  const [porte, setPorte] = useState("Todos");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => empresas.filter((e) => {
    if (q && !`${e.razaoSocial} ${e.nomeFantasia} ${e.cnpj}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (estadoSel.length && !estadoSel.includes(e.estado)) return false;
    if (segSel.length && !segSel.includes(e.segmento)) return false;
    if (situacao !== "Todas" && e.situacao !== situacao) return false;
    if (porte !== "Todos" && e.porte !== porte) return false;
    return true;
  }), [q, estadoSel, segSel, situacao, porte]);

  const toggle = (set: string[], v: string, setter: (n: string[]) => void) =>
    setter(set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-7 max-w-[1400px]">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Prospecção</div>
        <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Busque empresas em todo o Brasil</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Filtre por CNPJ, CNAE, cidade, segmento, porte, situação cadastral e potencial comercial.
        </p>
      </div>

      <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {chipsFiltros.map((c) => (
            <button key={c} onClick={() => setChip(c)} className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
              chip === c ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Buscar por ${chip.toLowerCase()}...`}
            className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition">
            Pesquisar empresas
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-5 h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-display text-[13px] font-semibold uppercase tracking-wider">Filtros avançados</h3>
          </div>

          <FilterBlock title="Estado">
            <div className="flex flex-wrap gap-1.5">
              {estados.map((e) => (
                <button key={e} onClick={() => toggle(estadoSel, e, setEstadoSel)}
                  className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
                    estadoSel.includes(e) ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-secondary/40 hover:bg-secondary/70"
                  }`}>{e}</button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Segmento">
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {segmentos.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={segSel.includes(s)} onChange={() => toggle(segSel, s, setSegSel)} className="rounded border-border accent-primary" />
                  <span className="text-[13px]">{s}</span>
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

          <button onClick={() => { setEstadoSel([]); setSegSel([]); setSituacao("Todas"); setPorte("Todos"); }}
            className="mt-3 w-full rounded-md border border-border py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition">
            Limpar filtros
          </button>
        </aside>

        <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-border/60">
            <div>
              <div className="text-sm font-semibold">
                <span className="text-primary">{filtered.length}</span> empresas encontradas
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {selected.size > 0 && `${selected.size} selecionada(s) · `}Atualizado em tempo real
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={selected.size === 0} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-3 py-1.5 text-xs font-medium hover:bg-secondary/60 disabled:opacity-40 transition">
                <Bookmark className="h-3.5 w-3.5" /> Salvar em projeto
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition">
                <Download className="h-3.5 w-3.5" /> Exportar CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background/30">
                <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 w-8"></th>
                  <th className="px-2 py-3 font-semibold">Empresa</th>
                  <th className="px-2 py-3 font-semibold">CNPJ</th>
                  <th className="px-2 py-3 font-semibold">Localização</th>
                  <th className="px-2 py-3 font-semibold">Segmento</th>
                  <th className="px-2 py-3 font-semibold">Porte</th>
                  <th className="px-2 py-3 font-semibold">Situação</th>
                  <th className="px-2 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((e) => (
                  <tr key={e.id} className={`border-t border-border/40 hover:bg-secondary/20 transition ${selected.has(e.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(e.id)} onChange={() => toggleRow(e.id)} className="rounded border-border accent-primary" />
                    </td>
                    <td className="px-2 py-3">
                      <Link to="/empresa/$id" params={{ id: e.id }} className="font-medium hover:text-primary">{e.nomeFantasia}</Link>
                      <div className="text-[11px] text-muted-foreground">{e.razaoSocial}</div>
                    </td>
                    <td className="px-2 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3 text-muted-foreground" />{e.cidade}/{e.estado}</div>
                    </td>
                    <td className="px-2 py-3"><span className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[11px]">{e.segmento}</span></td>
                    <td className="px-2 py-3 text-xs text-muted-foreground">{e.porte}</td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${e.situacao === "Ativa" ? "text-primary" : "text-destructive"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${e.situacao === "Ativa" ? "bg-primary" : "bg-destructive"}`} />
                        {e.situacao}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <button className="rounded-md p-1.5 hover:bg-secondary/60 text-muted-foreground hover:text-primary transition">
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
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-md bg-input/60 border border-border px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
