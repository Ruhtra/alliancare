"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  Play,
  Flame,
  Bell,
  Timer,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type MeasurementValue = { [key: string]: string };
type FilledData = { [id: string]: MeasurementValue };
type Session = {
  id: string;
  startTime: Date;
  data: FilledData;
  finalized: boolean;
};

// Constants
const SESSION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

const measurements = [
  {
    id: "pressao",
    icon: Gauge,
    title: "Pressão Arterial",
    shortTitle: "PA",
    color: "text-rose-500",
    bgGradient: "from-rose-500 to-pink-500",
    lightBg: "bg-rose-50",
    borderColor: "border-rose-200",
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
    color: "text-pink-500",
    bgGradient: "from-pink-500 to-fuchsia-500",
    lightBg: "bg-pink-50",
    borderColor: "border-pink-200",
    fields: [{ id: "bpm", label: "BPM", placeholder: "72", unit: "bpm" }],
  },
  {
    id: "temperatura",
    icon: Thermometer,
    title: "Temperatura",
    shortTitle: "TEMP",
    color: "text-orange-500",
    bgGradient: "from-orange-500 to-amber-500",
    lightBg: "bg-orange-50",
    borderColor: "border-orange-200",
    fields: [{ id: "temp", label: "Temperatura", placeholder: "36.5", unit: "°C" }],
  },
  {
    id: "saturacao",
    icon: Droplet,
    title: "Saturação O2",
    shortTitle: "SpO2",
    color: "text-sky-500",
    bgGradient: "from-sky-500 to-cyan-500",
    lightBg: "bg-sky-50",
    borderColor: "border-sky-200",
    fields: [{ id: "spo2", label: "SpO2", placeholder: "98", unit: "%" }],
  },
  {
    id: "peso",
    icon: Weight,
    title: "Peso",
    shortTitle: "PESO",
    color: "text-emerald-500",
    bgGradient: "from-emerald-500 to-teal-500",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
    fields: [{ id: "weight", label: "Peso", placeholder: "70.5", unit: "kg" }],
  },
  {
    id: "dor",
    icon: AlertCircle,
    title: "Nível de Dor",
    shortTitle: "DOR",
    color: "text-amber-500",
    bgGradient: "from-amber-500 to-yellow-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
    fields: [{ id: "pain", label: "Dor (0-10)", placeholder: "0", unit: "/10" }],
  },
];

// Mock streak data (last 7 days)
const mockStreakDays = [
  { date: "Seg", completed: true, count: 4 },
  { date: "Ter", completed: true, count: 5 },
  { date: "Qua", completed: true, count: 4 },
  { date: "Qui", completed: true, count: 6 },
  { date: "Sex", completed: true, count: 4 },
  { date: "Sáb", completed: false, count: 0 }, // today - in progress
  { date: "Dom", completed: false, count: 0 }, // future
];

// Mock data for demonstration
const mockTodaySessions: Session[] = [
  {
    id: "1",
    startTime: new Date(new Date().setHours(8, 12, 0, 0)),
    data: {
      pressao: { sistolica: "120", diastolica: "80" },
      frequencia: { bpm: "72" },
      temperatura: { temp: "36.5" },
      saturacao: { spo2: "98" },
      peso: { weight: "70.5" },
      dor: { pain: "2" },
    },
    finalized: true,
  },
  {
    id: "2",
    startTime: new Date(new Date().setHours(12, 5, 0, 0)),
    data: {
      pressao: { sistolica: "118", diastolica: "78" },
      frequencia: { bpm: "68" },
      temperatura: { temp: "36.4" },
      saturacao: { spo2: "99" },
    },
    finalized: true,
  },
];

export default function HomePage() {
  // Session state
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [todaySessions, setTodaySessions] = useState<Session[]>(mockTodaySessions);
  const [timeLeft, setTimeLeft] = useState(0);

  // UI state
  const [currentTime, setCurrentTime] = useState("");
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mock streak (days with 4+ sessions)
  const streak = 5;
  const nextAlarm = "18:00";

  // Time and period
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );

      if (activeSession && !activeSession.finalized) {
        const elapsed = now.getTime() - activeSession.startTime.getTime();
        const remaining = Math.max(0, SESSION_DURATION_MS - elapsed);
        setTimeLeft(remaining);

        if (remaining === 0) {
          finalizeSession();
        }
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeSession]);

  const getPeriod = useCallback(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12)
      return { label: "Bom dia", icon: Sunrise, gradient: "from-amber-400 via-orange-500 to-rose-500" };
    if (h >= 12 && h < 18)
      return { label: "Boa tarde", icon: Sun, gradient: "from-orange-400 via-rose-500 to-pink-500" };
    return { label: "Boa noite", icon: Moon, gradient: "from-indigo-500 via-purple-500 to-pink-500" };
  }, []);

  const period = getPeriod();
  const PeriodIcon = period.icon;

  // Session actions
  const startNewSession = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newSession: Session = {
        id: Date.now().toString(),
        startTime: new Date(),
        data: {},
        finalized: false,
      };
      setActiveSession(newSession);
      setTimeLeft(SESSION_DURATION_MS);
      setIsTransitioning(false);
    }, 300);
  };

  const continueSession = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const goBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const finalizeSession = useCallback(() => {
    if (activeSession) {
      const finalized = { ...activeSession, finalized: true };
      setTodaySessions((prev) => [...prev, finalized]);
      setActiveSession(null);
    }
  }, [activeSession]);

  const handleFinalize = () => {
    if (!activeSession) return;
    const count = Object.keys(activeSession.data).length;
    if (count < 6) {
      setShowIncompleteAlert(true);
    } else {
      finalizeSession();
    }
  };

  // Measurement actions
  const openDialog = (id: string) => {
    if (!activeSession) return;
    if (activeSession.data[id]) {
      setPendingId(id);
      setShowWarning(true);
    } else {
      setDialogOpen(id);
    }
  };

  const onSubmit = (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeSession) return;
    const fd = new FormData(e.currentTarget);
    const vals: MeasurementValue = {};
    fd.forEach((v, k) => (vals[k] = v.toString()));
    setActiveSession({
      ...activeSession,
      data: { ...activeSession.data, [id]: vals },
    });
    setDialogOpen(null);
  };

  const getDisplayValue = (id: string, m: (typeof measurements)[0], data: FilledData) => {
    const d = data[id];
    if (!d) return null;
    return m.fields.length === 2
      ? `${d[m.fields[0].id]}/${d[m.fields[1].id]}`
      : `${d[m.fields[0].id]}${m.fields[0].unit}`;
  };

  const getCompactValue = (id: string, m: (typeof measurements)[0], data: FilledData) => {
    const d = data[id];
    if (!d) return "-";
    return m.fields.length === 2
      ? `${d[m.fields[0].id]}/${d[m.fields[1].id]}`
      : d[m.fields[0].id];
  };

  const formatTimeLeft = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Current session data
  const filledData = activeSession?.data || {};
  const filledCount = Object.keys(filledData).length;
  const progressPct = Math.round((filledCount / 6) * 100);

  // Check if there's a paused session (activeSession exists but user is on home view)
  const [showMeasurementView, setShowMeasurementView] = useState(false);

  useEffect(() => {
    if (activeSession && !activeSession.finalized) {
      setShowMeasurementView(true);
    }
  }, []);

  // Confirm button styling
  const getButtonStyle = () => {
    if (filledCount === 0) return "bg-muted text-muted-foreground cursor-not-allowed";
    if (filledCount < 6) return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25";
    return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25";
  };

  // ─────────────────────────────────────────────────────────────
  // MEASUREMENT VIEW (Active Session - Filling Data)
  // ─────────────────────────────────────────────────────────────
  if (activeSession && showMeasurementView) {
    return (
      <div
        className={cn(
          "flex h-[calc(100dvh-6rem)] flex-col overflow-hidden transition-all duration-300 md:h-[calc(100dvh-5.5rem)]",
          isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <div className="flex h-full flex-col px-4 py-3 md:mx-auto md:w-full md:max-w-4xl md:px-6">
          {/* Session Header with Back Button */}
          <div
            className={cn(
              "relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-r p-4 text-white shadow-xl",
              period.gradient
            )}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />

            <div className="relative">
              {/* Back button and session status */}
              <div className="mb-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setShowMeasurementView(false);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                  className="h-9 gap-2 rounded-xl bg-white/20 px-3 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>

                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                  Sessão Ativa
                </div>
              </div>

              {/* Timer and Progress */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    <span className="text-3xl font-bold tabular-nums">
                      {formatTimeLeft(timeLeft)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/80">restantes para finalizar</p>
                </div>

                {/* Progress Circle */}
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle cx="50%" cy="50%" r="34" strokeWidth="5" fill="none" className="stroke-white/20" />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="34"
                      strokeWidth="5"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPct / 100)}`}
                      className="stroke-white transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold">{filledCount}/6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid flex-1 grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
            {measurements.map((m) => {
              const Icon = m.icon;
              const filled = !!filledData[m.id];
              const val = getDisplayValue(m.id, m, filledData);

              return (
                <Dialog
                  key={m.id}
                  open={dialogOpen === m.id}
                  onOpenChange={(o) => !o && setDialogOpen(null)}
                >
                  <Card
                    onClick={() => openDialog(m.id)}
                    className={cn(
                      "group relative flex cursor-pointer flex-col overflow-hidden border-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98]",
                      filled
                        ? `${m.borderColor} ${m.lightBg} shadow-md`
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    {/* Top accent bar */}
                    <div className={cn("h-1.5 w-full bg-gradient-to-r", m.bgGradient, !filled && "opacity-30")} />

                    <div className="flex flex-1 items-center gap-3 p-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                          m.bgGradient
                        )}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">{m.shortTitle}</p>
                        {filled ? (
                          <p className={cn("truncate text-lg font-bold", m.color)}>{val}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Toque para registrar</p>
                        )}
                      </div>

                      {/* Status */}
                      {filled && <CheckCircle2 className={cn("h-5 w-5 shrink-0", m.color)} />}
                    </div>
                  </Card>

                  {/* Dialog */}
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", m.bgGradient)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        {m.title}
                      </DialogTitle>
                      <DialogDescription>Registre sua medição atual</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={(e) => onSubmit(m.id, e)} className="space-y-4 py-4">
                      {m.fields.map((f) => (
                        <div key={f.id} className="space-y-2">
                          <Label htmlFor={f.id} className="font-semibold">{f.label}</Label>
                          <div className="relative">
                            <Input
                              id={f.id}
                              name={f.id}
                              type="number"
                              step="any"
                              placeholder={f.placeholder}
                              className="h-12 pr-16 text-lg"
                              required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                              {f.unit}
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{currentTime}</p>
                          <p className="text-xs text-muted-foreground">Horário do registro</p>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="submit" className={cn("w-full bg-gradient-to-r", m.bgGradient)}>
                          Salvar Medição
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>

          {/* Finalize Button */}
          <div className="mt-3">
            <Button
              onClick={handleFinalize}
              disabled={filledCount === 0}
              className={cn("h-14 w-full text-base font-bold transition-all", getButtonStyle())}
            >
              {filledCount === 6 ? (
                <CheckCircle2 className="mr-2 h-5 w-5" />
              ) : filledCount > 0 ? (
                <AlertTriangle className="mr-2 h-5 w-5" />
              ) : null}
              {filledCount === 0
                ? "Preencha pelo menos 1 sinal"
                : filledCount < 6
                  ? `Finalizar (${filledCount}/6 preenchidos)`
                  : "Finalizar Sessão Completa"}
            </Button>
          </div>
        </div>

        {/* Warning Dialog */}
        <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Substituir medição?</AlertDialogTitle>
              <AlertDialogDescription>
                Você já registrou este sinal vital. Deseja substituir o valor anterior?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowWarning(false);
                  if (pendingId) setDialogOpen(pendingId);
                }}
              >
                Substituir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Incomplete Alert */}
        <AlertDialog open={showIncompleteAlert} onOpenChange={setShowIncompleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Sessão Incompleta
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você preencheu apenas {filledCount} de 6 sinais vitais. Deseja finalizar mesmo assim?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuar Preenchendo</AlertDialogCancel>
              <AlertDialogAction onClick={finalizeSession} className="bg-amber-500 hover:bg-amber-600">
                Finalizar Assim Mesmo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // HOME VIEW (Idle or Paused Session)
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex min-h-[calc(100dvh-6rem)] flex-col transition-all duration-300 md:min-h-[calc(100dvh-5.5rem)]",
        isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
      )}
    >
      <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:mx-auto md:w-full md:max-w-2xl md:px-6 md:py-5">
        {/* ══════════════════════════════════════════════════════════
            HERO HEADER - Greeting + Time + Next Alarm
        ══════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-2xl md:p-6",
            period.gradient
          )}
        >
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            {/* Greeting Row */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
                <PeriodIcon className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{period.label}!</h1>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span className="text-lg font-semibold">{currentTime}</span>
                </div>
              </div>
            </div>

            {/* Info Pills */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
                <Bell className="h-4 w-4 text-sky-200" />
                <span className="text-sm font-medium">Próximo: {nextAlarm}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                <span className="text-sm font-medium">{todaySessions.length} sessões hoje</span>
              </div>
            </div>

            {/* Continue/Start Button */}
            {activeSession && !activeSession.finalized ? (
              <Button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setShowMeasurementView(true);
                    setIsTransitioning(false);
                  }, 300);
                }}
                size="lg"
                className="mt-5 h-14 w-full gap-3 rounded-2xl bg-white text-lg font-bold text-gray-900 shadow-xl transition-all hover:scale-[1.02] hover:bg-white"
              >
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  <span>Continuar Medição</span>
                </div>
                <div className="ml-auto flex items-center gap-2 rounded-lg bg-rose-100 px-2 py-1 text-rose-600">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-bold tabular-nums">{formatTimeLeft(timeLeft)}</span>
                </div>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  startNewSession();
                  setTimeout(() => setShowMeasurementView(true), 300);
                }}
                size="lg"
                className="mt-5 h-14 w-full gap-3 rounded-2xl bg-white text-lg font-bold text-gray-900 shadow-xl transition-all hover:scale-[1.02] hover:bg-white"
              >
                <Play className="h-6 w-6" />
                Iniciar Nova Medição
              </Button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            STREAK CARD - Visual Map
        ══════════════════════════════════════════════════════════ */}
        <Card className="overflow-hidden border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
          <div className="p-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Ofensiva</h2>
                  <p className="text-sm text-muted-foreground">{streak} dias consecutivos</p>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-xl font-extrabold text-white shadow-lg">
                {streak}
              </div>
            </div>

            {/* Streak Visual Map */}
            <div className="flex items-center justify-between gap-1">
              {mockStreakDays.map((day, i) => {
                const isToday = i === 5;
                const isFuture = i > 5;
                const isCompleted = day.completed;

                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center">
                    {/* Circle */}
                    <div className="relative">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all md:h-10 md:w-10",
                          isCompleted
                            ? "border-orange-400 bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md"
                            : isToday
                              ? "border-orange-400 bg-orange-100 text-orange-600"
                              : "border-gray-200 bg-gray-100 text-gray-400"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isToday ? (
                          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                        )}
                      </div>

                      {/* Connecting line */}
                      {i < mockStreakDays.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-full top-1/2 h-0.5 w-[calc(100%-2px)] -translate-y-1/2",
                            i < 5 ? "bg-gradient-to-r from-orange-400 to-amber-400" : "bg-gray-200"
                          )}
                          style={{ width: "calc(100% + 0.25rem)" }}
                        />
                      )}
                    </div>

                    {/* Day label */}
                    <span
                      className={cn(
                        "mt-1.5 text-xs font-medium",
                        isToday ? "text-orange-600" : isFuture ? "text-gray-400" : "text-muted-foreground"
                      )}
                    >
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Streak message */}
            <div className="mt-3 rounded-xl bg-white/60 p-3 text-center">
              <p className="text-sm text-muted-foreground">
                {streak > 0 ? (
                  <>
                    Continue assim! Mais <span className="font-bold text-orange-600">{7 - streak} dias</span> para completar a semana.
                  </>
                ) : (
                  "Comece sua ofensiva fazendo 4 medições hoje!"
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* ══════════════════════════════════════════════════════════
            TODAY'S SESSIONS CARD
        ══════════════════════════════════════════════════════════ */}
        <Card className="flex flex-1 flex-col overflow-hidden border-2 shadow-lg">
          <div className="border-b bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Aferições de Hoje</h2>
                  <p className="text-sm text-muted-foreground">{todaySessions.length} registros</p>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-3">
            {todaySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <HeartPulse className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground">Nenhuma medição hoje</p>
                <p className="text-sm text-muted-foreground">Inicie sua primeira sessão</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaySessions.map((session) => {
                  const count = Object.keys(session.data).length;
                  const time = session.startTime.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isComplete = count === 6;

                  return (
                    <div
                      key={session.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border-2 p-3 transition-all",
                        isComplete
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-amber-200 bg-amber-50/50"
                      )}
                    >
                      {/* Time + Status */}
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          isComplete
                            ? "bg-gradient-to-br from-emerald-500 to-green-500"
                            : "bg-gradient-to-br from-amber-500 to-yellow-500"
                        )}
                      >
                        <span className="text-xs font-bold text-white">{time}</span>
                      </div>

                      {/* Values Preview */}
                      <div className="flex flex-1 flex-wrap items-center gap-1.5">
                        {measurements.map((m) => {
                          const hasValue = !!session.data[m.id];
                          const value = getCompactValue(m.id, m, session.data);

                          return (
                            <div
                              key={m.id}
                              className={cn(
                                "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
                                hasValue ? `${m.lightBg} ${m.color}` : "bg-muted text-muted-foreground"
                              )}
                            >
                              <span className="font-bold">{m.shortTitle}</span>
                              <span>{value}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Count Badge */}
                      <div
                        className={cn(
                          "shrink-0 rounded-full px-2 py-1 text-xs font-bold",
                          isComplete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {count}/6
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
