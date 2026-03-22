import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../backend";
import { useAddMessages, useGetMessages } from "../hooks/useQueries";
import { getAiResponse } from "../lib/aiResponses";

type ChatMessage = Message & { ts: number; key: string };

function formatTime(ms?: number): string {
  const d = ms ? new Date(ms) : new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatTab() {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: savedMessages, isLoading } = useGetMessages();
  const addMessages = useAddMessages();
  const [aiThinking, setAiThinking] = useState(false);

  const allMessages: ChatMessage[] = [
    ...(savedMessages ?? []).map((m, i) => ({
      ...m,
      ts: i,
      key: `saved-${i}`,
    })),
    ...localMessages,
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll when thinking ends
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiThinking]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || aiThinking) return;
    setInput("");

    const now = Date.now();
    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      ts: now,
      key: `local-${now}-user`,
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    setAiThinking(true);

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    const aiText = getAiResponse(text);
    const aiMsg: ChatMessage = {
      role: "assistant",
      content: aiText,
      ts: now + 1,
      key: `local-${now}-ai`,
    };
    setLocalMessages((prev) => [...prev, aiMsg]);
    setAiThinking(false);

    addMessages.mutate([
      { role: "user", content: text },
      { role: "assistant", content: aiText },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-3 rounded-t-2xl">
        <div className="w-9 h-9 rounded-full bg-sage-light flex items-center justify-center">
          <Bot className="w-5 h-5 text-sage" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">SereneMind AI</p>
          <p className="text-xs text-muted-foreground">
            Here to listen, always
          </p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="chat.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {allMessages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-sage" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft max-w-sm">
                  <p className="text-sm text-foreground">
                    Hi there 💚 I'm your SereneMind companion. This is a safe,
                    judgment-free space. How are you feeling today?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime()}
                  </p>
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {allMessages.map((msg, idx) => (
                <motion.div
                  key={msg.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  data-ocid={`chat.item.${idx + 1}`}
                >
                  {msg.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-sage" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-soft max-w-sm ${
                      msg.role === "user"
                        ? "bg-sage text-white rounded-tr-sm"
                        : "bg-card text-foreground rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {aiThinking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
                data-ocid="chat.loading_state"
              >
                <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-sage" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-sage"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card rounded-b-2xl">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            className="resize-none rounded-xl flex-1 min-h-[44px] max-h-[120px] text-sm"
            rows={1}
            data-ocid="chat.input"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || aiThinking}
            className="bg-sage hover:bg-sage-dark text-white rounded-xl flex-shrink-0"
            data-ocid="chat.submit_button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
