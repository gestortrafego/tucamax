import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Mail, Phone, Globe, Users, Upload, FileSpreadsheet, Zap, CheckCircle2, BarChart3, Briefcase } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/enriquecimento")({
  component: EnriquecimentoPage,
});

const fontes = [
  { icon: Mail, label: "E-mails corporativos", desc: "Identificação por padrão e validação SMTP", custo: "1 crédito", on: true },
  { icon: Phone, label: "Telefones comerciais", desc: "Fixos e móveis vinculados ao CNPJ", custo: "1 crédito", on: true },
  { icon: Globe, label: "Site e redes sociais", desc: "Domínio oficial, LinkedIn, Instagram", custo: "1 crédito", on: false },
  { icon: Users, label: "Decisores C-Level", desc: "CEO, CFO, CMO, Diretor Comercial", custo: "5 créditos", on: true },
  { icon: Briefcase, label: "CNAE e atividade econômica", desc: "Classificação completa e atividades secundárias", custo: "1 crédito", on: true },
  { icon: BarChart3, label: "Score de oportunidade", desc: "Análise preditiva de potencial comercial", custo: "3 créditos", on: false },
];

function EnriquecimentoPage() {
  const [fontes2, setFontes2] = useState(fontes);
  const toggle = (i: number) => setFontes2(fontes2.map((f, idx) => (idx === i ? { ...f, on: !f.on } : f)));
  const ativos = fontes2.filter((f) => f.on).length;
  const custoTotal = fontes2.filter((f) => f.on).reduce((acc, f) => acc + parseInt(f.custo), 0);

  return (
    <div className="space-y-7 max-w-[1400px]">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Enriquecimento</div>
        <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Enriqueça empresas com dados comerciais</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Adicione contatos, decisores, canais digitais e informações estratégicas às empresas selecionadas.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">1</span>
              <h2 className="font-display text-base font-semibold">Importe sua base de empresas</h2>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/30 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-3">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Arraste seu arquivo CSV ou XLSX</h3>
              <p className="mt-1 text-xs text-muted-foreground">Ou cole uma lista de CNPJs. Limite: 10.000 linhas por lote.</p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition">Selecionar arquivo</button>
                <button className="rounded-md border border-border bg-background/40 px-4 py-2 text-xs font-medium hover:bg-secondary/60 transition">Colar CNPJs</button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Suporta .csv e .xlsx contendo a coluna "cnpj"
            </div>
          </div>

          <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">2</span>
              <h2 className="font-display text-base font-semibold">Selecione os dados a enriquecer</h2>
            </div>
            <div className="space-y-2">
              {fontes2.map((f, i) => (
                <div key={f.label} className={`flex items-center gap-4 rounded-lg border p-4 transition ${f.on ? "border-primary/30 bg-primary/[0.04]" : "border-border bg-background/20"}`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-md ${f.on ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-secondary/60 text-muted-foreground"}`}>
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{f.label}</div>
                    <div className="text-[11px] text-muted-foreground">{f.desc}</div>
                  </div>
                  <div className="text-[11px] text-primary font-semibold tabular-nums">{f.custo}</div>
                  <button onClick={() => toggle(i)} className={`relative h-5 w-9 rounded-full transition ${f.on ? "bg-primary" : "bg-secondary"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${f.on ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-6 sticky top-24">
            <h2 className="font-display text-base font-semibold mb-4">Resumo da operação</h2>
            <div className="space-y-3 text-sm">
              <Row k="Empresas selecionadas" v="—" />
              <Row k="Campos ativos" v={`${ativos} de ${fontes2.length}`} />
              <Row k="Custo por empresa" v={<span className="text-primary font-semibold tabular-nums">{custoTotal} créditos</span>} />
              <Row k="Tempo estimado" v="< 2 min" />
            </div>
            <div className="my-5 h-px bg-border/60" />
            <button className="w-full rounded-md border border-primary/40 bg-primary/10 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15 transition inline-flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" /> Iniciar enriquecimento
            </button>
            <p className="mt-3 text-[10px] text-muted-foreground text-center">
              Dados conforme LGPD. Apenas informações públicas e fontes oficiais.
            </p>
          </div>

          <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <h3 className="font-semibold text-sm">Histórico recente</h3>
            </div>
            {[
              { n: "Healthtech_SP.csv", q: "142 empresas", s: "Concluído" },
              { n: "Indústrias_RS.csv", q: "97 empresas", s: "Concluído" },
              { n: "Varejo_NE_Q2.csv", q: "318 empresas", s: "Concluído" },
            ].map((h) => (
              <div key={h.n} className="flex items-center gap-3 py-2.5 border-t border-border/60 first:border-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{h.n}</div>
                  <div className="text-[10px] text-muted-foreground">{h.q}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-[11px]">{k}</span>
      <span className="text-sm font-medium">{v}</span>
    </div>
  );
}
