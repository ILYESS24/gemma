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
      <div className="absolute inset-0 z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-white/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-light text-center bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-lg">
              Gemma AI
            </h1>
            <p className="text-sm text-center text-cyan-200/80 mt-2 font-medium">
              Intelligence artificielle conversationnelle
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
          <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto shadow-2xl">
            {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl border border-white/20">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <p className="text-cyan-200 text-xl font-medium">Commencez une conversation avec Gemma</p>
                  <p className="text-gray-300 text-sm mt-3">Posez une question ou dites bonjour !</p>
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
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30"
                        : "bg-black/50 border border-white/30 text-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
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
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 shadow-lg mr-12">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-sm text-gray-300">
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
          <div className="flex-shrink-0">
            <PromptBox
              onSendMessage={sendMessage}
              disabled={isLoading}
              className="max-w-none bg-black/40 backdrop-blur-md border-white/30 hover:bg-black/60 transition-all shadow-2xl"
              placeholder="Posez votre question à Gemma..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
