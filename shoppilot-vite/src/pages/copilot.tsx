import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Loader2, Lightbulb, TrendingDown, Package, BadgePercent, Bot, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { chatAI } from "@/api/ai";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = [
  { icon: Package, text: "Which products should I restock today?" },
  { icon: TrendingDown, text: "Why did sales drop this week?" },
  { icon: BadgePercent, text: "Suggest a promotion for slow-moving items." },
  { icon: Lightbulb, text: "What are my top-selling products this month?" },
];

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function CopilotPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);
  useEffect(() => { inputRef.current?.focus(); }, []);



  const send = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      text,
    };

    setMessages((m) => [...m, userMsg]);

    setInput("");

    setThinking(true);

    try {
      const res = await chatAI(text);

      const aiMsg = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        text: res.data.response,
      };

      setMessages((m) => [...m, aiMsg]);
    } catch (error) {
      toast.error("AI unavailable");
    } finally {
      setThinking(false);
    }
  };

  return (
    <AppShell title="AI Copilot" subtitle="Your on-demand business analyst">
      <div className="grid lg:grid-cols-[1fr_280px] gap-4 h-[calc(100vh-9rem)]">
        <div className="rounded-2xl border border-border bg-card shadow-soft flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {m.role === "assistant" && (
                  <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-white shadow">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-3xl px-6 py-5 shadow-lg transition-all duration-300 ${m.role === "user"
                    ? "bg-gradient-brand text-white rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                    }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="leading-7 mb-3">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 space-y-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 space-y-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li>{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      code({ children }) {
                        return (
                          <code className="rounded bg-muted px-1 py-0.5 text-pink-500">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>

                {m.role === "user" && (
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  {/* AI Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center shadow-md">
                    <Sparkles className="h-5 w-5 text-white animate-pulse" />
                  </div>

                  {/* Thinking Bubble */}
                  <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-brand" />
                      <span className="font-medium">
                        ShopPilot AI is thinking...
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Analyzing your request and preparing business insights.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border bg-background/70 backdrop-blur p-4 flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about your business…"
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand min-h-[52px] max-h-40"
            />
            <button
  type="submit"
  disabled={!input.trim() || thinking}
  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
>
  {thinking ? (
    <Loader2 className="h-5 w-5 animate-spin" />
  ) : (
    <Send className="h-5 w-5 ml-0.5" />
  )}
</button>
          </form>
        </div>

        <aside className="hidden lg:flex flex-col gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Examples</div>
            <div className="space-y-1.5">
              {SUGGESTIONS.map(({ text }) => (
                <button key={text} onClick={() => send(text)} className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-accent">
                  {text}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
