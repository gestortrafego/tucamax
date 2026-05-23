import { createFileRoute } from "@tanstack/react-router";
import { User, Building2, Key, CreditCard, Bell, Users, Plug } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/configuracoes")({
  component: ConfigPage,
});

const tabs = [
  { id: "conta", label: "Conta", icon: User },
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "api", label: "API Keys", icon: Key },
  { id: "plano", label: "Plano e cobrança", icon: CreditCard },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "integracoes", label: "Integrações", icon: Plug },
];

function ConfigPage() {
  const [tab, setTab] = useState("conta");

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-primary">Configurações</div>
        <h1 className="font-display text-3xl font-bold mt-1">Configurações da conta</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seu perfil, equipe e integrações.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1 rounded-2xl glass p-2 h-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                tab === t.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </aside>

        <div className="rounded-2xl glass p-8">
          {tab === "conta" && <ContaTab />}
          {tab === "empresa" && <EmpresaTab />}
          {tab === "api" && <ApiTab />}
          {tab === "plano" && <PlanoTab />}
          {tab === "notificacoes" && <NotifTab />}
          {tab === "equipe" && <EquipeTab />}
          {tab === "integracoes" && <IntegracoesTab />}
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} defaultValue={defaultValue} className="mt-1.5 w-full rounded-lg bg-input/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-border">
      <button className="rounded-lg px-4 py-2 text-sm hover:bg-secondary">Cancelar</button>
      <button className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">Salvar alterações</button>
    </div>
  );
}

function ContaTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold">Informações pessoais</h2>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-xl font-bold text-primary-foreground">RP</div>
        <div>
          <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">Alterar foto</button>
          <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG ou SVG. Máx 2MB.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" defaultValue="Rafael" />
        <Field label="Sobrenome" defaultValue="Prado" />
        <Field label="E-mail" defaultValue="rafael@tucamax.com" type="email" />
        <Field label="Cargo" defaultValue="Head of Sales" />
      </div>
      <SaveBar />
    </div>
  );
}

function EmpresaTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold">Dados da empresa</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Razão social" defaultValue="Tucamax Sistemas LTDA" />
        <Field label="Nome fantasia" defaultValue="Tucamax" />
        <Field label="CNPJ" defaultValue="12.345.678/0001-90" />
        <Field label="Segmento" defaultValue="SaaS B2B" />
      </div>
      <SaveBar />
    </div>
  );
}

function ApiTab() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold">API Keys</h2>
      <p className="text-sm text-muted-foreground">Use estas chaves para integrar a Tucamax com seu CRM ou ferramentas internas.</p>
      <div className="rounded-xl border border-border bg-background/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Chave de produção</span>
          <span className="text-[10px] uppercase tracking-wider text-accent">Ativa</span>
        </div>
        <code className="block rounded-md bg-background/60 p-2 font-mono text-xs text-muted-foreground">tcmx_live_••••••••••••••••a9f2</code>
        <div className="mt-3 flex gap-2">
          <button className="rounded-md bg-secondary px-3 py-1.5 text-xs hover:bg-secondary/70">Copiar</button>
          <button className="rounded-md bg-secondary px-3 py-1.5 text-xs hover:bg-secondary/70">Regenerar</button>
        </div>
      </div>
      <button className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">+ Gerar nova chave</button>
    </div>
  );
}

function PlanoTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold">Plano e cobrança</h2>
      <div className="rounded-2xl gradient-brand p-6 text-primary-foreground">
        <div className="text-xs uppercase tracking-wider opacity-80">Plano atual</div>
        <div className="font-display text-3xl font-bold mt-1">Tucamax Pro</div>
        <div className="text-sm mt-1 opacity-90">10.000 créditos / mês · Suporte prioritário</div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-4xl font-bold">R$ 990</span>
          <span className="opacity-80">/mês</span>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { l: "Créditos usados", v: "6.420" },
          { l: "Próxima cobrança", v: "01/06/2026" },
          { l: "Método", v: "•••• 4842" },
        ].map((c) => (
          <div key={c.l} className="rounded-xl border border-border p-4">
            <div className="text-xs text-muted-foreground">{c.l}</div>
            <div className="font-semibold mt-1">{c.v}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">Fazer upgrade</button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm">Ver faturas</button>
      </div>
    </div>
  );
}

function NotifTab() {
  const opts = ["Novos leads atribuídos", "Resumo semanal", "Atualizações de produto", "Alertas de crédito baixo"];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Notificações</h2>
      {opts.map((o, i) => (
        <label key={o} className="flex items-center justify-between rounded-xl border border-border p-4">
          <div>
            <div className="text-sm font-medium">{o}</div>
            <div className="text-xs text-muted-foreground">Por e-mail e dentro do app</div>
          </div>
          <input type="checkbox" defaultChecked={i < 3} className="rounded border-border accent-primary scale-125" />
        </label>
      ))}
    </div>
  );
}

function EquipeTab() {
  const team = [
    { n: "Rafael Prado", e: "rafael@tucamax.com", r: "Admin" },
    { n: "Marina Souza", e: "marina@tucamax.com", r: "Editor" },
    { n: "Caio Almeida", e: "caio@tucamax.com", r: "Visualizador" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Equipe</h2>
        <button className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">+ Convidar membro</button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        {team.map((m, i) => (
          <div key={m.e} className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-xs font-bold text-primary-foreground">
              {m.n.split(" ").map((x) => x[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{m.n}</div>
              <div className="text-xs text-muted-foreground truncate">{m.e}</div>
            </div>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs">{m.r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegracoesTab() {
  const integ = [
    { n: "HubSpot", desc: "Sincronize leads automaticamente", on: true },
    { n: "Salesforce", desc: "Push de leads para oportunidades", on: false },
    { n: "Pipedrive", desc: "Crie contatos no seu pipeline", on: true },
    { n: "Slack", desc: "Notificações em tempo real", on: false },
    { n: "Zapier", desc: "Conecte com 6.000+ apps", on: false },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Integrações</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {integ.map((i) => (
          <div key={i.n} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{i.n}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{i.desc}</div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider ${i.on ? "text-accent" : "text-muted-foreground"}`}>
                {i.on ? "Conectado" : "Disponível"}
              </span>
            </div>
            <button className={`mt-4 w-full rounded-lg py-1.5 text-xs font-medium ${i.on ? "border border-border hover:bg-secondary" : "gradient-brand text-primary-foreground"}`}>
              {i.on ? "Gerenciar" : "Conectar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
