import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, DollarSign, Users, Bookmark, Download, Sparkles, ExternalLink } from "lucide-react";
import { empresas } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/empresa/$id")({
  loader: ({ params }) => {
    const e = empresas.find((x) => x.id === params.id);
    if (!e) throw notFound();
    return e;
  },
  component: EmpresaPage,
  notFoundComponent: () => <div className="p-8 text-center text-muted-foreground">Empresa não encontrada</div>,
  errorComponent: ({ error }) => <div className="p-8 text-center text-destructive">{error.message}</div>,
});

function EmpresaPage() {
  const e = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <Link to="/pesquisa" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar para pesquisa
      </Link>

      {/* Header */}
      <div className="rounded-2xl glass p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between relative">
          <div className="flex gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-2xl font-bold text-primary-foreground shadow-xl shadow-primary/30 flex-shrink-0">
              {e.nomeFantasia.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${e.situacao === "Ativa" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${e.situacao === "Ativa" ? "bg-accent" : "bg-destructive"}`} />
                  {e.situacao}
                </span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs">{e.porte}</span>
              </div>
              <h1 className="font-display text-3xl font-bold mt-2">{e.nomeFantasia}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{e.razaoSocial}</p>
              <div className="mt-3 font-mono text-xs text-muted-foreground">CNPJ: {e.cnpj}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-medium hover:bg-secondary/70">
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Enriquecer dados
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg gradient-brand px-3 py-2 text-xs font-semibold text-primary-foreground">
              <Bookmark className="h-3.5 w-3.5" /> Salvar em projeto
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Informações cadastrais">
            <InfoGrid items={[
              { icon: Building2, label: "Segmento", v: e.segmento },
              { icon: Calendar, label: "Data de abertura", v: new Date(e.abertura).toLocaleDateString("pt-BR") },
              { icon: DollarSign, label: "Capital social", v: e.capitalSocial.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) },
              { icon: Users, label: "Porte", v: e.porte },
              { icon: Building2, label: "CNAE principal", v: e.cnae },
              { icon: MapPin, label: "Endereço", v: e.endereco ?? "—" },
            ]} />
          </Section>

          <Section title="Sócios e administradores">
            <div className="space-y-2">
              {e.socios?.map((s, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/40 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                    {s.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{s}</div>
                    <div className="text-xs text-muted-foreground">Administrador</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Contato">
            <div className="space-y-3">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><span className="text-sm">{e.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><span className="text-sm">{e.telefone}</span></div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /><span className="text-sm">{e.cidade}/{e.estado}</span></div>
            </div>
          </Section>

          <Section title="Atividade">
            <div className="space-y-3 text-sm">
              <Row k="Última visita" v="há 2 dias" />
              <Row k="Salvo em" v="Prospecção SaaS B2B" />
              <Row k="Score IA" v={<span className="text-accent font-semibold">87/100</span>} />
            </div>
          </Section>

          <a className="flex items-center justify-between rounded-2xl glass p-4 hover:border-primary/40 transition cursor-pointer">
            <div>
              <div className="text-sm font-medium">Consultar na Receita</div>
              <div className="text-xs text-muted-foreground">Comprovante atualizado</div>
            </div>
            <ExternalLink className="h-4 w-4 text-primary" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl glass p-6">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: { icon: any; label: string; v: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, v }) => (
        <div key={label} className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-medium truncate">{v}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs">{k}</span>
      <span className="text-sm">{v}</span>
    </div>
  );
}
