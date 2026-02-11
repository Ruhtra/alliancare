"use client";

import { useState, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  HeartPulse,
  Thermometer,
  Droplet,
  Weight,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sunrise,
  Sun,
  Moon,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MeasurementValue = {
  [key: string]: string;
};

type FilledData = {
  [key: string]: MeasurementValue;
};

// Horários configurados (exemplo: 18h e 21h)
const scheduleHours = ["18:00", "21:00"];

const measurements = [
  {
    id: "pressao",
    icon: Gauge,
    title: "Pressão Arterial",
    shortTitle: "PA",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    fields: [
      { id: "sistolica", label: "Sistólica", placeholder: "120", unit: "mmHg" },
      { id: "diastolica", label: "Diastólica", placeholder: "80", unit: "mmHg" },
    ],
  },
  {
    id: "frequencia",
    icon: HeartPulse,
    title: "Frequência Cardíaca",
    shortTitle: "FC",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    fields: [{ id: "bpm", label: "BPM", placeholder: "72", unit: "bpm" }],
  },
  {
    id: "temperatura",
    icon: Thermometer,
    title: "Temperatura",
    shortTitle: "TEMP",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    fields: [{ id: "temp", label: "Temperatura", placeholder: "36.5", unit: "°C" }],
  },
  {
    id: "saturacao",
    icon: Droplet,
    title: "Saturação O₂",
    shortTitle: "SpO₂",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    fields: [{ id: "spo2", label: "SpO₂", placeholder: "98", unit: "%" }],
  },
  {
    id: "peso",
    icon: Weight,
    title: "Peso",
    shortTitle: "PESO",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    fields: [{ id: "weight", label: "Peso", placeholder: "70.5", unit: "kg" }],
  },
  {
    id: "dor",
    icon: AlertCircle,
    title: "Nível de Dor",
    shortTitle: "DOR",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    fields: [{ id: "pain", label: "Dor (0-10)", placeholder: "0", unit: "/10" }],
  },
];

export default function HomePage() {
  const [filledData, setFilledData] = useState<FilledData>({});
  const [open, setOpen] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [pendingMeasurementId, setPendingMeasurementId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentSchedule, setCurrentSchedule] = useState<string | null>(null);
  const [nextSchedule, setNextSchedule] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // Determinar horário atual e próximo
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      let current: string | null = null;
      let next: string | null = null;

      for (let i = 0; i < scheduleHours.length; i++) {
        const [hour, minute] = scheduleHours[i].split(":").map(Number);
        const scheduleTimeInMinutes = hour * 60 + minute;

        if (currentTimeInMinutes < scheduleTimeInMinutes) {
          next = scheduleHours[i];
          if (i > 0) {
            current = scheduleHours[i - 1];
          }
          break;
        }
      }

      // Se passou de todos os horários, atual é o último
      if (!next && scheduleHours.length > 0) {
        current = scheduleHours[scheduleHours.length - 1];
      }

      setCurrentSchedule(current);
      setNextSchedule(next);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPeriodOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { label: "Manhã", icon: Sunrise, color: "text-orange-500" };
    if (hour >= 12 && hour < 18) return { label: "Tarde", icon: Sun, color: "text-yellow-500" };
    return { label: "Noite", icon: Moon, color: "text-blue-500" };
  };

  const filledCount = Object.keys(filledData).length;
  const totalCount = measurements.length;
  const completionPercentage = Math.round((filledCount / totalCount) * 100);
  const period = getPeriodOfDay();
  const PeriodIcon = period.icon;

  const handleOpenDialog = (measurementId: string) => {
    if (filledData[measurementId]) {
      setPendingMeasurementId(measurementId);
      setShowWarning(true);
    } else {
      setOpen(measurementId);
    }
  };

  const handleProceedToEdit = () => {
    setShowWarning(false);
    if (pendingMeasurementId) {
      setOpen(pendingMeasurementId);
    }
  };

  const handleSubmit = (measurementId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: MeasurementValue = {};
    
    formData.forEach((value, key) => {
      values[key] = value.toString();
    });

    setFilledData((prev) => ({
      ...prev,
      [measurementId]: values,
    }));
    setOpen(null);
  };

  const handleConfirm = () => {
    if (filledCount === 0) {
      return;
    }
    
    if (filledCount < totalCount) {
      setShowConfirmAlert(true);
    } else {
      alert("Sinais vitais confirmados com sucesso!");
    }
  };

  const getDisplayValue = (measurementId: string, measurement: typeof measurements[0]) => {
    const data = filledData[measurementId];
    if (!data) return null;

    if (measurement.fields.length === 2) {
      return `${data[measurement.fields[0].id]}/${data[measurement.fields[1].id]}`;
    } else {
      const field = measurement.fields[0];
      return `${data[field.id]}${field.unit}`;
    }
  };

  const getButtonState = () => {
    if (filledCount === 0) return { color: "bg-muted text-muted-foreground cursor-not-allowed", label: "Preencha os sinais vitais" };
    if (filledCount < totalCount) return { color: "bg-yellow-500 hover:bg-yellow-600 text-white", label: `Confirmar (${filledCount}/${totalCount})` };
    return { color: "bg-green-500 hover:bg-green-600 text-white", label: "Confirmar Sinais Vitais" };
  };

  const buttonState = getButtonState();

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col md:h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex h-full max-w-6xl flex-col px-4 py-2.5 md:py-3">
        {/* Expanded Header */}
        <div className="mb-2.5 space-y-2.5 rounded-2xl border-2 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 shadow-sm md:mb-3 md:space-y-3 md:p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <PeriodIcon className={cn("h-6 w-6", period.color)} />
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {period.label}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:gap-3 md:text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{currentTime}</span>
                </div>
                <span className="hidden md:inline">•</span>
                <span className="font-medium">
                  {filledCount}/{totalCount} preenchidos
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-3xl font-extrabold text-primary md:text-4xl">
                {completionPercentage}%
              </span>
              <span className="text-xs text-muted-foreground">conclusão</span>
            </div>
          </div>

          <Progress value={completionPercentage} className="h-2.5" />

          {/* Schedule Information */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {currentSchedule && (
              <Badge variant="default" className="gap-1.5 px-2.5 py-1 text-xs font-semibold md:text-sm">
                <Clock className="h-3.5 w-3.5" />
                Horário Atual: {currentSchedule}
              </Badge>
            )}
            {nextSchedule && (
              <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-semibold md:text-sm">
                <ChevronRight className="h-3.5 w-3.5" />
                Próximo: {nextSchedule}
              </Badge>
            )}
            {!nextSchedule && currentSchedule && (
              <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-600 md:text-sm">
                <AlertCircle className="h-3.5 w-3.5" />
                Último horário do dia
              </Badge>
            )}
          </div>
        </div>

        {/* Compact Grid 2x3 */}
        <div className="grid flex-1 grid-cols-2 gap-2 md:gap-2.5">
          {measurements.map((measurement) => {
            const Icon = measurement.icon;
            const isFilled = !!filledData[measurement.id];
            const displayValue = getDisplayValue(measurement.id, measurement);

            return (
              <Dialog
                key={measurement.id}
                open={open === measurement.id}
                onOpenChange={(isOpen) => {
                  if (!isOpen) setOpen(null);
                }}
              >
                <DialogTrigger asChild>
                  <Card
                    onClick={() => handleOpenDialog(measurement.id)}
                    className={cn(
                      "group relative flex cursor-pointer flex-col justify-between border-2 p-2.5 transition-all duration-200 hover:shadow-lg md:p-3",
                      isFilled
                        ? `${measurement.borderColor} ${measurement.bgColor} shadow-md`
                        : "border-border bg-card hover:border-primary/30 hover:bg-accent/5"
                    )}
                  >
                    {/* Status Badge */}
                    {isFilled && (
                      <div className="absolute right-1.5 top-1.5">
                        <CheckCircle2 className={cn("h-4 w-4", measurement.color)} />
                      </div>
                    )}

                    {/* Icon and Title - More Compact */}
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg md:h-9 md:w-9",
                          measurement.bgColor
                        )}
                      >
                        <Icon className={cn("h-4 w-4 md:h-5 md:w-5", measurement.color)} />
                      </div>
                      <h3 className="text-xs font-bold leading-tight text-foreground md:text-sm">
                        {measurement.shortTitle}
                      </h3>
                    </div>

                    {/* Value Display */}
                    <div className="mt-1.5">
                      {isFilled ? (
                        <p className={cn("text-sm font-bold leading-tight md:text-base", measurement.color)}>
                          {displayValue}
                        </p>
                      ) : (
                        <p className="text-xs leading-tight text-muted-foreground">
                          Toque para preencher
                        </p>
                      )}
                    </div>
                  </Card>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div className={cn("rounded-lg p-2", measurement.bgColor)}>
                        <Icon className={cn("h-6 w-6", measurement.color)} />
                      </div>
                      <span>{measurement.title}</span>
                    </DialogTitle>
                    <DialogDescription>
                      {isFilled
                        ? "Você já preencheu este campo. Os valores anteriores serão substituídos."
                        : "Registre sua medição atual"}
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => handleSubmit(measurement.id, e)}
                    className="space-y-4 py-4"
                  >
                    {measurement.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="font-semibold">
                          {field.label}
                        </Label>
                        <div className="relative">
                          <Input
                            id={field.id}
                            name={field.id}
                            type="number"
                            step="0.1"
                            placeholder={field.placeholder}
                            defaultValue={filledData[measurement.id]?.[field.id] || ""}
                            className="h-11 pr-16 text-base"
                            required
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                            {field.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label className="font-semibold">Horário da Medição</Label>
                      <div className="flex items-center gap-3 rounded-lg border-2 bg-muted/50 px-3 py-2.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {currentTime}
                        </span>
                        {currentSchedule && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <Badge variant="secondary" className="text-xs">
                              Grupo: {currentSchedule}
                            </Badge>
                          </>
                        )}
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
                      <Button type="submit" className="flex-1 font-bold">
                        Salvar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>

        {/* Compact Confirm Button */}
        <div className="mt-2.5 md:mt-3">
          <Button
            onClick={handleConfirm}
            disabled={filledCount === 0}
            className={cn("h-11 w-full text-sm font-bold shadow-lg transition-all md:h-12 md:text-base", buttonState.color)}
          >
            {filledCount === totalCount ? (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            ) : filledCount > 0 ? (
              <AlertTriangle className="mr-2 h-5 w-5" />
            ) : null}
            {buttonState.label}
          </Button>
        </div>
      </div>

      {/* Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Campo já preenchido</AlertDialogTitle>
            <AlertDialogDescription>
              Este campo já foi preenchido anteriormente. Se você continuar, o
              registro anterior será substituído pelo novo valor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingMeasurementId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedToEdit}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Alert Dialog */}
      <AlertDialog open={showConfirmAlert} onOpenChange={setShowConfirmAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Campos faltando
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você preencheu apenas {filledCount} de {totalCount} campos. É
              recomendado preencher todos os sinais vitais para um monitoramento
              completo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar e preencher</AlertDialogCancel>
            <AlertDialogAction onClick={() => alert("Sinais vitais confirmados parcialmente!")}>
              Confirmar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
