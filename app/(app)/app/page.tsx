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
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes cooldown

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
  { date: "Sáb", completed: false, count: 0, isToday: true },
  { date: "Dom", completed: false, count: 0, isFuture: true },
];

// Mock data
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
  const [sessionStarted, setSessionStarted] = useState(false); // Timer only starts after first input
  const [todaySessions, setTodaySessions] = useState<Session[]>(mockTodaySessions);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_MS);
  const [cooldownEnd, setCooldownEnd] = useState<Date | null>(null);

  // UI state
  const [currentTime, setCurrentTime] = useState("");
  const [showMeasurementView, setShowMeasurementView] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Mock data
  const streak = 5;
  const nextAlarm = "18:00";

  // Check screen height for compact mode
  useEffect(() => {
    const checkHeight = () => {
      setIsCompact(window.innerHeight < 700);
    };
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  // Time and timer tick
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );

      // Only count down if session started (user added at least one measurement)
      if (activeSession && sessionStarted && !activeSession.finalized) {
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
  }, [activeSession, sessionStarted]);

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

  // Check if in cooldown
  const isInCooldown = cooldownEnd && new Date() < cooldownEnd;

  // Session actions
  const startNewSession = () => {
    if (isInCooldown) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      const newSession: Session = {
        id: Date.now().toString(),
        startTime: new Date(),
        data: {},
        finalized: false,
      };
      setActiveSession(newSession);
      setSessionStarted(false); // Timer won't start until first input
      setTimeLeft(SESSION_DURATION_MS);
      setShowMeasurementView(true);
      setIsTransitioning(false);
    }, 200);
  };

  const continueSession = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowMeasurementView(true);
      setIsTransitioning(false);
    }, 200);
  };

  const goBackToHome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowMeasurementView(false);
      setIsTransitioning(false);
    }, 200);
  };

  const finalizeSession = useCallback(() => {
    if (activeSession) {
      const finalized = { ...activeSession, finalized: true };
      setTodaySessions((prev) => [...prev, finalized]);
      setActiveSession(null);
      setSessionStarted(false);
      setShowMeasurementView(false);
      setCooldownEnd(new Date(Date.now() + COOLDOWN_MS));
    }
  }, [activeSession]);

  const handleFinalize = () => {
    if (!activeSession) return;
    const count = Object.keys(activeSession.data).length;
    if (count < 6 && count > 0) {
      setShowIncompleteAlert(true);
    } else if (count === 6) {
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
    
    const newData = { ...activeSession.data, [id]: vals };
    const updatedSession = {
      ...activeSession,
      data: newData,
      startTime: sessionStarted ? activeSession.startTime : new Date(), // Start timer on first input
    };
    
    setActiveSession(updatedSession);
    
    // Start timer on first input
    if (!sessionStarted) {
      setSessionStarted(true);
      setTimeLeft(SESSION_DURATION_MS);
    }
    
    setDialogOpen(null);

    // Auto-finalize when all 6 are filled
    if (Object.keys(newData).length === 6) {
      setTimeout(() => {
        const finalized = { ...updatedSession, finalized: true };
        setTodaySessions((prev) => [...prev, finalized]);
        setActiveSession(null);
        setSessionStarted(false);
        setShowMeasurementView(false);
        setCooldownEnd(new Date(Date.now() + COOLDOWN_MS));
      }, 500);
    }
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

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSessionTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  // Current session data
  const filledData = activeSession?.data || {};
  const filledCount = Object.keys(filledData).length;
  const progressPct = Math.round((filledCount / 6) * 100);

  const getButtonStyle = () => {
    if (filledCount === 0) return "bg-muted text-muted-foreground";
    if (filledCount < 6) return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25";
    return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25";
  };

  // ─────────────────────────────────────────────────────────────
  // MEASUREMENT VIEW
  // ─────────────────────────────────────────────────────────────
  if (showMeasurementView && activeSession) {
    return (
      <div
        className={cn(
          "flex h-[calc(100dvh-5rem)] flex-col overflow-hidden transition-all duration-200 md:h-[calc(100dvh-5.5rem)]",
          isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <div className="flex h-full flex-col px-4 py-3 md:mx-auto md:w-full md:max-w-4xl md:px-6">
          {/* Header */}
          <div
            className={cn(
              "relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-r p-4 text-white shadow-xl",
              period.gradient
            )}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />

            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBackToHome}
                  className="h-9 gap-2 rounded-xl bg-white/20 px-3 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>

                {sessionStarted ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-bold shadow-lg">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    Em andamento
                  </div>
                ) : (
                  <div className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                    Aguardando medição
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  {sessionStarted ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5" />
                        <span className="text-3xl font-bold tabular-nums">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/80">para finalizar</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold">Nova Medição</p>
                      <p className="mt-1 text-sm text-white/80">
                        O timer inicia ao registrar o primeiro sinal
                      </p>
                    </>
                  )}
                </div>

                {/* Progress Circle */}
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle cx="50%" cy="50%" r="28" strokeWidth="4" fill="none" className="stroke-white/20" />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="28"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPct / 100)}`}
                      className="stroke-white transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-lg font-extrabold">{filledCount}/6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
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
                    <div className={cn("h-1 w-full bg-gradient-to-r", m.bgGradient, !filled && "opacity-30")} />

                    <div className="flex flex-1 items-center gap-2.5 p-2.5">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow",
                          m.bgGradient
                        )}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-muted-foreground">{m.shortTitle}</p>
                        {filled ? (
                          <p className={cn("truncate text-base font-bold", m.color)}>{val}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Toque</p>
                        )}
                      </div>

                      {filled && <CheckCircle2 className={cn("h-4 w-4 shrink-0", m.color)} />}
                    </div>
                  </Card>

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
              className={cn("h-12 w-full font-bold transition-all", getButtonStyle())}
            >
              {filledCount === 6 ? (
                <CheckCircle2 className="mr-2 h-5 w-5" />
              ) : filledCount > 0 ? (
                <AlertTriangle className="mr-2 h-5 w-5" />
              ) : null}
              {filledCount === 0
                ? "Registre pelo menos 1 sinal"
                : filledCount < 6
                  ? `Finalizar (${filledCount}/6)`
                  : "Sessão Completa"}
            </Button>
          </div>
        </div>

        {/* Dialogs */}
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

        <AlertDialog open={showIncompleteAlert} onOpenChange={setShowIncompleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Sinais incompletos
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você preencheu apenas {filledCount} de 6 sinais vitais. Deseja finalizar mesmo assim?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuar preenchendo</AlertDialogCancel>
              <AlertDialogAction onClick={finalizeSession}>
                Finalizar assim mesmo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // HOME VIEW (Idle State)
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-5rem)] flex-col overflow-hidden px-4 py-3 transition-all duration-200 md:mx-auto md:h-[calc(100dvh-5.5rem)] md:max-w-2xl md:px-6",
        isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
      )}
    >
      {/* Hero Header */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-r text-white shadow-xl",
          period.gradient,
          isCompact ? "mb-3 p-3" : "mb-4 p-4"
        )}
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <PeriodIcon className="h-5 w-5" />
                <span className={cn("font-bold", isCompact ? "text-lg" : "text-xl")}>{period.label}</span>
              </div>
              <p className={cn("mt-1 font-medium text-white/80", isCompact ? "text-xs" : "text-sm")}>
                {currentTime}
              </p>
            </div>

            <div className={cn("text-right", isCompact ? "space-y-0.5" : "space-y-1")}>
              <div className="flex items-center justify-end gap-1.5 text-xs text-white/80">
                <Bell className="h-3.5 w-3.5" />
                Próximo: {nextAlarm}
              </div>
              <div className="flex items-center justify-end gap-1.5 text-xs text-white/80">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Hoje: {todaySessions.length} sessões
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className={cn(isCompact ? "mt-3" : "mt-4")}>
            {activeSession && !activeSession.finalized ? (
              <Button
                onClick={continueSession}
                size="lg"
                className="h-12 w-full gap-3 rounded-xl bg-white font-bold text-foreground shadow-lg transition-all hover:bg-white/90 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                    <Timer className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span>Continuar Medição</span>
                </div>
                {sessionStarted && (
                  <span className="ml-auto rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-bold text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                )}
              </Button>
            ) : isInCooldown ? (
              <Button
                disabled
                size="lg"
                className="h-12 w-full gap-3 rounded-xl bg-white/50 font-bold text-white/80"
              >
                <Clock className="h-5 w-5" />
                Aguarde para nova medição
              </Button>
            ) : (
              <Button
                onClick={startNewSession}
                size="lg"
                className="h-12 w-full gap-3 rounded-xl bg-white font-bold text-foreground shadow-lg transition-all hover:bg-white/90 hover:scale-[1.02]"
              >
                <Play className="h-5 w-5 fill-current" />
                Iniciar Nova Medição
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <Card className={cn("border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50", isCompact ? "mb-3 p-3" : "mb-4 p-4")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-orange-600">{streak} dias</p>
              <p className="text-xs font-medium text-orange-600/70">Ofensiva atual</p>
            </div>
          </div>

          {/* Mini streak map */}
          <div className="flex items-center gap-1">
            {mockStreakDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                    day.completed
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow"
                      : day.isToday
                        ? "border-2 border-dashed border-orange-400 text-orange-500"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {day.completed ? day.count : day.isToday ? "?" : "-"}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Today Sessions */}
      <div className="min-h-0 flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">Hoje</span>
          <span className="text-xs text-muted-foreground">{todaySessions.length} aferições</span>
        </div>

        <ScrollArea className="h-full pr-2">
          <div className="space-y-2 pb-2">
            {todaySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted py-8 text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Nenhuma medição hoje</p>
                <p className="text-xs text-muted-foreground">Toque em Iniciar para começar</p>
              </div>
            ) : (
              todaySessions.map((session) => {
                const count = Object.keys(session.data).length;
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-white shadow",
                        count === 6
                          ? "bg-gradient-to-br from-emerald-500 to-green-500"
                          : "bg-gradient-to-br from-amber-500 to-yellow-500"
                      )}
                    >
                      {count}/6
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {formatSessionTime(session.startTime)}
                      </p>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        {measurements.map((m) => {
                          const val = getCompactValue(m.id, m, session.data);
                          const hasFilled = session.data[m.id];
                          return (
                            <span
                              key={m.id}
                              className={cn(
                                "text-xs font-medium",
                                hasFilled ? m.color : "text-muted-foreground"
                              )}
                            >
                              {m.shortTitle}:{val}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {count === 6 ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
