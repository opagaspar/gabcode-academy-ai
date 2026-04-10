import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Code2, Sparkles, Zap, Brain, LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/auth";

const techStack = [
  "JavaScript", "TypeScript", "React", "Python", "Node.js", "HTML/CSS",
  "SQL", "Git", "Next.js", "Tailwind"
];

export function HeroSection() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Top nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-neon-cyan" />
          <span className="font-bold gradient-text">GabCode Academy</span>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="neon" size="sm">
                <Zap className="w-4 h-4" />
                Ir ao Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="neon-outline" size="sm">
                  Criar conta grátis
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/10 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-neon-purple/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8"
        >
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          <span>Plataforma de aprendizado com IA</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="gradient-text">GabCode</span>
          <br />
          <span className="text-foreground">Academy</span>
          <span className="gradient-text"> AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Aprenda programação do zero ao avançado com uma
          <span className="text-neon-cyan font-medium"> IA professora </span>
          que explica tudo em português, no seu ritmo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="neon" size="xl">
                  <Zap className="w-5 h-5" />
                  Continuar Aprendendo
                </Button>
              </Link>
              <Link to="/study">
                <Button variant="neon-outline" size="xl">
                  <Code2 className="w-5 h-5" />
                  Abrir Editor
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button variant="neon" size="xl">
                  <Zap className="w-5 h-5" />
                  Começar Grátis
                </Button>
              </Link>
              <Link to="/study">
                <Button variant="neon-outline" size="xl">
                  <Code2 className="w-5 h-5" />
                  Ver o Editor
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16"
        >
          {[
            { icon: Brain, title: "IA Professora", desc: "Explicações detalhadas em PT-BR" },
            { icon: Code2, title: "Editor Integrado", desc: "Code, execute e aprenda na mesma tela" },
            { icon: Zap, title: "Gamificação", desc: "XP, streaks e conquistas" },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-5 text-left hover:border-neon-cyan/30 transition-all duration-300 group">
              <f.icon className="w-8 h-8 text-neon-cyan mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {techStack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.05 }}
              className="px-3 py-1 text-xs font-mono rounded-full border border-border text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
