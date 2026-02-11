"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Download,
  Bell,
  Shield,
  Heart,
  Settings,
  Smartphone,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function ProfilePage() {
  const handleInstallPWA = () => {
    alert("Recurso PWA será implementado em breve!");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-extrabold text-foreground md:text-5xl">
          Meu Perfil
        </h1>
        <p className="text-lg text-muted-foreground">
          Gerencie suas informações e configurações
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Card */}
        <Card className="lg:col-span-2 border-2 p-8 shadow-lg">
          <div className="mb-8 flex items-start gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-4xl font-bold text-primary-foreground shadow-xl shadow-primary/30">
              JD
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                João da Silva
              </h2>
              <p className="mb-3 text-muted-foreground">
                Membro desde janeiro de 2024
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="gap-1 bg-primary/10 text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Conta Verificada
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  42 dias consecutivos
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  defaultValue="João da Silva"
                  className="h-12 pl-11"
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
                  defaultValue="joao@email.com"
                  className="h-12 pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-sm font-semibold">
                Data de Nascimento
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="birthdate"
                  type="date"
                  defaultValue="1990-05-15"
                  className="h-12 pl-11"
                />
              </div>
            </div>

            <Button className="w-full h-12 font-bold shadow-lg shadow-primary/20">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Salvar Alterações
            </Button>
          </div>
        </Card>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* PWA Install Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Smartphone className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              Instalar Aplicativo
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Instale o VigiDoc como app nativo no seu dispositivo para acesso
              mais rápido
            </p>
            <Button
              onClick={handleInstallPWA}
              variant="outline"
              className="w-full font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Instalar
            </Button>
          </Card>

          {/* Stats Card */}
          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Estatísticas</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Medições Totais
                </span>
                <span className="text-xl font-bold text-foreground">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Dias Consecutivos
                </span>
                <span className="text-xl font-bold text-primary">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Esta Semana
                </span>
                <span className="text-xl font-bold text-foreground">18</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Settings Section */}
      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Configurações
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex items-center gap-4 border-2 p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-foreground">Notificações</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie lembretes e alertas
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Card>

          <Card className="flex items-center gap-4 border-2 p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
              <Shield className="h-7 w-7 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-foreground">Privacidade</h3>
              <p className="text-sm text-muted-foreground">
                Dados e segurança
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Card>

          <Card className="flex items-center gap-4 border-2 p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Download className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-foreground">
                Exportar Dados
              </h3>
              <p className="text-sm text-muted-foreground">
                Download em CSV
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </Card>

          <Card className="flex items-center gap-4 border-2 p-6 transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
              <User className="h-7 w-7 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-foreground">Conta</h3>
              <p className="text-sm text-muted-foreground">
                Senha e autenticação
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
