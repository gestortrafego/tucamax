import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Search, MapPin, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/empresas")({
  component: EmpresasPage,
});

type Empresa = { id: string; nome_fantasia: string | null; razao_social: string; cnpj: string; cidade: string | null; estado: string | null; segmento: string | null; situacao: string | null; porte: string | null };

function EmpresasPage() {
  const [list, setList] = useState<Empresa[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("companies")
      .select("id, nome_fantasia, razao_social, cnpj, cidade, estado, segmento, situacao, porte")
      .order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => setList((data ?? []) as Empresa[]));
  }, []);

  const filtered = list.filter((e) => !q || `${e.razao_social} ${e.nome_fantasia} ${e.cnpj}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-7 max-w-[1400px]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Empresas</div>
          <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Base nacional de empresas</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Acervo de empresas mapeadas e disponíveis para análise comercial.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/pesquisa" className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 transition">
            <Search className="h-4 w-4" /> Nova prospecção
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar por razão social, fantasia ou CNPJ..."
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none placeholder:text-muted-foreground" />
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-3 py-1.5 text-xs font-medium hover:bg-secondary/60">
            <Download className="h-3.5 w-3.5" /> Exportar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="text-sm font-semibold"><span className="text-primary">{filtered.length}</span> empresas na sua base</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/30">
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 font-semibold">Empresa</th>
                <th className="px-2 py-3 font-semibold">CNPJ</th>
                <th className="px-2 py-3 font-semibold">Localização</th>
                <th className="px-2 py-3 font-semibold">Segmento</th>
                <th className="px-2 py-3 font-semibold">Porte</th>
                <th className="px-6 py-3 font-semibold text-right">Situação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center">
                  <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhuma empresa salva ainda.</p>
                  <Link to="/pesquisa" className="mt-3 inline-block text-xs font-medium text-primary hover:underline">Iniciar prospecção →</Link>
                </td></tr>
              )}
              {filtered.map((e) => (
                <tr key={e.id} className="border-t border-border/40 hover:bg-secondary/20 transition">
                  <td className="px-6 py-3 font-medium">{e.nome_fantasia || e.razao_social}</td>
                  <td className="px-2 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                  <td className="px-2 py-3 text-xs"><span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{e.cidade}/{e.estado}</span></td>
                  <td className="px-2 py-3"><span className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[11px]">{e.segmento}</span></td>
                  <td className="px-2 py-3 text-xs text-muted-foreground">{e.porte}</td>
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
