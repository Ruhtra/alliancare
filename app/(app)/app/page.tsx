"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  Gauge,
  HeartPulse,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const measurements = [
  {
    id: "pressao",
    icon: Gauge,
    title: "Pressão Arterial",
    description: "Sistólica e Diastólica",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "hover:border-red-500/30",
    fields: [
      {
        id: "sistolica",
        label: "Pressão Sistólica (máxima)",
        placeholder: "120",
        unit: "mmHg",
      },
      {
        id: "diastolica",
        label: "Pressão Diastólica (mínima)",
        placeholder: "80",
        unit: "mmHg",
      },
    ],
  },
  {
    id: "frequencia",
    icon: HeartPulse,
    title: "Frequência Cardíaca",
    description: "Batimentos por minuto",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "hover:border-pink-500/30",
    fields: [
      {
        id: "bpm",
        label: "Batimentos por minuto (BPM)",
        placeholder: "72",
        unit: "bpm",
      },
    ],
  },
  {
    id: "temperatura",
    icon: Thermometer,
    title: "Temperatura Corporal",
    description: "Em graus Celsius",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "hover:border-orange-500/30",
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
    title: "Saturação de O₂",
    description: "SpO₂ percentual",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "hover:border-blue-500/30",
    fields: [
      {
        id: "spo2",
        label: "Saturação de oxigênio (SpO₂)",
        placeholder: "98",
        unit: "%",
      },
    ],
  },
  {
    id: "peso",
    icon: Weight,
    title: "Peso Corporal",
    description: "Em kilogramas",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "hover:border-green-500/30",
    fields: [
      {
        id: "weight",
        label: "Peso atual em kg",
        placeholder: "70.5",
        unit: "kg",
      },
    ],
  },
  {
    id: "dor",
    icon: AlertCircle,
    title: "Nível de Dor",
    description: "Escala de 0 a 10",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "hover:border-yellow-500/30",
    fields: [
      {
        id: "pain",
        label: "Intensidade da dor (0 = sem dor, 10 = dor máxima)",
        placeholder: "0",
        unit: "/10",
      },
    ],
  },
];

const schedules = [
  { time: "08:00", completed: true },
  { time: "14:00", completed: true },
  { time: "20:00", completed: false },
];

export default function HomePage() {
  const [open, setOpen] = useState<string | null>(null);
  const completedToday = schedules.filter((s) => s.completed).length;
  const totalSchedules = schedules.length;
  const progress = (completedToday / totalSchedules) * 100;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span className="capitalize">{getCurrentDate()}</span>
        </div>
        <h1 className="mb-3 text-4xl font-extrabold text-foreground md:text-5xl">
          Monitoramento Diário
        </h1>
        <p className="text-lg text-muted-foreground">
          Registre seus sinais vitais e acompanhe sua saúde
        </p>
      </div>

      {/* Progress Card */}
      <Card className="relative mb-8 overflow-hidden border-2 bg-gradient-to-br from-card to-accent/20 p-8 shadow-lg">
        <div className="absolute right-4 top-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Progresso de Hoje
                </span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-foreground">
                {completedToday} de {totalSchedules}
              </h2>
              <p className="text-muted-foreground">medições realizadas</p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-bold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {schedules.map((schedule, idx) => (
              <Badge
                key={idx}
                variant={schedule.completed ? "default" : "outline"}
                className={`gap-2 px-4 py-2 ${
                  schedule.completed
                    ? "bg-primary shadow-md shadow-primary/20"
                    : ""
                }`}
              >
                {schedule.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                <span className="font-semibold">{schedule.time}</span>
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Measurements Grid */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Registrar Sinais Vitais
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  <Card
                    className={`group relative cursor-pointer overflow-hidden border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${measurement.borderColor}`}
                  >
                    <div className="absolute right-4 top-4 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100" style={{ backgroundColor: measurement.color.replace('text-', '') + '20' }} />
                    <div className="relative">
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${measurement.bgColor} transition-transform group-hover:scale-110`}
                        >
                          <Icon className={`h-7 w-7 ${measurement.color}`} />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Plus className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="mb-1 text-lg font-bold text-card-foreground">
                        {measurement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {measurement.description}
                      </p>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${measurement.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${measurement.color}`} />
                      </div>
                      <div>
                        <div>{measurement.title}</div>
                        <div className="text-sm font-normal text-muted-foreground">
                          {measurement.description}
                        </div>
                      </div>
                    </DialogTitle>
                    <DialogDescription>
                      Preencha os campos abaixo para registrar sua medição atual
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="space-y-5 py-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOpen(null);
                      // Here you would save the data
                    }}
                  >
                    {measurement.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="font-semibold">
                          {field.label}
                        </Label>
                        <div className="relative">
                          <Input
                            id={field.id}
                            type="number"
                            step="0.1"
                            placeholder={field.placeholder}
                            className="h-12 pr-20 text-base"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
                            {field.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label className="font-semibold">Horário da medição</Label>
                      <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-accent/50 px-4 py-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-semibold text-foreground">
                            {getCurrentTime()}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            (agora)
                          </span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(null)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 font-bold shadow-lg shadow-primary/20">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Salvar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="mb-2 font-bold text-foreground">
              Dica: Consistência é fundamental
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Registre suas medições nos mesmos horários todos os dias para
              obter dados mais precisos e facilitar o acompanhamento da sua
              saúde pelo seu médico.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
