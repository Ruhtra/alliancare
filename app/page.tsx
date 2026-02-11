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
  CheckCircle2,
  Droplet,
  Thermometer,
  Gauge,
  Weight,
  HeartPulse,
  FileText,
  Download,
  Zap,
  Lock,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/vigidoc-logo.png"
                alt="VigiDoc Logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">VigiDoc</span>
              <span className="text-xs text-muted-foreground">sinais vitais</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="lg" className="hidden md:inline-flex">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="lg" className="font-semibold shadow-lg shadow-primary/20">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px]" />
        <div className="container relative mx-auto px-4 py-20 md:px-6 md:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary backdrop-blur-sm">
              <Heart className="h-5 w-5 animate-pulse text-destructive" />
              Cuidado Profissional ao Seu Alcance
            </div>
            <h1 className="mb-6 max-w-5xl text-balance text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Monitore sua saúde com{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                inteligência
              </span>
            </h1>
            <p className="mb-10 max-w-3xl text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl">
              A solução completa para acompanhamento de sinais vitais. Registre
              suas medições, receba lembretes inteligentes e compartilhe dados
              com seu médico de forma segura.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/cadastro">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Começar Agora
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 border-2 px-8 text-lg font-semibold transition-all hover:scale-105"
                >
                  Ver Recursos
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Dados Seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Sem Instalação</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vital Signs Cards */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/50 px-4 py-2 text-sm font-semibold text-accent-foreground">
              <Activity className="h-4 w-4" />
              Sinais Vitais Monitorados
            </div>
            <h2 className="mb-6 text-balance text-4xl font-extrabold text-foreground md:text-5xl">
              Tudo que você precisa acompanhar
            </h2>
            <p className="text-pretty text-xl text-muted-foreground">
              Seis sinais vitais essenciais em uma única plataforma
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group relative overflow-hidden border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/20" />
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                  <Gauge className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                  Pressão Arterial
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Registre pressão sistólica e diastólica com alertas para
                  valores anormais
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/10">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-secondary/5 blur-3xl transition-all group-hover:bg-secondary/20" />
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-primary shadow-lg shadow-secondary/20">
                  <HeartPulse className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                  Frequência Cardíaca
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Monitore seus batimentos por minuto e identifique padrões
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-destructive/50 hover:shadow-2xl hover:shadow-destructive/10">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-destructive/5 blur-3xl transition-all group-hover:bg-destructive/20" />
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive to-orange-500 shadow-lg shadow-destructive/20">
                  <Thermometer className="h-8 w-8 text-destructive-foreground" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                  Temperatura Corporal
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Acompanhe variações de temperatura e detecte febres
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/20" />
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-primary shadow-lg shadow-cyan-500/20">
                  <Droplet className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                  Saturação de O₂
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Verifique seus níveis de oxigenação sanguínea
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/10">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-secondary/5 blur-3xl transition-all group-hover:bg-secondary/20" />
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-secondary shadow-lg shadow-purple-500/20">
                  <Weight className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                  Peso Corporal
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Registre e acompanhe a evolução do seu peso ao longo do tempo
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-destructive/50 hover:shadow-2xl hover:shadow-destructive/10">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-destructive/5 blur-3xl transition-all group-hover:bg-destructive/20" />
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-destructive shadow-lg shadow-orange-500/20">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                  Nível de Dor
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Avalie e registre a intensidade da dor em escala de 0 a 10
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative bg-gradient-to-b from-muted/30 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Star className="h-4 w-4 fill-current" />
              Recursos Exclusivos
            </div>
            <h2 className="mb-6 text-balance text-4xl font-extrabold text-foreground md:text-5xl">
              Por que escolher o VigiDoc?
            </h2>
            <p className="text-pretty text-xl text-muted-foreground">
              Tecnologia de ponta para cuidar da sua saúde
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-2 p-8 transition-all hover:border-primary/30 hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Bell className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                Lembretes Inteligentes
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Configure notificações personalizadas e nunca mais esqueça suas
                medições diárias. Sistema adaptativo aos seus horários.
              </p>
            </Card>

            <Card className="relative overflow-hidden border-2 p-8 transition-all hover:border-secondary/30 hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                <TrendingUp className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                Histórico Visual
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Gráficos e estatísticas para visualizar a evolução dos seus
                sinais vitais ao longo do tempo com filtros avançados.
              </p>
            </Card>

            <Card className="relative overflow-hidden border-2 p-8 transition-all hover:border-primary/30 hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Download className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                Exportação de Dados
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Exporte seus registros em formato CSV para compartilhar com
                profissionais de saúde ou manter backup pessoal.
              </p>
            </Card>

            <Card className="relative overflow-hidden border-2 p-8 transition-all hover:border-secondary/30 hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                <Users className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                Compartilhamento Fácil
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Compartilhe relatórios completos com seu médico de forma rápida
                e segura, facilitando consultas e diagnósticos.
              </p>
            </Card>

            <Card className="relative overflow-hidden border-2 p-8 transition-all hover:border-primary/30 hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Smartphone className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                App Nativo (PWA)
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Instale como aplicativo no seu dispositivo para acesso offline e
                experiência nativa sem ocupar espaço.
              </p>
            </Card>

            <Card className="relative overflow-hidden border-2 p-8 transition-all hover:border-secondary/30 hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                <Lock className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                Segurança Máxima
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Criptografia de ponta a ponta e conformidade com LGPD. Seus
                dados de saúde protegidos com o mais alto padrão.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
              <Clock className="h-4 w-4" />
              Simples e Rápido
            </div>
            <h2 className="mb-6 text-balance text-4xl font-extrabold text-foreground md:text-5xl">
              Comece em 3 passos
            </h2>
            <p className="text-pretty text-xl text-muted-foreground">
              Sua saúde sob controle em menos de 5 minutos
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute left-1/2 top-20 hidden h-1 w-full -translate-x-1/2 bg-gradient-to-r from-primary to-secondary md:block" />
              <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl font-black text-primary-foreground shadow-2xl shadow-primary/30">
                1
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                Cadastre-se Grátis
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Crie sua conta em segundos. Apenas nome, email e senha.
                Totalmente gratuito e sem compromisso.
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute left-1/2 top-20 hidden h-1 w-full -translate-x-1/2 bg-gradient-to-r from-secondary to-primary md:block" />
              <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-primary text-3xl font-black text-secondary-foreground shadow-2xl shadow-secondary/30">
                2
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                Configure Lembretes
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Defina os horários ideais para suas medições. O sistema enviará
                notificações nos momentos certos.
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl font-black text-primary-foreground shadow-2xl shadow-primary/30">
                3
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                Registre e Acompanhe
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Insira suas medições com um clique. Visualize histórico,
                gráficos e exporte quando precisar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="container relative mx-auto px-4 text-center md:px-6">
          <Heart className="mx-auto mb-8 h-20 w-20 animate-pulse text-primary-foreground/80" />
          <h2 className="mb-6 text-balance text-4xl font-extrabold text-primary-foreground md:text-6xl">
            Sua saúde merece atenção
          </h2>
          <p className="mb-10 text-pretty text-xl text-primary-foreground/90 md:text-2xl">
            Comece hoje a monitorar seus sinais vitais e tenha mais controle
            sobre seu bem-estar
          </p>
          <Link href="/cadastro">
            <Button
              size="lg"
              variant="secondary"
              className="h-16 px-10 text-xl font-bold shadow-2xl transition-all hover:scale-105 hover:shadow-black/40"
            >
              <Zap className="mr-2 h-6 w-6" />
              Criar Conta Gratuita
            </Button>
          </Link>
          <p className="mt-6 text-sm text-primary-foreground/80">
            Sem cartão de crédito • Sem compromisso • 100% gratuito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/vigidoc-logo.png"
                alt="VigiDoc Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">VigiDoc</span>
                <span className="text-xs text-muted-foreground">
                  Monitoramento de Sinais Vitais
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              © 2024 VigiDoc. Todos os direitos reservados. Feito com{" "}
              <Heart className="inline h-4 w-4 text-destructive" /> para sua
              saúde.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
