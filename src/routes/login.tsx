import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, ArrowRight, Sparkles, Zap, ShieldCheck, User, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
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
          email, password: senha,
          options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: nome, company_name: empresa } },
        });
        if (error) throw error;
        toast.success("Conta criada. Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/dashboard` });
    if (result.error) { toast.error("Erro com Google. Tente novamente."); setBusy(false); }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border lg:flex flex-col justify-between p-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 h-[60%] w-[80%] rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-[60%] w-[70%] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.45 0.16 250 / 0.35), transparent 60%)" }} />
          <div className="absolute bottom-[10%] left-[15%] h-[420px] w-[420px] rounded-full opacity-90"
            style={{ background: "radial-gradient(circle at 35% 35%, oklch(0.55 0.18 245) 0%, oklch(0.30 0.14 255) 45%, oklch(0.15 0.08 265) 75%)", boxShadow: "0 0 120px oklch(0.50 0.16 250 / 0.4), inset -40px -60px 120px oklch(0.10 0.05 265 / 0.8)" }} />
          <div className="absolute bottom-[10%] left-[15%] h-[420px] w-[420px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle at 35% 35%, transparent 60%, oklch(0.78 0.14 75 / 0.3) 75%, transparent 80%)" }} />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/30">
            <Globe2 className="h-5 w-5 text-primary" strokeWidth={2.25} />
            <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-lg -z-10" />
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-none tracking-tight">VMAX Atlas</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Inteligência Comercial B2B</div>
          </div>
        </div>

        <div className="max-w-lg relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary mb-6">
            <Sparkles className="h-3 w-3" /> Plataforma VMAX Enterprise — 2026
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05]">
            Visão comercial <span className="text-gradient-brand">nacional</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Inteligência comercial B2B com cobertura de todas as empresas brasileiras. Mapeie, qualifique e enriqueça contas em segundos.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: Zap, label: "Resposta em 0.2s", v: "60M+ CNPJs" },
              { icon: ShieldCheck, label: "LGPD Compliant", v: "Dados oficiais" },
              { icon: Sparkles, label: "Enriquecimento", v: "AI-powered" },
            ].map(({ icon: Icon, label, v }) => (
              <div key={label} className="rounded-lg border border-glass-border bg-card/40 backdrop-blur-xl p-3.5">
                <Icon className="h-3.5 w-3.5 text-primary mb-2" />
                <div className="text-[12px] font-semibold">{label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground">© 2026 VMAX Telecom · VMAX Atlas Enterprise</div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30"><Globe2 className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-display text-base font-bold leading-none">VMAX Atlas</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Inteligência Comercial B2B</div>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold">{mode === "signin" ? "Acesse sua conta" : "Crie sua conta"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Entre para continuar sua operação comercial." : "Comece com 10.000 créditos cortesia."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <>
                <Field icon={User} label="Nome completo" type="text" value={nome} onChange={setNome} />
                <Field icon={User} label="Empresa" type="text" value={empresa} onChange={setEmpresa} />
              </>
            )}
            <Field icon={Mail} label="E-mail corporativo" type="email" value={email} onChange={setEmail} required />
            <Field icon={Lock} label="Senha" type="password" value={senha} onChange={setSenha} required />

            <button type="submit" disabled={busy} className="group flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/15 py-2.5 text-sm font-semibold text-primary hover:bg-primary/25 transition disabled:opacity-60">
              {busy ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-background px-3 text-muted-foreground">ou</span>
              </div>
            </div>

            <button type="button" onClick={google} disabled={busy} className="w-full rounded-md border border-border bg-secondary/40 py-2.5 text-sm font-medium hover:bg-secondary/60 transition disabled:opacity-60">
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
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1.5 relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full rounded-md bg-input/60 border border-border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition" />
      </div>
    </div>
  );
}
