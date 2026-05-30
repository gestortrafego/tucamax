import { createFileRoute } from "@tanstack/react-router";
import { User, Building2, CreditCard, Coins, Users, Plug, ShieldCheck, Key } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/configuracoes")({
  component: ConfigPage,
});

const tabs = [
  { id: "conta", label: "Conta", icon: User },
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "plano", label: "Plano", icon: CreditCard },
  { id: "creditos", label: "Créditos", icon: Coins },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "integracoes", label: "Integrações", icon: Plug },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck },
];

function ConfigPage() {
  const [tab, setTab] = useState("conta");

  return (
    <div className="space-y-7 max-w-[1400px]">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Configurações</div>
        <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Administração da conta</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Gerencie sua conta, empresa, plano, créditos, usuários e integrações em um só lugar.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-0.5 rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-2 h-fit">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                tab === t.id ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </aside>

        <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-8">
          {tab === "conta" && <ContaTab />}
          {tab === "empresa" && <EmpresaTab />}
          {tab === "plano" && <PlanoTab />}
          {tab === "creditos" && <CreditosTab />}
          {tab === "usuarios" && <UsuariosTab />}
          {tab === "integracoes" && <IntegracoesTab />}
          {tab === "seguranca" && <SegurancaTab />}
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} defaultValue={defaultValue} className="mt-1.5 w-full rounded-md bg-input/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end gap-2 pt-5 border-t border-border/60">
      <button className="rounded-md px-4 py-2 text-sm hover:bg-secondary/60">Cancelar</button>
      <button className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15">Salvar alterações</button>
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold">{children}</h2>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function ContaTab() {
  return (
    <div className="space-y-6">
      <SectionTitle sub="Informações do usuário responsável pela conta.">Conta</SectionTitle>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-primary/30 text-lg font-bold text-primary">RP</div>
        <div>
          <button className="rounded-md border border-border bg-background/40 px-3 py-1.5 text-xs font-medium hover:bg-secondary/60">Alterar foto</button>
          <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG ou SVG. Máx 2MB.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" defaultValue="Rafael" />
        <Field label="Sobrenome" defaultValue="Prado" />
        <Field label="E-mail corporativo" defaultValue="rafael@vmax.com.br" type="email" />
        <Field label="Cargo" defaultValue="Head of Sales" />
      </div>
      <SaveBar />
    </div>
  );
}

function EmpresaTab() {
  return (
    <div className="space-y-6">
      <SectionTitle sub="Dados cadastrais da sua empresa.">Empresa</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Razão social" defaultValue="VMAX Telecom LTDA" />
        <Field label="Nome fantasia" defaultValue="VMAX" />
        <Field label="CNPJ" defaultValue="12.345.678/0001-90" />
        <Field label="Segmento" defaultValue="Telecom B2B" />
      </div>
      <SaveBar />
    </div>
  );
}

function PlanoTab() {
  return (
    <div className="space-y-6">
      <SectionTitle sub="Visão do plano contratado e ciclo de cobrança.">Plano e cobrança</SectionTitle>
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/[0.02] p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">Plano atual</div>
            <div className="font-display text-2xl font-bold mt-1">VMAX Atlas Enterprise</div>
            <div className="text-sm mt-1 text-muted-foreground">10.000 créditos / mês · Suporte prioritário · API ilimitada</div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold tabular-nums">R$ 990</div>
            <div className="text-xs text-muted-foreground">/ mês</div>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { l: "Créditos usados", v: "6.420" },
          { l: "Próxima cobrança", v: "01/06/2026" },
          { l: "Método de pagamento", v: "•••• 4842" },
        ].map((c) => (
          <div key={c.l} className="rounded-lg border border-border/60 bg-background/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.l}</div>
            <div className="font-display text-base font-semibold mt-1">{c.v}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15">Fazer upgrade</button>
        <button className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary/60">Ver faturas</button>
      </div>
    </div>
  );
}

function CreditosTab() {
  return (
    <div className="space-y-6">
      <SectionTitle sub="Consumo, recargas e histórico de créditos.">Créditos</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { l: "Disponíveis", v: "3.580", c: "text-primary" },
          { l: "Utilizados no ciclo", v: "6.420", c: "" },
          { l: "Total do plano", v: "10.000", c: "" },
        ].map((c) => (
          <div key={c.l} className="rounded-lg border border-border/60 bg-background/30 p-5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.l}</div>
            <div className={`font-display text-2xl font-bold mt-1 tabular-nums ${c.c}`}>{c.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/60 bg-background/30 p-5">
        <h3 className="font-semibold text-sm mb-3">Pacotes adicionais</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {[{q:"5.000",p:"R$ 390"},{q:"10.000",p:"R$ 690"},{q:"25.000",p:"R$ 1.490"}].map((p) => (
            <button key={p.q} className="rounded-md border border-border bg-card/60 p-4 text-left hover:border-primary/40 transition">
              <div className="font-display text-lg font-bold">{p.q}</div>
              <div className="text-xs text-muted-foreground">créditos</div>
              <div className="mt-2 text-sm font-semibold text-primary">{p.p}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsuariosTab() {
  const team = [
    { n: "Rafael Prado", e: "rafael@vmax.com.br", r: "Admin" },
    { n: "Marina Souza", e: "marina@vmax.com.br", r: "Editor" },
    { n: "Caio Almeida", e: "caio@vmax.com.br", r: "Visualizador" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionTitle sub="Gerencie membros, papéis e permissões de acesso.">Usuários</SectionTitle>
        <button className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15">+ Convidar membro</button>
      </div>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        {team.map((m, i) => (
          <div key={m.e} className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-border/60" : ""} bg-background/30`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 text-xs font-bold">
              {m.n.split(" ").map((x) => x[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{m.n}</div>
              <div className="text-[11px] text-muted-foreground truncate">{m.e}</div>
            </div>
            <span className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px]">{m.r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegracoesTab() {
  const integ = [
    { n: "HubSpot", desc: "Sincronize leads com seu CRM", on: true },
    { n: "Salesforce", desc: "Push de empresas para oportunidades", on: false },
    { n: "Pipedrive", desc: "Contatos automatizados no pipeline", on: true },
    { n: "Slack", desc: "Notificações em tempo real", on: false },
    { n: "Zapier", desc: "Conecte com 6.000+ aplicativos", on: false },
    { n: "API REST", desc: "Integração customizada via webhooks", on: true },
  ];
  return (
    <div className="space-y-5">
      <SectionTitle sub="Conecte VMAX Atlas ao seu stack comercial.">Integrações</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {integ.map((i) => (
          <div key={i.n} className="rounded-lg border border-border/60 bg-background/30 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-sm">{i.n}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{i.desc}</div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${i.on ? "text-primary" : "text-muted-foreground"}`}>
                {i.on ? "Conectado" : "Disponível"}
              </span>
            </div>
            <button className={`mt-4 w-full rounded-md py-1.5 text-xs font-semibold transition ${i.on ? "border border-border hover:bg-secondary/60" : "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"}`}>
              {i.on ? "Gerenciar" : "Conectar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegurancaTab() {
  return (
    <div className="space-y-6">
      <SectionTitle sub="Autenticação, sessões e chaves de API.">Segurança</SectionTitle>
      <div className="space-y-3">
        {[
          { t: "Autenticação em dois fatores", d: "Adicione uma camada extra à sua conta", v: "Ativar", on: false },
          { t: "Sessões ativas", d: "3 dispositivos conectados atualmente", v: "Gerenciar", on: true },
          { t: "Logs de auditoria", d: "Histórico completo de ações da conta", v: "Visualizar", on: true },
        ].map((s) => (
          <div key={s.t} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/30 p-4">
            <div>
              <div className="text-sm font-semibold">{s.t}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.d}</div>
            </div>
            <button className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary/60">{s.v}</button>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/60 bg-background/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold inline-flex items-center gap-2"><Key className="h-3.5 w-3.5 text-primary" /> Chave de API (produção)</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Use para integrar VMAX Atlas com sistemas internos.</div>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Ativa</span>
        </div>
        <code className="block rounded-md bg-background/60 p-2.5 font-mono text-xs text-muted-foreground border border-border/60">vmax_live_••••••••••••••••a9f2</code>
        <div className="mt-3 flex gap-2">
          <button className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary/60">Copiar</button>
          <button className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary/60">Regenerar</button>
        </div>
      </div>
    </div>
  );
}
