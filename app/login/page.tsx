"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart, Lock, Mail, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to app
    window.location.href = "/app";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px]" />
      <div className="absolute left-10 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 md:left-8 md:top-8"
      >
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>
      </Link>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md border-2 p-8 shadow-2xl backdrop-blur-sm md:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3">
            <Image
              src="/vigidoc-logo.png"
              alt="VigiDoc Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
            <div className="flex flex-col items-start">
              <span className="text-3xl font-extrabold text-primary">VigiDoc</span>
              <span className="text-xs text-muted-foreground">sinais vitais</span>
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Bem-vindo de volta!
          </h1>
          <p className="text-pretty text-muted-foreground">
            Entre para continuar monitorando sua saúde
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="h-12 pl-11 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold">
                Senha
              </Label>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Esqueceu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 pl-11 text-base"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
          >
            <Heart className="mr-2 h-5 w-5" />
            Entrar no VigiDoc
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <Link
              href="/cadastro"
              className="font-bold text-primary hover:underline"
            >
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Seus dados são protegidos e criptografados</span>
        </div>
      </Card>
    </div>
  );
}
