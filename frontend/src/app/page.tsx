"use client";

import { useState, useRef, useEffect } from "react";
import { PromptBox } from "@/components/ui/prompt-box";
import { ShaderAnimation } from "@/components/ui/shader-animation";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.trim(),
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Three.js Shader Animation Background */}
      <ShaderAnimation />

      {/* Main Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-light text-center bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Gemma AI
            </h1>
            <p className="text-xs text-center text-cyan-200/80 mt-1">
              IA conversationnelle
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4 max-h-[calc(100vh-200px)]">
          <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto shadow-2xl">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg border border-white/20">
                    <span className="text-lg">🤖</span>
                  </div>
                  <p className="text-cyan-200 text-sm">Prêt à discuter</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/20"
                        : "bg-black/40 border border-white/20 text-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 opacity-70 ${
                          message.role === "user"
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-lg mr-8">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-xs text-gray-300">
                          Gemma réfléchit...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-4 pb-4">
            <PromptBox
              onSendMessage={sendMessage}
              disabled={isLoading}
              className="max-w-none bg-black/50 backdrop-blur-md border-white/30 hover:bg-black/70 transition-all shadow-xl"
              placeholder="Posez votre question à Gemma..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
