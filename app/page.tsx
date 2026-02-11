import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Activity,
  Clock,
  Shield,
  Smartphone,
  Bell,
  TrendingUp,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/vigidoc-logo.png"
              alt="VigiDoc Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-semibold text-primary">VigiDoc</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            <Heart className="h-4 w-4 text-destructive" />
            Monitoramento de Sinais Vitais
          </div>
          <h1 className="mb-6 max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Cuide da sua saúde com{" "}
            <span className="text-primary">monitoramento inteligente</span>
          </h1>
          <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            VigiDoc é a solução completa para acompanhar seus sinais vitais
            diariamente. Receba lembretes, registre suas medições e compartilhe
            com seu médico de forma simples e segura.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/cadastro">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Agora
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Recursos Principais
            </h2>
            <p className="text-pretty text-muted-foreground">
              Tudo que você precisa para monitorar sua saúde em um só lugar
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Múltiplos Sinais Vitais
              </h3>
              <p className="text-pretty text-muted-foreground">
                Monitore pressão arterial, frequência cardíaca, temperatura,
                saturação de O₂, peso e nível de dor em um único aplicativo.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Bell className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Lembretes Inteligentes
              </h3>
              <p className="text-pretty text-muted-foreground">
                Configure horários para receber notificações e nunca esqueça de
                fazer suas medições diárias.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Histórico Completo
              </h3>
              <p className="text-pretty text-muted-foreground">
                Visualize seus registros anteriores com filtros por período e
                exporte seus dados em formato CSV.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Compartilhe com seu Médico
              </h3>
              <p className="text-pretty text-muted-foreground">
                Exporte seus dados e compartilhe facilmente com profissionais de
                saúde para um acompanhamento mais eficiente.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                App Nativo (PWA)
              </h3>
              <p className="text-pretty text-muted-foreground">
                Instale como aplicativo nativo no seu dispositivo para acesso
                rápido e experiência otimizada.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Seguro e Privado
              </h3>
              <p className="text-pretty text-muted-foreground">
                Seus dados de saúde são criptografados e armazenados com total
                segurança e privacidade.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Como Funciona
            </h2>
            <p className="text-pretty text-muted-foreground">
              Comece a monitorar sua saúde em 3 passos simples
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Cadastre-se
              </h3>
              <p className="text-pretty text-muted-foreground">
                Crie sua conta gratuitamente em menos de 1 minuto
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Configure Lembretes
              </h3>
              <p className="text-pretty text-muted-foreground">
                Defina os horários para suas medições diárias
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Registre suas Medições
              </h3>
              <p className="text-pretty text-muted-foreground">
                Insira seus sinais vitais e acompanhe sua evolução
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-primary-foreground md:text-4xl">
            Pronto para cuidar melhor da sua saúde?
          </h2>
          <p className="mb-8 text-pretty text-lg text-primary-foreground/90">
            Comece hoje mesmo a monitorar seus sinais vitais
          </p>
          <Link href="/cadastro">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold"
            >
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/vigidoc-logo.png"
                alt="VigiDoc Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-semibold text-foreground">VigiDoc</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 VigiDoc. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
