"use client";

import { useState } from "react";
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
  Edit,
  X,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "João da Silva",
    email: "joao@email.com",
    birthdate: "1990-05-15",
  });

  const handleInstallPWA = () => {
    alert("Recurso PWA será implementado em breve!");
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Alterações salvas com sucesso!");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-extrabold text-foreground md:text-4xl">
          Meu Perfil
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Gerencie suas informações e configurações
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Profile Card */}
        <Card className="border-2 p-6 shadow-lg lg:col-span-2">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
                JD
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-bold text-foreground md:text-2xl">
                  João da Silva
                </h2>
                <p className="mb-2 text-sm text-muted-foreground">
                  Membro desde janeiro de 2024
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="gap-1 bg-primary/10 text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Verificado
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    42 dias
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Editar
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="h-10 pl-10 disabled:cursor-default disabled:opacity-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="h-10 pl-10 disabled:cursor-default disabled:opacity-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-sm font-semibold">
                Data de Nascimento
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                  disabled={!isEditing}
                  className="h-10 pl-10 disabled:cursor-default disabled:opacity-100"
                />
              </div>
            </div>

            {isEditing && (
              <Button
                onClick={handleSave}
                className="h-10 w-full font-bold shadow-lg shadow-primary/20"
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            )}
          </div>
        </Card>

        {/* Side Cards */}
        <div className="space-y-4">
          {/* PWA Install Card - Compact */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Instalar App
              </h3>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Acesso rápido como aplicativo nativo
            </p>
            <Button
              onClick={handleInstallPWA}
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Instalar
            </Button>
          </Card>

          {/* Stats Card - Compact */}
          <Card className="border-2 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Estatísticas</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Total de Medições
                </span>
                <span className="text-lg font-bold text-foreground">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Dias Seguidos
                </span>
                <span className="text-lg font-bold text-primary">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Esta Semana
                </span>
                <span className="text-lg font-bold text-foreground">18</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Settings Section - Compact */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Configurações
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-3 border-2 p-4 transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground">Notificações</h3>
              <p className="truncate text-xs text-muted-foreground">
                Lembretes
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border-2 p-4 transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
              <Shield className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground">Privacidade</h3>
              <p className="truncate text-xs text-muted-foreground">
                Segurança
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border-2 p-4 transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground">Exportar</h3>
              <p className="truncate text-xs text-muted-foreground">
                CSV
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border-2 p-4 transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
              <User className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground">Conta</h3>
              <p className="truncate text-xs text-muted-foreground">
                Senha
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
