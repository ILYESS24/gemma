"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ShaderAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: "gradient" | "noise" | "wave" | "matrix";
  speed?: "slow" | "normal" | "fast";
  intensity?: "subtle" | "medium" | "strong";
}

export const ShaderAnimation = React.forwardRef<HTMLDivElement, ShaderAnimationProps>(
  ({ className, children, variant = "gradient", speed = "normal", intensity = "medium", ...props }, ref) => {
    const speedClasses = {
      slow: "duration-10000",
      normal: "duration-5000",
      fast: "duration-2000",
    };

    const intensityClasses = {
      subtle: "opacity-20",
      medium: "opacity-40",
      strong: "opacity-60",
    };

    const baseClasses = "absolute inset-0 pointer-events-none overflow-hidden";

    if (variant === "gradient") {
      return (
        <div ref={ref} className={cn("relative", className)} {...props}>
          <div
            className={cn(
              baseClasses,
              speedClasses[speed],
              intensityClasses[intensity],
              "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
              "animate-gradient-shift"
            )}
            style={{
              backgroundSize: "400% 400%",
              animation: `gradientShift ${speed === "slow" ? "10s" : speed === "fast" ? "2s" : "5s"} ease-in-out infinite`,
            }}
          />
          {children}
          <style jsx>{`
            @keyframes gradientShift {
              0%, 100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
          `}</style>
        </div>
      );
    }

    if (variant === "wave") {
      return (
        <div ref={ref} className={cn("relative", className)} {...props}>
          <div
            className={cn(
              baseClasses,
              speedClasses[speed],
              intensityClasses[intensity],
              "bg-gradient-to-r from-transparent via-white to-transparent",
              "animate-wave"
            )}
            style={{
              animation: `wave ${speed === "slow" ? "8s" : speed === "fast" ? "1.5s" : "3s"} ease-in-out infinite`,
            }}
          />
          {children}
          <style jsx>{`
            @keyframes wave {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>
      );
    }

    if (variant === "noise") {
      return (
        <div ref={ref} className={cn("relative", className)} {...props}>
          <div
            className={cn(
              baseClasses,
              speedClasses[speed],
              intensityClasses[intensity],
              "bg-noise animate-noise"
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              animation: `noise ${speed === "slow" ? "12s" : speed === "fast" ? "1s" : "4s"} linear infinite`,
            }}
          />
          {children}
          <style jsx>{`
            @keyframes noise {
              0%, 100% {
                background-position: 0 0;
              }
              50% {
                background-position: 100px 100px;
              }
            }
          `}</style>
        </div>
      );
    }

    if (variant === "matrix") {
      return (
        <div ref={ref} className={cn("relative", className)} {...props}>
          <div
            className={cn(
              baseClasses,
              speedClasses[speed],
              intensityClasses[intensity],
              "font-mono text-green-400 animate-matrix"
            )}
            style={{
              background: "transparent",
              overflow: "hidden",
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-xs opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <div key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                    {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {children}
          <style jsx>{`
            @keyframes matrix {
              0% {
                transform: translateY(100vh);
              }
              100% {
                transform: translateY(-100vh);
              }
            }
          `}</style>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </div>
    );
  }
);

ShaderAnimation.displayName = "ShaderAnimation";
