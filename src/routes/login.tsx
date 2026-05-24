import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, ArrowRight, Sparkles, Zap, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import mascot from "@/assets/tucamax-mascot.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: nome, company_name: empresa },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/dashboard` });
    if (result.error) {
      toast.error("Erro com Google. Tente novamente.");
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border lg:flex flex-col justify-between p-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 h-[60%] w-[80%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[50%] w-[60%] rounded-full bg-accent/15 blur-[120px]" />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl" />
            <img src={mascot} alt="Mascote Tucamax" className="relative h-16 w-16 object-contain drop-shadow-[0_8px_24px_rgba(245,140,50,0.55)]" />
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
            Inteligência comercial B2B com cobertura de todas as empresas brasileiras. Encontre, filtre e enriqueça leads em segundos.
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

        <div className="text-xs text-muted-foreground">© 2026 Tucamax · Todos os direitos reservados</div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={mascot} alt="Mascote Tucamax" className="h-12 w-12 object-contain drop-shadow-[0_4px_12px_rgba(245,140,50,0.5)]" />
            <span className="font-display text-xl font-bold">Tucamax</span>
          </div>

          <h2 className="font-display text-3xl font-bold">{mode === "signin" ? "Bem-vindo de volta" : "Crie sua conta"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Acesse sua conta para continuar a prospecção." : "Comece com 10.000 créditos gratuitos."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <>
                <Field icon={User} label="Nome completo" type="text" value={nome} onChange={setNome} />
                <Field icon={User} label="Empresa" type="text" value={empresa} onChange={setEmpresa} />
              </>
            )}
            <Field icon={Mail} label="E-mail" type="email" value={email} onChange={setEmail} required />
            <Field icon={Lock} label="Senha" type="password" value={senha} onChange={setSenha} required />

            <button type="submit" disabled={busy} className="group flex w-full items-center justify-center gap-2 rounded-lg gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-60">
              {busy ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">ou</span>
              </div>
            </div>

            <button type="button" onClick={google} disabled={busy} className="w-full rounded-lg border border-border bg-secondary/40 py-2.5 text-sm font-medium hover:bg-secondary transition disabled:opacity-60">
              Continuar com Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-primary hover:underline">
              {mode === "signin" ? "Criar agora" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type, value, onChange, required }: { icon: React.ComponentType<{ className?: string }>; label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1.5 relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full rounded-lg bg-input/60 border border-border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition" />
      </div>
    </div>
  );
}
