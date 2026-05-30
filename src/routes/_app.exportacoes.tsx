import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileJson, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/exportacoes")({
  component: ExportacoesPage,
});

const exports = [
  { nome: "Prospecção_SP_Q2.csv", tipo: "CSV", qtd: "1.842 empresas", data: "29/05/2026 14:32", status: "Concluído" },
  { nome: "Healthtech_Nacional.xlsx", tipo: "XLSX", qtd: "418 empresas", data: "28/05/2026 09:11", status: "Concluído" },
  { nome: "Indústrias_RS_PR.csv", tipo: "CSV", qtd: "967 empresas", data: "27/05/2026 18:47", status: "Concluído" },
  { nome: "Decisores_C-Level.json", tipo: "JSON", qtd: "284 contatos", data: "26/05/2026 11:20", status: "Processando" },
];

function ExportacoesPage() {
  return (
    <div className="space-y-7 max-w-[1400px]">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Exportações</div>
        <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Histórico de exportações</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Baixe e gerencie todas as exportações de empresas, decisores e enriquecimentos.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { l: "Exportações no mês", v: "24" },
          { l: "Registros exportados", v: "8.412" },
          { l: "Formatos disponíveis", v: "CSV · XLSX · JSON" },
        ].map((c) => (
          <div key={c.l} className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.l}</div>
            <div className="font-display text-xl font-bold mt-1">{c.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <h2 className="font-display text-base font-semibold">Exportações recentes</h2>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15">
            <Download className="h-3.5 w-3.5" /> Nova exportação
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-background/30">
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3 font-semibold">Arquivo</th>
              <th className="px-2 py-3 font-semibold">Tipo</th>
              <th className="px-2 py-3 font-semibold">Conteúdo</th>
              <th className="px-2 py-3 font-semibold">Data</th>
              <th className="px-6 py-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {exports.map((e) => (
              <tr key={e.nome} className="border-t border-border/40 hover:bg-secondary/20 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2.5">
                    {e.tipo === "JSON" ? <FileJson className="h-4 w-4 text-primary" /> : <FileSpreadsheet className="h-4 w-4 text-primary" />}
                    <span className="font-medium">{e.nome}</span>
                  </div>
                </td>
                <td className="px-2 py-3"><span className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[11px]">{e.tipo}</span></td>
                <td className="px-2 py-3 text-xs text-muted-foreground">{e.qtd}</td>
                <td className="px-2 py-3 text-xs text-muted-foreground">{e.data}</td>
                <td className="px-6 py-3 text-right">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${e.status === "Concluído" ? "text-primary" : "text-muted-foreground"}`}>
                    {e.status === "Concluído" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
