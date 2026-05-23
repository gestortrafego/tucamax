import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Mail, Phone, Linkedin, Globe, Users, Upload, FileSpreadsheet, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/enriquecimento")({
  component: EnriquecimentoPage,
});

const fontes = [
  { icon: Mail, label: "E-mails corporativos", desc: "Detecção via padrões + verificação SMTP", custo: "1 crédito", on: true },
  { icon: Phone, label: "Telefones", desc: "Fixos e móveis vinculados ao CNPJ", custo: "1 crédito", on: true },
  { icon: Linkedin, label: "LinkedIn da empresa", desc: "Página oficial + contagem de funcionários", custo: "2 créditos", on: true },
  { icon: Globe, label: "Website e redes sociais", desc: "Domínio oficial, Instagram, Facebook", custo: "1 crédito", on: false },
  { icon: Users, label: "Decisores (C-level)", desc: "CEO, CFO, CMO, Diretor Comercial", custo: "5 créditos", on: true },
];

function EnriquecimentoPage() {
  const [fontes2, setFontes2] = useState(fontes);
  const [progress, setProgress] = useState(0);

  const toggle = (i: number) => setFontes2(fontes2.map((f, idx) => (idx === i ? { ...f, on: !f.on } : f)));
  const ativos = fontes2.filter((f) => f.on).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-primary">Enriquecimento</div>
        <h1 className="font-display text-3xl font-bold mt-1">Transforme CNPJs em leads completos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione as fontes de dados e enriqueça uma lista de empresas com contatos, decisores e muito mais.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload */}
          <div className="rounded-2xl glass p-6">
            <h2 className="font-display text-lg font-semibold mb-4">1. Importe sua lista</h2>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/30 p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand mb-4">
                <Upload className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">Arraste seu arquivo CSV aqui</h3>
              <p className="mt-1 text-xs text-muted-foreground">Ou cole uma lista de CNPJs. Limite: 10.000 linhas por lote.</p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-lg gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground">Selecionar arquivo</button>
                <button className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-secondary">Colar CNPJs</button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Suporta .csv e .xlsx com coluna "cnpj"
            </div>
          </div>

          {/* Sources */}
          <div className="rounded-2xl glass p-6">
            <h2 className="font-display text-lg font-semibold mb-4">2. Escolha o que enriquecer</h2>
            <div className="space-y-2">
              {fontes2.map((f, i) => (
                <div key={f.label} className={`flex items-center gap-4 rounded-xl border p-4 transition ${f.on ? "border-primary/40 bg-primary/5" : "border-border bg-secondary/20"}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.on ? "gradient-brand text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{f.label}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                  <div className="text-xs text-accent font-medium">{f.custo}</div>
                  <button onClick={() => toggle(i)} className={`relative h-6 w-11 rounded-full transition ${f.on ? "gradient-brand" : "bg-secondary"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${f.on ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl glass p-6 sticky top-24">
            <h2 className="font-display text-lg font-semibold mb-4">Resumo do enriquecimento</h2>
            <div className="space-y-3 text-sm">
              <Row k="Empresas na lista" v="—" />
              <Row k="Fontes ativas" v={`${ativos} de ${fontes2.length}`} />
              <Row k="Custo estimado" v={<span className="text-accent font-bold">~ 0 créditos</span>} />
              <Row k="Tempo estimado" v="< 1 min" />
            </div>
            <div className="my-5 h-px bg-border" />
            <button className="w-full rounded-lg gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 inline-flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" /> Iniciar enriquecimento
            </button>
            <p className="mt-3 text-[10px] text-muted-foreground text-center">
              Dados conforme LGPD. Apenas informações públicas e fontes oficiais.
            </p>
          </div>

          <div className="rounded-2xl glass p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-sm">Histórico recente</h3>
            </div>
            {[
              { n: "Lista Healthtech.csv", q: "142 empresas", s: "Concluído" },
              { n: "Prospecção SP Q2.csv", q: "318 empresas", s: "Concluído" },
              { n: "Indústrias RS.csv", q: "97 empresas", s: "Concluído" },
            ].map((h) => (
              <div key={h.n} className="flex items-center gap-3 py-2 border-t border-border first:border-0">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
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
      <span className="text-muted-foreground text-xs">{k}</span>
      <span className="text-sm font-medium">{v}</span>
    </div>
  );
}
