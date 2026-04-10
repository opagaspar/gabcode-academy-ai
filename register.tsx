import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Zap, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Criar Conta — GabCode Academy AI" }],
  }),
  component: RegisterPage,
});

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-500", "bg-yellow-500", "bg-neon-green"];
  const labels = ["Fraca", "Média", "Forte"];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-secondary"}`}
          />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-[10px] flex items-center gap-1 transition-colors ${c.ok ? "text-neon-green" : "text-muted-foreground"}`}
          >
            <CheckCircle2 className={`w-3 h-3 ${c.ok ? "opacity-100" : "opacity-30"}`} />
            {c.label}
          </span>
        ))}
      </div>
      {password.length > 0 && (
        <p className={`text-xs font-medium ${colors[score - 1]?.replace("bg-", "text-") || "text-red-500"}`}>
          Senha {labels[score - 1] || "Fraca"}
        </p>
      )}
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setError("");
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate({ to: "/dashboard" });
    } else {
      setError(result.error || "Erro ao criar conta.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-neon-purple/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-neon-cyan/8 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Code2 className="w-7 h-7 text-neon-cyan" />
            <span className="text-xl font-bold gradient-text">GabCode Academy</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-1">Crie sua conta grátis</h1>
          <p className="text-sm text-muted-foreground">Comece a aprender programação com IA hoje mesmo</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Seu nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João Silva"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha segura"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirmar senha</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a senha"
                className={`w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 transition-all ${
                  confirm && confirm !== password
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                    : "border-border focus:border-neon-cyan/50 focus:ring-neon-cyan/20"
                }`}
                autoComplete="new-password"
              />
              {confirm && confirm !== password && (
                <p className="text-xs text-red-400">As senhas não coincidem</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="neon"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Criando conta...</>
              ) : (
                <><Zap className="w-4 h-4" /> Criar conta grátis</>
              )}
            </Button>
          </form>

          <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
            Ao criar sua conta, você concorda com os{" "}
            <span className="text-neon-cyan/70">Termos de Uso</span> e{" "}
            <span className="text-neon-cyan/70">Política de Privacidade</span>.
          </p>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
