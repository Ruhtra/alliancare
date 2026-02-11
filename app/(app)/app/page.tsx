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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Timer,
  XCircle,
  Eye,
  Lock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MeasurementValue = {
  [key: string]: string;
};

type ScheduleData = {
  [time: string]: FilledData;
};

type FilledData = {
  [key: string]: MeasurementValue;
};

// Horários configurados (exemplo - usuário pode ter até 5)
const scheduleHours = ["08:00", "12:00", "18:00", "21:00"];

const measurements = [
  {
    id: "pressao",
    icon: Gauge,
    title: "Pressão Arterial",
    shortTitle: "PA",
    color: "text-rose-600",
    bgColor: "bg-gradient-to-br from-rose-100 to-rose-50",
    borderColor: "border-rose-300",
    glowColor: "shadow-rose-200",
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
    bgColor: "bg-gradient-to-br from-pink-100 to-pink-50",
    borderColor: "border-pink-300",
    glowColor: "shadow-pink-200",
    fields: [{ id: "bpm", label: "BPM", placeholder: "72", unit: "bpm" }],
  },
  {
    id: "temperatura",
    icon: Thermometer,
    title: "Temperatura",
    shortTitle: "TEMP",
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-100 to-orange-50",
    borderColor: "border-orange-300",
    glowColor: "shadow-orange-200",
    fields: [{ id: "temp", label: "Temperatura", placeholder: "36.5", unit: "°C" }],
  },
  {
    id: "saturacao",
    icon: Droplet,
    title: "Saturação O₂",
    shortTitle: "SpO₂",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-blue-50",
    borderColor: "border-blue-300",
    glowColor: "shadow-blue-200",
    fields: [{ id: "spo2", label: "SpO₂", placeholder: "98", unit: "%" }],
  },
  {
    id: "peso",
    icon: Weight,
    title: "Peso",
    shortTitle: "PESO",
    color: "text-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-100 to-emerald-50",
    borderColor: "border-emerald-300",
    glowColor: "shadow-emerald-200",
    fields: [{ id: "weight", label: "Peso", placeholder: "70.5", unit: "kg" }],
  },
  {
    id: "dor",
    icon: AlertCircle,
    title: "Nível de Dor",
    shortTitle: "DOR",
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-100 to-amber-50",
    borderColor: "border-amber-300",
    glowColor: "shadow-amber-200",
    fields: [{ id: "pain", label: "Dor (0-10)", placeholder: "0", unit: "/10" }],
  },
];

export default function HomePage() {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [open, setOpen] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [pendingMeasurementId, setPendingMeasurementId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [timeUntilNext, setTimeUntilNext] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // Determinar horário atual
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      let currentScheduleTime: string | null = null;
      let nextScheduleTime: string | null = null;

      for (let i = 0; i < scheduleHours.length; i++) {
        const [hour, minute] = scheduleHours[i].split(":").map(Number);
        const scheduleTimeInMinutes = hour * 60 + minute;

        if (currentTimeInMinutes >= scheduleTimeInMinutes - 15 && currentTimeInMinutes < scheduleTimeInMinutes + 60) {
          currentScheduleTime = scheduleHours[i];
          if (i + 1 < scheduleHours.length) {
            nextScheduleTime = scheduleHours[i + 1];
          }
          break;
        }

        if (currentTimeInMinutes < scheduleTimeInMinutes) {
          nextScheduleTime = scheduleHours[i];
          if (i > 0) {
            currentScheduleTime = scheduleHours[i - 1];
          }
          break;
        }
      }

      if (!currentScheduleTime && !nextScheduleTime && scheduleHours.length > 0) {
        currentScheduleTime = scheduleHours[scheduleHours.length - 1];
      }

      if (currentScheduleTime && !selectedSchedule) {
        setSelectedSchedule(currentScheduleTime);
      }

      // Calcular tempo até próximo horário
      if (nextScheduleTime) {
        const [nextHour, nextMinute] = nextScheduleTime.split(":").map(Number);
        const nextTimeInMinutes = nextHour * 60 + nextMinute;
        const diff = nextTimeInMinutes - currentTimeInMinutes;
        
        if (diff > 0) {
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;
          setTimeUntilNext(`${hours}h ${minutes}m`);
        } else {
          setTimeUntilNext("");
        }
      } else {
        setTimeUntilNext("");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedSchedule]);

  const getPeriodOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { label: "Manhã", icon: Sunrise, color: "from-orange-500 to-amber-500", textColor: "text-orange-600" };
    if (hour >= 12 && hour < 18) return { label: "Tarde", icon: Sun, color: "from-yellow-500 to-orange-500", textColor: "text-yellow-600" };
    return { label: "Noite", icon: Moon, color: "from-blue-500 to-indigo-500", textColor: "text-blue-600" };
  };

  const getCurrentScheduleStatus = (scheduleTime: string) => {
    const now = new Date();
    const [hour, minute] = scheduleTime.split(":").map(Number);
    const scheduleTimeInMinutes = hour * 60 + minute;
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentTimeInMinutes >= scheduleTimeInMinutes - 15 && currentTimeInMinutes < scheduleTimeInMinutes + 60) {
      return "current"; // Pode preencher
    } else if (currentTimeInMinutes >= scheduleTimeInMinutes + 60) {
      return "past"; // Apenas visualização
    } else {
      return "future"; // Bloqueado
    }
  };

  const getScheduleStats = () => {
    let completed = 0;
    let missed = 0;
    let pending = 0;

    scheduleHours.forEach((time) => {
      const status = getCurrentScheduleStatus(time);
      const data = scheduleData[time];
      const count = data ? Object.keys(data).length : 0;

      if (status === "past") {
        if (count === measurements.length) {
          completed++;
        } else {
          missed++;
        }
      } else if (status === "current") {
        pending++;
      }
    });

    return { completed, missed, pending };
  };

  const filledData = scheduleData[selectedSchedule] || {};
  const filledCount = Object.keys(filledData).length;
  const totalCount = measurements.length;
  const completionPercentage = Math.round((filledCount / totalCount) * 100);
  const period = getPeriodOfDay();
  const PeriodIcon = period.icon;
  const stats = getScheduleStats();
  const currentStatus = getCurrentScheduleStatus(selectedSchedule);

  const handleOpenDialog = (measurementId: string) => {
    if (currentStatus === "past") {
      return; // Apenas visualização
    }
    if (currentStatus === "future") {
      return; // Bloqueado
    }

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

    setScheduleData((prev) => ({
      ...prev,
      [selectedSchedule]: {
        ...prev[selectedSchedule],
        [measurementId]: values,
      },
    }));
    setOpen(null);
  };

  const handleConfirm = () => {
    if (filledCount === 0) return;
    
    if (filledCount < totalCount) {
      setShowConfirmAlert(true);
    } else {
      alert(`Sinais vitais do horário ${selectedSchedule} confirmados com sucesso!`);
    }
  };

  const getDisplayValue = (measurementId: string, measurement: typeof measurements[0]) => {
    const data = filledData[measurementId];
    if (!data) return null;

    if (measurement.fields.length === 2) {
      return `${data[measurement.fields[0].id]}/${data[measurement.fields[1].id]}`;
    } else {
      const field = measurement.fields[0];
      return `${data[field.id]}`;
    }
  };

  const getButtonState = () => {
    if (currentStatus !== "current") {
      return { color: "bg-muted text-muted-foreground cursor-not-allowed", label: "Horário não disponível" };
    }
    if (filledCount === 0) {
      return { color: "bg-muted text-muted-foreground cursor-not-allowed", label: "Preencha os sinais vitais" };
    }
    if (filledCount < totalCount) {
      return { color: "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg shadow-yellow-500/50", label: `Confirmar (${filledCount}/${totalCount})` };
    }
    return { color: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/50", label: "Confirmar Sinais Vitais ✓" };
  };

  const buttonState = getButtonState();

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden md:h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex h-full max-w-6xl flex-col px-3 py-2 md:px-4 md:py-3">
        {/* Futuristic Header with Gradient */}
        <div className="mb-2 space-y-2 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/5 to-background p-3 shadow-xl md:mb-3 md:space-y-2.5 md:p-4">
          {/* Top Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <div className={cn("rounded-lg bg-gradient-to-br p-1.5", period.color)}>
                  <PeriodIcon className="h-5 w-5 text-white" />
                </div>
                <h1 className={cn("text-xl font-extrabold md:text-2xl", period.textColor)}>
                  {period.label}
                </h1>
                <Badge variant="outline" className="gap-1 text-xs font-semibold">
                  <Clock className="h-3 w-3" />
                  {currentTime}
                </Badge>
              </div>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {stats.pending > 0 && (
                  <Badge className="gap-1 bg-gradient-to-r from-red-500 to-rose-500 text-[10px] font-bold shadow-lg shadow-red-500/30 md:text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    {stats.pending} urgente
                  </Badge>
                )}
                {stats.completed > 0 && (
                  <Badge variant="secondary" className="gap-1 bg-green-100 text-[10px] font-semibold text-green-700 md:text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    {stats.completed} concluídos
                  </Badge>
                )}
                {stats.missed > 0 && (
                  <Badge variant="secondary" className="gap-1 bg-amber-100 text-[10px] font-semibold text-amber-700 md:text-xs">
                    <XCircle className="h-3 w-3" />
                    {stats.missed} perdidos
                  </Badge>
                )}
                {timeUntilNext && (
                  <Badge variant="outline" className="gap-1 text-[10px] font-semibold md:text-xs">
                    <Timer className="h-3 w-3" />
                    {timeUntilNext}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Completion Circle */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg className="h-14 w-14 -rotate-90 md:h-16 md:w-16">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - completionPercentage / 100)}`}
                    className={cn(
                      "transition-all duration-500",
                      completionPercentage === 100 ? "text-green-500" : 
                      completionPercentage > 0 ? "text-yellow-500" : "text-muted"
                    )}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary md:text-base">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:gap-2">
            {scheduleHours.map((time) => {
              const status = getCurrentScheduleStatus(time);
              const data = scheduleData[time];
              const count = data ? Object.keys(data).length : 0;
              const isSelected = selectedSchedule === time;
              
              return (
                <button
                  key={time}
                  onClick={() => setSelectedSchedule(time)}
                  disabled={status === "future"}
                  className={cn(
                    "relative flex min-w-[70px] flex-col items-center gap-0.5 rounded-xl border-2 px-2.5 py-1.5 text-xs font-bold transition-all md:min-w-[80px] md:px-3 md:py-2 md:text-sm",
                    isSelected && status === "current" && "border-primary bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30",
                    isSelected && status === "past" && "border-muted-foreground bg-muted text-muted-foreground",
                    !isSelected && status === "current" && "border-primary/30 bg-primary/5 text-primary hover:border-primary hover:bg-primary/10",
                    !isSelected && status === "past" && "border-border bg-card text-muted-foreground hover:bg-muted/50",
                    status === "future" && "cursor-not-allowed border-dashed border-muted bg-muted/30 text-muted-foreground/50"
                  )}
                >
                  <div className="flex items-center gap-1">
                    {status === "current" && <Clock className="h-3 w-3" />}
                    {status === "past" && count === totalCount && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                    {status === "past" && count < totalCount && count > 0 && <AlertCircle className="h-3 w-3 text-amber-600" />}
                    {status === "past" && count === 0 && <XCircle className="h-3 w-3 text-red-600" />}
                    {status === "future" && <Lock className="h-3 w-3" />}
                    <span>{time}</span>
                  </div>
                  <span className="text-[10px] font-medium opacity-70">
                    {count}/{totalCount}
                  </span>
                  {status === "current" && isSelected && (
                    <div className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Grid 2x3 */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-2 pb-2 md:gap-2.5">
            {measurements.map((measurement) => {
              const Icon = measurement.icon;
              const isFilled = !!filledData[measurement.id];
              const displayValue = getDisplayValue(measurement.id, measurement);
              const isDisabled = currentStatus !== "current";
              const isViewOnly = currentStatus === "past";

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
                      onClick={() => !isDisabled && handleOpenDialog(measurement.id)}
                      className={cn(
                        "group relative flex cursor-pointer flex-col justify-between border-2 p-2 transition-all duration-200 md:p-2.5",
                        isFilled && `${measurement.borderColor} ${measurement.bgColor} shadow-md ${measurement.glowColor}`,
                        !isFilled && !isDisabled && "border-border bg-card hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg",
                        isDisabled && "cursor-not-allowed opacity-60"
                      )}
                    >
                      {/* Status Indicators */}
                      <div className="absolute right-1.5 top-1.5 flex gap-1">
                        {isViewOnly && <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
                        {isFilled && <CheckCircle2 className={cn("h-3.5 w-3.5", measurement.color)} />}
                      </div>

                      {/* Compact Content */}
                      <div className="flex items-center gap-1.5">
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", measurement.bgColor)}>
                          <Icon className={cn("h-4 w-4", measurement.color)} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[11px] font-bold leading-tight text-foreground md:text-xs">
                            {measurement.shortTitle}
                          </h3>
                          {isFilled ? (
                            <p className={cn("text-xs font-bold leading-tight md:text-sm", measurement.color)}>
                              {displayValue}
                            </p>
                          ) : (
                            <p className="text-[10px] leading-tight text-muted-foreground">
                              {isDisabled ? "Bloqueado" : "Toque aqui"}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className={cn("rounded-lg p-2", measurement.bgColor)}>
                          <Icon className={cn("h-6 w-6", measurement.color)} />
                        </div>
                        <div>
                          <div>{measurement.title}</div>
                          <div className="text-xs font-normal text-muted-foreground">
                            Horário: {selectedSchedule}
                          </div>
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        {isFilled
                          ? "Editando medição anterior. Os valores serão substituídos."
                          : "Registre sua medição atual"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => handleSubmit(measurement.id, e)} className="space-y-3 py-3">
                      {measurement.fields.map((field) => (
                        <div key={field.id} className="space-y-1.5">
                          <Label htmlFor={field.id} className="text-sm font-semibold">
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
                              className="h-10 pr-14 text-base"
                              required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                              {field.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                      <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(null)} className="flex-1">
                          Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-secondary font-bold shadow-lg">
                          Salvar
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </ScrollArea>

        {/* Confirm Button */}
        <div className="mt-2">
          <Button
            onClick={handleConfirm}
            disabled={filledCount === 0 || currentStatus !== "current"}
            className={cn("h-10 w-full text-sm font-bold transition-all md:h-11 md:text-base", buttonState.color)}
          >
            {filledCount === totalCount ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : filledCount > 0 ? (
              <AlertTriangle className="mr-2 h-4 w-4" />
            ) : null}
            {buttonState.label}
          </Button>
        </div>
      </div>

      {/* Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Campo já preenchido
            </AlertDialogTitle>
            <AlertDialogDescription>
              Este campo já foi preenchido anteriormente. Se continuar, o registro anterior será substituído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingMeasurementId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedToEdit} className="bg-gradient-to-r from-primary to-secondary">
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
              Campos incompletos
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você preencheu {filledCount} de {totalCount} campos. Recomendamos preencher todos os sinais vitais.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              alert(`Confirmado: ${filledCount}/${totalCount} sinais do horário ${selectedSchedule}`);
              setShowConfirmAlert(false);
            }} className="bg-gradient-to-r from-yellow-500 to-amber-500">
              Confirmar assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
