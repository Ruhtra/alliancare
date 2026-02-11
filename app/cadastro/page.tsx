"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart, Lock, Mail, User, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CadastroPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to app
    window.location.href = "/app";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/5 via-background to-primary/5 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px]" />
      <div className="absolute right-10 top-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

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

      {/* Signup Card */}
      <Card className="relative z-10 w-full max-w-2xl border-2 shadow-2xl backdrop-blur-sm">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Benefits */}
          <div className="hidden flex-col justify-center gap-6 rounded-l-xl bg-gradient-to-br from-primary to-secondary p-8 text-primary-foreground md:flex">
            <div className="mb-4">
              <Image
                src="/vigidoc-logo.png"
                alt="VigiDoc Logo"
                width={56}
                height={56}
                className="h-14 w-14 brightness-0 invert"
              />
              <h2 className="mt-4 text-2xl font-bold">
                Comece a cuidar da sua saúde hoje
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">Totalmente Gratuito</p>
                  <p className="text-sm text-primary-foreground/80">
                    Sem custos ocultos ou taxas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">Seguro e Privado</p>
                  <p className="text-sm text-primary-foreground/80">
                    Dados criptografados e protegidos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">Acesso Ilimitado</p>
                  <p className="text-sm text-primary-foreground/80">
                    Todos os recursos disponíveis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-10">
            <div className="mb-6 text-center md:text-left">
              <div className="mb-4 flex items-center justify-center gap-2 md:hidden">
                <Image
                  src="/vigidoc-logo.png"
                  alt="VigiDoc Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
                <span className="text-2xl font-extrabold text-primary">
                  VigiDoc
                </span>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                Criar Conta
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Preencha os dados abaixo para começar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    className="h-11 pl-11"
                    required
                  />
                </div>
              </div>

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
                    className="h-11 pl-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="h-11 pl-11"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita sua senha"
                    className="h-11 pl-11"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
              >
                <Heart className="mr-2 h-5 w-5" />
                Criar Minha Conta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Fazer login
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link href="#" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
