import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, ArrowRight, Sparkles, Zap, ShieldCheck, User, Eye, EyeOff, ShieldCheck as ShieldIcon, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import heroBrazil from "@/assets/vmax-hero-brazil.jpg";
import vmaxLogo from "@/assets/vmax-atlas-logo.png";

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
  const [showPwd, setShowPwd] = useState(false);
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
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.10_0.06_265)]">
      {/* Cinematic hero background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBrazil}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-95"
        />
        {/* Atmospheric overlays */}
        <div className="absolute inset-0" style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 45%, oklch(0.45 0.18 250 / 0.35), transparent 65%), radial-gradient(ellipse 70% 70% at 80% 60%, oklch(0.78 0.14 75 / 0.10), transparent 70%)",
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.06_265)]/85 via-[oklch(0.10_0.06_265)]/40 to-[oklch(0.10_0.06_265)]/95" />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.06_265)]/60 via-transparent to-[oklch(0.08_0.05_265)]" />
        {/* Subtle grain via noise gradient */}
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0 / 0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }} />
      </div>

      <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
        {/* LEFT — Hero narrative */}
        <div className="relative flex flex-col justify-between p-8 lg:p-14 xl:p-20">
          {/* Brand */}
          <div className="flex items-center">
            <img src={vmaxLogo} alt="VMAX Atlas" className="h-16 w-auto" />
          </div>

          {/* Hero copy */}
          <div className="max-w-xl">
            <h1 className="font-display text-5xl xl:text-6xl font-bold leading-[1.02] tracking-tight">
              Inteligência que{" "}
              <span className="text-gradient-brand">conecta.</span>
              <br />
              Resultados que transformam.
            </h1>
            <p className="mt-6 text-base xl:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Plataforma B2B de inteligência comercial com cobertura completa das empresas brasileiras. Encontre, filtre e enriqueça leads em segundos com dados confiáveis e atualizados.
            </p>

            {/* Pillars */}
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
              {[
                { icon: Zap, label: "Busca em 0.2s", v: "60M+ CNPJs" },
                { icon: ShieldCheck, label: "LGPD Compliant", v: "Dados oficiais" },
                { icon: Target, label: "Enriquecimento", v: "AI-powered" },
              ].map(({ icon: Icon, label, v }) => (
                <div
                  key={label}
                  className="group relative rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-4 transition hover:border-primary/30 hover:bg-white/[0.05]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30 mb-3">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-[13px] font-semibold leading-tight">{label}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <ShieldIcon className="h-3.5 w-3.5 text-primary/70" />
            Segurança e conformidade em primeiro lugar.
            <span className="mx-2 opacity-40">·</span>
            © 2026 VMAX Telecom. Todos os direitos reservados.
          </div>
        </div>

        {/* RIGHT — Glass card */}
        <div className="flex items-center justify-center p-6 lg:p-10 xl:p-14">
          <div className="w-full max-w-md">
            <div className="relative rounded-2xl border border-white/[0.08] bg-[oklch(0.16_0.08_265/0.55)] backdrop-blur-2xl p-8 xl:p-10 shadow-[0_30px_80px_-20px_oklch(0_0_0/0.6),0_0_0_1px_oklch(1_0_0/0.04)_inset]">
              {/* Glow border accent */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl" style={{
                background: "linear-gradient(135deg, oklch(0.78 0.14 75 / 0.35), transparent 30%, transparent 70%, oklch(0.55 0.18 250 / 0.3))",
                WebkitMask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: "1px",
              }} />

              <div className="relative">
                <h2 className="font-display text-3xl xl:text-4xl font-bold leading-tight">
                  <span className="text-gradient-brand">{mode === "signin" ? "Bem-vindo" : "Crie sua conta"}</span>
                  {mode === "signin" && <span className="text-foreground"> de volta</span>}
                </h2>
                <p className="mt-2.5 text-sm text-muted-foreground">
                  {mode === "signin" ? "Acesse sua conta para continuar a prospecção." : "Comece com 10.000 créditos cortesia."}
                </p>

                <form className="mt-7 space-y-5" onSubmit={submit}>
                  {mode === "signup" && (
                    <>
                      <Field icon={User} label="Nome completo" type="text" value={nome} onChange={setNome} placeholder="Seu nome" />
                      <Field icon={User} label="Empresa" type="text" value={empresa} onChange={setEmpresa} placeholder="Sua empresa" />
                    </>
                  )}
                  <Field icon={Mail} label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" required />

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Senha</label>
                    <div className="mt-2 relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPwd ? "text" : "password"}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full rounded-lg bg-[oklch(0.14_0.07_265/0.7)] border border-white/[0.08] pl-11 pr-11 py-3.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === "signin" && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-transparent accent-primary" />
                        Lembrar de mim
                      </label>
                      <button type="button" className="font-semibold text-primary hover:underline">
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-lg gradient-brand py-3.5 text-sm font-semibold text-[oklch(0.14_0.08_265)] shadow-[0_10px_40px_-10px_oklch(0.78_0.14_75/0.6)] hover:shadow-[0_15px_50px_-10px_oklch(0.78_0.14_75/0.8)] transition disabled:opacity-60"
                  >
                    {busy ? "Aguarde..." : mode === "signin" ? "Entrar na plataforma" : "Criar conta"}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.08]" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.25em]">
                      <span className="bg-[oklch(0.16_0.08_265)] px-3 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={google}
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/[0.1] bg-white/[0.03] py-3.5 text-sm font-medium hover:bg-white/[0.06] hover:border-white/[0.15] transition disabled:opacity-60"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continuar com Google
                  </button>
                </form>

                <p className="mt-7 text-center text-sm text-muted-foreground">
                  {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
                  <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                    {mode === "signin" ? "Fale com nosso time" : "Entrar"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type, value, onChange, required, placeholder }: { icon: React.ComponentType<{ className?: string }>; label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
      <div className="mt-2 relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-lg bg-[oklch(0.14_0.07_265/0.7)] border border-white/[0.08] pl-11 pr-3.5 py-3.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
        />
      </div>
    </div>
  );
}
