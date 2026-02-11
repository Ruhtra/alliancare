"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Heart,
  Thermometer,
  Droplet,
  Weight,
  AlertCircle,
  Plus,
  Clock,
  CalendarDays,
} from "lucide-react";

const measurements = [
  {
    id: "pressao",
    icon: Activity,
    title: "Pressão Arterial",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    fields: [
      {
        id: "sistolica",
        label: "Sistólica (máxima)",
        placeholder: "120",
        unit: "mmHg",
      },
      {
        id: "diastolica",
        label: "Diastólica (mínima)",
        placeholder: "80",
        unit: "mmHg",
      },
    ],
  },
  {
    id: "frequencia",
    icon: Heart,
    title: "Frequência Cardíaca",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    fields: [
      {
        id: "bpm",
        label: "Batimentos por minuto",
        placeholder: "72",
        unit: "bpm",
      },
    ],
  },
  {
    id: "temperatura",
    icon: Thermometer,
    title: "Temperatura",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    fields: [
      {
        id: "temp",
        label: "Temperatura corporal",
        placeholder: "36.5",
        unit: "°C",
      },
    ],
  },
  {
    id: "saturacao",
    icon: Droplet,
    title: "Saturação O₂",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    fields: [
      { id: "spo2", label: "SpO₂", placeholder: "98", unit: "%" },
    ],
  },
  {
    id: "peso",
    icon: Weight,
    title: "Peso",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    fields: [
      { id: "weight", label: "Peso atual", placeholder: "70", unit: "kg" },
    ],
  },
  {
    id: "dor",
    icon: AlertCircle,
    title: "Nível de Dor",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    fields: [
      {
        id: "pain",
        label: "Intensidade (0 = sem dor)",
        placeholder: "0",
        unit: "/10",
      },
    ],
  },
];

const schedules = [
  { time: "08:00", completed: true },
  { time: "12:00", completed: false },
  { time: "18:00", completed: false },
  { time: "22:00", completed: false },
];

export default function HomePage() {
  const [open, setOpen] = useState<string | null>(null);
  const completedToday = schedules.filter((s) => s.completed).length;
  const totalSchedules = schedules.length;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          Monitoramento Diário
        </h1>
        <p className="text-muted-foreground">
          Registre seus sinais vitais nos horários programados
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              Medições de Hoje
            </h2>
            <p className="text-sm text-muted-foreground">
              {completedToday} de {totalSchedules} medições realizadas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${(completedToday / totalSchedules) * 100}%`,
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {schedules.map((schedule) => (
              <Badge
                key={schedule.time}
                variant={schedule.completed ? "default" : "outline"}
                className="gap-1"
              >
                <Clock className="h-3 w-3" />
                {schedule.time}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* No Schedules Message */}
      {totalSchedules === 0 && (
        <Card className="mb-6 border-dashed p-8 text-center">
          <Clock className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Nenhum horário configurado
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Configure os horários para suas medições na aba Lembretes
          </p>
          <Button variant="outline">Configurar Horários</Button>
        </Card>
      )}

      {/* Measurements Grid */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Registrar Medição
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {measurements.map((measurement) => {
            const Icon = measurement.icon;
            return (
              <Dialog
                key={measurement.id}
                open={open === measurement.id}
                onOpenChange={(isOpen) =>
                  setOpen(isOpen ? measurement.id : null)
                }
              >
                <DialogTrigger asChild>
                  <Card className="cursor-pointer p-6 transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${measurement.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${measurement.color}`} />
                      </div>
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 font-semibold text-card-foreground">
                      {measurement.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Toque para registrar
                    </p>
                  </Card>
                </DialogTrigger>
                <DialogPopup>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${measurement.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${measurement.color}`} />
                      </div>
                      {measurement.title}
                    </DialogTitle>
                    <DialogDescription>
                      Registre sua medição atual
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4 py-4">
                    {measurement.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <div className="relative">
                          <Input
                            id={field.id}
                            type="number"
                            placeholder={field.placeholder}
                            className="pr-16"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            {field.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label>Horário da medição</Label>
                      <div className="flex items-center gap-2 rounded-lg border border-input bg-muted px-3 py-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {getCurrentTime()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (agora)
                        </span>
                      </div>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Salvar Medição
                    </Button>
                  </DialogFooter>
                </DialogPopup>
              </Dialog>
            );
          })}
        </div>
      </div>
    </div>
  );
}
