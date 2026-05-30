import { createFileRoute } from "@tanstack/react-router";
import { UserSquare2, Mail, Linkedin, Building2, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/decisores")({
  component: DecisoresPage,
});

const decisoresMock = [
  { nome: "Ana Carolina Mendes", cargo: "CEO", empresa: "Aurora Tecnologia", cidade: "São Paulo/SP", email: "ana.mendes@aurora.com.br", linkedin: true, seniority: "C-Level" },
  { nome: "Rodrigo Tavares", cargo: "Diretor Comercial", empresa: "Bravo Sistemas", cidade: "Rio de Janeiro/RJ", email: "rodrigo@bravo.com.br", linkedin: true, seniority: "Diretor" },
  { nome: "Patricia Lima", cargo: "CFO", empresa: "Cedro Holding", cidade: "Belo Horizonte/MG", email: "patricia.lima@cedro.com.br", linkedin: true, seniority: "C-Level" },
  { nome: "Felipe Andrade", cargo: "Head of Sales", empresa: "Delta Logística", cidade: "Curitiba/PR", email: "felipe@delta.com.br", linkedin: false, seniority: "Head" },
  { nome: "Juliana Castro", cargo: "VP Marketing", empresa: "Eclipse Engenharia", cidade: "Porto Alegre/RS", email: "juliana.castro@eclipse.com.br", linkedin: true, seniority: "VP" },
];

function DecisoresPage() {
  const [q, setQ] = useState("");
  const filtered = decisoresMock.filter((d) => !q || `${d.nome} ${d.empresa} ${d.cargo}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-7 max-w-[1400px]">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Decisores</div>
        <h1 className="font-display text-[34px] font-bold mt-1.5 leading-tight">Mapeamento de decisores</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Identifique e contate executivos C-Level, diretores e heads das empresas em seus projetos.
        </p>
      </div>

      <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, cargo ou empresa..."
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none placeholder:text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <div key={d.email} className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-primary/30 text-sm font-bold text-primary">
                {d.nome.split(" ").map((x) => x[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{d.nome}</div>
                <div className="text-[11px] text-muted-foreground truncate">{d.cargo}</div>
              </div>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{d.seniority}</span>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-3.5 w-3.5" />{d.empresa}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /><span className="truncate">{d.email}</span></div>
              <div className="text-[10px] text-muted-foreground">{d.cidade}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-md border border-primary/40 bg-primary/10 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition">Contatar</button>
              {d.linkedin && <button className="rounded-md border border-border bg-background/40 px-3 py-1.5 hover:bg-secondary/60"><Linkedin className="h-3.5 w-3.5" /></button>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-glass-border bg-card/60 backdrop-blur-xl p-12 text-center">
          <UserSquare2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum decisor corresponde à busca.</p>
        </div>
      )}
    </div>
  );
}
