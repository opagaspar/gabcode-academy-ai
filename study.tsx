import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Sparkles, BookOpen, RefreshCw, Save, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { useAuthStore } from "@/lib/auth";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "Editor de Código — GabCode Academy AI" },
      { name: "description", content: "Aprenda programação com editor Monaco e IA professora." },
    ],
  }),
  component: StudyPage,
});

const defaultCode = `// 🚀 Bem-vindo ao GabCode Academy!
// Escreva seu código aqui e execute.

function saudacao(nome) {
  return \`Olá, \${nome}! Bem-vindo ao mundo da programação! 🎉\`;
}

console.log(saudacao("Dev"));

// Tente modificar o código e clicar em "Executar"!
`;

function StudyPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [activeTab, setActiveTab] = useState<"output" | "ai">("output");

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const runCode = () => {
    try {
      const logs: string[] = [];
      const mockConsole = { log: (...args: unknown[]) => logs.push(args.map(String).join(" ")) };
      const fn = new Function("console", code);
      fn(mockConsole);
      setOutput(logs.join("\n") || "✅ Código executado sem erros.");
      setActiveTab("output");
    } catch (e) {
      setOutput(`❌ Erro: ${e instanceof Error ? e.message : String(e)}`);
      setActiveTab("output");
    }
  };

  const askAI = (prompt: string) => {
    setAiResponse(`🤖 IA Professora:\n\n${prompt}\n\n(Conecte a IA via Lovable Cloud para respostas reais!)\n\nDica: A IA explicará conceitos em português, com analogias simples e exemplos práticos.`);
    setActiveTab("ai");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-sm font-bold gradient-text">GabCode Editor</h1>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-neon-cyan/10 text-neon-cyan font-mono">JavaScript</span>
            {user && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Olá, {user.name.split(" ")[0]}!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" onClick={() => askAI("Explique este código linha por linha")}>
              <BookOpen className="w-3 h-3" />
              Explicar
            </Button>
            <Button variant="glass" size="sm" onClick={() => askAI("Corrija e melhore este código")}>
              <RefreshCw className="w-3 h-3" />
              Corrigir
            </Button>
            <Button variant="glass" size="sm" onClick={() => askAI("Gere um desafio relacionado a este código")}>
              <Puzzle className="w-3 h-3" />
              Desafio
            </Button>
            <Button variant="neon-outline" size="sm">
              <Save className="w-3 h-3" />
              Salvar
            </Button>
            <Button variant="neon" size="sm" onClick={runCode}>
              <Play className="w-3 h-3" />
              Executar
            </Button>
          </div>
        </div>
      </header>

      {/* Editor + Output */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Editor */}
        <div className="flex-1 min-h-[400px]">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              bracketPairColorization: { enabled: true },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>

        {/* Output / AI panel */}
        <div className="lg:w-[400px] border-t lg:border-t-0 lg:border-l border-border flex flex-col bg-surface">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("output")}
              className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "output"
                  ? "text-neon-cyan border-b-2 border-neon-cyan"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Console
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                activeTab === "ai"
                  ? "text-neon-purple border-b-2 border-neon-purple"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              IA Professora
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-auto">
            {activeTab === "output" ? (
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                {output || <span className="text-muted-foreground">Clique em "Executar" para ver o resultado aqui...</span>}
              </pre>
            ) : (
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {aiResponse || (
                  <div className="text-center text-muted-foreground py-8">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 text-neon-purple/50" />
                    <p>Use os botões acima para interagir com a IA Professora</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
