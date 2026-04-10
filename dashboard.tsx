import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame, Star, Code2, Target, BookOpen, LogOut, User } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PomodoroTimer } from "@/components/dashboard/PomodoroTimer";
import { MusicPlayer } from "@/components/dashboard/MusicPlayer";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — GabCode Academy AI" },
      { name: "description", content: "Seu painel de estudos com estatísticas, pomodoro e foco musical." },
    ],
  }),
  component: DashboardPage,
});

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <span className="text-lg font-bold gradient-text">GabCode Academy</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/study">
              <Button variant="neon" size="sm">
                <Code2 className="w-4 h-4" />
                Estudar Agora
              </Button>
            </Link>

            {/* User avatar + menu */}
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xs font-bold text-background">
                {getInitials(user.name)}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block max-w-[120px] truncate">
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-400 transition-colors ml-1"
                title="Sair"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-1">
            {getGreeting()}, {user.name.split(" ")[0]}! 🚀
          </h2>
          <p className="text-muted-foreground">Continue de onde parou. Sua meta diária está quase lá.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Clock} value="2.5h" label="Hoje" subtitle="↑ 30min" />
          <StatCard icon={Flame} value={String(user.streak || 0)} label="Streak" subtitle="dias" accentColor="text-neon-pink" />
          <StatCard icon={Star} value={user.xp > 0 ? user.xp.toLocaleString() : "0"} label="XP Total" accentColor="text-neon-green" />
          <StatCard icon={Target} value={`Nível ${user.level}`} label="Iniciante" accentColor="text-neon-purple" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-neon-cyan" />
                Últimos Módulos
              </h3>
              <div className="space-y-3">
                {[
                  { name: "JavaScript — Promises & Async/Await", progress: 75, lang: "JS" },
                  { name: "TypeScript — Generics Avançados", progress: 40, lang: "TS" },
                  { name: "React — Hooks Customizados", progress: 90, lang: "React" },
                  { name: "Python — Decorators", progress: 20, lang: "PY" },
                ].map((mod, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer group">
                    <span className="w-10 h-10 rounded-lg bg-neon-cyan/10 text-neon-cyan flex items-center justify-center text-xs font-bold font-mono">
                      {mod.lang}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-neon-cyan transition-colors">{mod.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500"
                            style={{ width: `${mod.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{mod.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weekly progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Progresso Semanal</h3>
              <div className="flex items-end gap-2 h-32">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day, i) => {
                  const heights = [60, 80, 45, 90, 70, 30, 0];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-neon-cyan/60 to-neon-purple/60 transition-all duration-500"
                        style={{ height: `${heights[i]}%`, minHeight: heights[i] > 0 ? 8 : 0 }}
                      />
                      <span className="text-[10px] text-muted-foreground">{day}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-neon-purple" />
                Meu Perfil
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xl font-bold text-background flex-shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-neon-cyan mt-1">
                    Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <PomodoroTimer />
            <MusicPlayer />
          </div>
        </div>
      </main>
    </div>
  );
}
