import { createFileRoute } from "@tanstack/react-router";
import { Plug, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/integracoes")({
  component: IntegracoesPage,
});

const integracoes = [
  { n: "HubSpot", c: "CRM", desc: "Sincronize empresas e decisores diretamente no seu CRM", on: true },
  { n: "Salesforce", c: "CRM", desc: "Push automatizado de oportunidades qualificadas", on: false },
  { n: "Pipedrive", c: "CRM", desc: "Crie contatos e negócios sem fricção", on: true },
  { n: "RD Station", c: "Marketing", desc: "Importe leads enriquecidos para automações", on: false },
  { n: "Slack", c: "Comunicação", desc: "Notificações em tempo real para sua equipe", on: false },
  { n: "Microsoft Teams", c: "Comunicação", desc: "Alertas e relatórios direto no Teams", on: false },
  { n: "Zapier", c: "Automação", desc: "Conecte VMAX Atlas a 6.000+ aplicativos", on: false },
  { n: "Make", c: "Automação", desc: "Workflows visuais sem código", on: false },
  { n: "Webhooks / API", c: "Desenvolvedores", desc: "Integração customizada via REST API", on: true },
];

function IntegracoesPage() {
  const cats = Array.from(new Set(integracoes.map((i) => i.c)));

  return (
    <div className="space-y-7 max-w-[1400px]">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Integrações</div>
        <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Conecte seu stack comercial</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Integre VMAX Atlas com CRMs, automações e ferramentas de comunicação para um fluxo comercial unificado.
        </p>
      </div>

      {cats.map((cat) => (
        <div key={cat}>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{cat}</div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {integracoes.filter((i) => i.c === cat).map((i) => (
              <div key={i.n} className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 text-primary">
                    <Plug className="h-4 w-4" />
                  </div>
                  {i.on && <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary"><CheckCircle2 className="h-3 w-3" /> Conectado</span>}
                </div>
                <div className="mt-3 font-semibold text-sm">{i.n}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{i.desc}</div>
                <button className={`mt-4 w-full rounded-md py-1.5 text-xs font-semibold transition ${i.on ? "border border-border bg-background/40 hover:bg-secondary/60" : "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"}`}>
                  {i.on ? "Gerenciar" : "Conectar"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
