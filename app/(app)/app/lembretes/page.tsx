"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  BellOff,
  BellRing,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationStatus = "granted" | "denied" | "default" | "unsupported";

// Mock reminder times configured by admin/healthcare provider
const mockReminders = [
  { id: "1", time: "08:00", label: "Manhã", active: true },
  { id: "2", time: "12:00", label: "Meio-dia", active: true },
  { id: "3", time: "18:00", label: "Tarde", active: true },
  { id: "4", time: "21:00", label: "Noite", active: true },
];

export default function LembretesPage() {
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>("default");
  const [isRequesting, setIsRequesting] = useState(false);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationStatus(Notification.permission as NotificationStatus);
    } else {
      setNotificationStatus("unsupported");
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setNotificationStatus("unsupported");
      return;
    }

    setIsRequesting(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission as NotificationStatus);
    } catch {
      setNotificationStatus("denied");
    }
    setIsRequesting(false);
  };

  const getStatusConfig = () => {
    switch (notificationStatus) {
      case "granted":
        return {
          icon: CheckCircle2,
          title: "Notificações Ativadas",
          description: "Você receberá lembretes nos horários configurados.",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
          textColor: "text-emerald-700",
          iconColor: "text-white",
        };
      case "denied":
        return {
          icon: XCircle,
          title: "Notificações Bloqueadas",
          description: "As notificações foram bloqueadas. Para receber lembretes, habilite nas configurações do navegador/dispositivo.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBg: "bg-gradient-to-br from-red-500 to-rose-500",
          textColor: "text-red-700",
          iconColor: "text-white",
          showHelp: true,
        };
      case "unsupported":
        return {
          icon: AlertTriangle,
          title: "Notificações Não Suportadas",
          description: "Seu navegador não suporta notificações. Tente usar um navegador mais recente.",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500",
          textColor: "text-amber-700",
          iconColor: "text-white",
        };
      default:
        return {
          icon: BellOff,
          title: "Notificações Desativadas",
          description: "Ative as notificações para receber lembretes das suas medições.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBg: "bg-gradient-to-br from-red-500 to-rose-500",
          textColor: "text-red-700",
          iconColor: "text-white",
          showButton: true,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex h-[calc(100dvh-5rem)] flex-col overflow-hidden px-4 py-3 md:mx-auto md:h-[calc(100dvh-5.5rem)] md:max-w-2xl md:px-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Lembretes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie seus horários de medição
        </p>
      </div>

      {/* Notification Status Card */}
      <Card
        className={cn(
          "mb-4 border-2 p-4",
          statusConfig.bgColor,
          statusConfig.borderColor
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg",
              statusConfig.iconBg
            )}
          >
            <StatusIcon className={cn("h-6 w-6", statusConfig.iconColor)} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className={cn("font-bold", statusConfig.textColor)}>
              {statusConfig.title}
            </h3>
            <p className={cn("mt-1 text-sm", statusConfig.textColor, "opacity-80")}>
              {statusConfig.description}
            </p>

            {statusConfig.showButton && (
              <Button
                onClick={requestPermission}
                disabled={isRequesting}
                className="mt-3 bg-gradient-to-r from-red-500 to-rose-500 font-semibold text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-rose-600"
              >
                <Bell className="mr-2 h-4 w-4" />
                {isRequesting ? "Solicitando..." : "Ativar Notificações"}
              </Button>
            )}

            {statusConfig.showHelp && (
              <div className="mt-3 rounded-lg bg-white/60 p-3">
                <p className="flex items-center gap-2 text-xs font-medium text-red-600">
                  <Info className="h-4 w-4" />
                  Como ativar:
                </p>
                <p className="mt-1 text-xs text-red-600/80">
                  Acesse as configurações do seu navegador ou dispositivo e permita notificações para este site.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="mb-4 border-2 border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Como funcionam os lembretes?</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Os horários de lembrete são configurados pelo seu profissional de saúde. 
              Você receberá uma notificação em cada horário configurado para lembrar de fazer suas medições.
            </p>
          </div>
        </div>
      </Card>

      {/* Reminders List */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-bold text-foreground">Seus Horários</h2>
        <span className="text-xs text-muted-foreground">
          {mockReminders.filter(r => r.active).length} lembretes ativos
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 pb-4">
          {mockReminders.map((reminder, index) => (
            <Card
              key={reminder.id}
              className={cn(
                "flex items-center gap-4 border-2 p-4 transition-all",
                reminder.active
                  ? "border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5"
                  : "border-muted bg-muted/30 opacity-60"
              )}
            >
              {/* Time Badge */}
              <div
                className={cn(
                  "flex h-14 w-14 flex-col items-center justify-center rounded-xl font-bold shadow-lg",
                  reminder.active
                    ? "bg-gradient-to-br from-primary to-secondary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <BellRing className={cn("h-5 w-5", reminder.active ? "text-white" : "text-muted-foreground")} />
                <span className="mt-0.5 text-xs">{reminder.time}</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{reminder.label}</p>
                  {reminder.active && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Lembrete {index + 1} de {mockReminders.length}
                </p>
              </div>

              {/* Status Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  reminder.active
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {reminder.active ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="mt-auto border-t pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Os lembretes são configurados pelo seu profissional de saúde</span>
        </div>
      </div>
    </div>
  );
}
