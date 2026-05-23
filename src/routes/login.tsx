import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bird, Mail, Lock, ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useState } from "react";
import mascot from "@/assets/tucamax-mascot.png";


export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("rafael@tucamax.com");
  const [senha, setSenha] = useState("••••••••");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand */}
      <div className="relative hidden overflow-hidden border-r border-border lg:flex flex-col justify-between p-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 h-[60%] w-[80%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[50%] w-[60%] rounded-full bg-accent/15 blur-[120px]" />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl" />
            <img
              src={mascot}
              alt="Mascote Tucamax"
              className="relative h-16 w-16 object-contain drop-shadow-[0_8px_24px_rgba(245,140,50,0.55)]"
            />
          </div>
          <div>
            <div className="font-display text-2xl font-bold leading-tight">Tucamax</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">B2B Intelligence</div>
          </div>
        </div>


        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-accent mb-6">
            <Sparkles className="h-3 w-3" /> Nova safra de dados — Maio 2026
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05]">
            Velocidade que <span className="text-gradient-brand">voa alto</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Inteligência comercial B2B com cobertura de todas as empresas
            brasileiras. Encontre, filtre e enriqueça leads em segundos.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: Zap, label: "Busca em 0.2s", v: "60M+ CNPJs" },
              { icon: ShieldCheck, label: "LGPD Compliant", v: "Dados oficiais" },
              { icon: Sparkles, label: "Enriquecimento", v: "AI-powered" },
            ].map(({ icon: Icon, label, v }) => (
              <div key={label} className="glass rounded-xl p-4">
                <Icon className="h-4 w-4 text-primary mb-2" />
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          © 2026 Tucamax · Todos os direitos reservados
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand">
              <Bird className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold">Tucamax</span>
          </div>

          <h2 className="font-display text-3xl font-bold">Bem-vindo de volta</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse sua conta para continuar a prospecção.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-input/60 border border-border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Senha</label>
                <a className="text-xs text-primary hover:underline">Esqueci minha senha</a>
              </div>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-lg bg-input/60 border border-border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" defaultChecked className="rounded border-border accent-primary" />
              Manter-me conectado
            </label>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-lg gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              Entrar
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">ou</span>
              </div>
            </div>

            <button type="button" className="w-full rounded-lg border border-border bg-secondary/40 py-2.5 text-sm font-medium hover:bg-secondary transition">
              Continuar com Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Solicitar demonstração
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
