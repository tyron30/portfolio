"use client";

import { useActionState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { login, type LoginState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteBackground } from "@/components/public/site-background";
import { TiltLayer } from "@/components/public/tilt-layer";
import { ThemeToggle } from "@/components/public/theme-toggle";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      {/* same cinematic background as the public portfolio */}
      <SiteBackground />
      <ThemeToggle />

      <Link
        href="/"
        className="glass group fixed left-4 top-4 z-40 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition hover:text-primary sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to portfolio
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative w-full max-w-sm"
      >
        {/* glow behind the card */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-3xl" />

        <TiltLayer className="relative">
          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-2xl p-px shadow-2xl shadow-primary/20"
          >
            {/* animated glowing border */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div
                className="absolute -inset-[60%] animate-spin bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.95)_55deg,transparent_120deg,transparent_235deg,rgba(59,130,246,0.95)_295deg,transparent_360deg)]"
                style={{ animationDuration: "7s" }}
              />
            </div>

            <div className="relative rounded-2xl bg-card/90 p-8 backdrop-blur-xl">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.35)]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h1 className="font-display text-xl font-bold text-foreground">Admin Sign In</h1>
              <p className="mt-1 text-sm text-muted-foreground">Portfolio CMS - authorized access only.</p>

              <form action={formAction} className="mt-7 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Input id="password" name="password" type="password" required autoComplete="current-password" />
                </div>

                {state.error && (
                  <p role="alert" className="text-sm text-destructive">
                    {state.error}
                  </p>
                )}

                <Button type="submit" variant="gradient" className="w-full" disabled={isPending}>
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </div>
          </motion.div>
        </TiltLayer>
      </motion.div>
    </div>
  );
}
