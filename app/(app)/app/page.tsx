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
import { Progress } from "@/components/ui/progress";
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
  Send,
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
    title: "Saturação O₂",
    shortTitle: "SpO₂",
    color: "text-sky-500",
    bgGradient: "from-sky-500 to-cyan-500",
    lightBg: "bg-sky-50",
    borderColor: "border-sky-200",
    fields: [{ id: "spo2", label: "SpO₂", placeholder: "98", unit: "%" }],
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
      peso: { weight: "70.4" },
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

  // Mock streak (days with 4+ sessions)
  const streak = 12;

  // Next alarm (mock)
  const nextAlarm = "18:00";

  // Time and period
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );

      // Check session timer
      if (activeSession) {
        const elapsed = now.getTime() - activeSession.startTime.getTime();
        const remaining = Math.max(0, SESSION_DURATION_MS - elapsed);
        setTimeLeft(remaining);

        // Auto-finalize when timer reaches 0
        if (remaining === 0 && !activeSession.finalized) {
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
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: new Date(),
      data: {},
      finalized: false,
    };
    setActiveSession(newSession);
    setTimeLeft(SESSION_DURATION_MS);
  };

  const finalizeSession = () => {
    if (activeSession) {
      const finalized = { ...activeSession, finalized: true };
      setTodaySessions((prev) => [...prev, finalized]);
      setActiveSession(null);
    }
  };

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

  // Format time left
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

  // Confirm button styling
  const confirmButtonStyle =
    filledCount === 0
      ? "bg-muted text-muted-foreground cursor-not-allowed"
      : filledCount < 6
        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl"
        : "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl";

  // ─────────────────────────────────────────────────────────────
  // IDLE STATE - No active session
  // ─────────────────────────────────────────────────────────────
  if (!activeSession) {
    return (
      <div className="flex min-h-[calc(100dvh-6rem)] flex-col md:min-h-[calc(100dvh-5.5rem)]">
        <div className="flex flex-1 flex-col px-4 py-5 md:mx-auto md:w-full md:max-w-2xl md:px-6 md:py-6">
          {/* ── Hero Header ── */}
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-2xl md:p-8",
              period.gradient
            )}
          >
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-white/5" />

            <div className="relative">
              {/* Greeting */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <PeriodIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">{period.label}!</h1>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{currentTime}</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="mb-6 flex flex-wrap gap-3">
                {/* Streak */}
                <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <div>
                    <p className="text-lg font-bold leading-none">{streak} dias</p>
                    <p className="text-xs text-white/70">de sequência</p>
                  </div>
                </div>

                {/* Next alarm */}
                <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
                  <Bell className="h-5 w-5 text-sky-300" />
                  <div>
                    <p className="text-lg font-bold leading-none">{nextAlarm}</p>
                    <p className="text-xs text-white/70">próximo lembrete</p>
                  </div>
                </div>
              </div>

              {/* Start button */}
              <Button
                onClick={startNewSession}
                size="lg"
                className="h-14 w-full gap-3 rounded-2xl bg-white text-lg font-bold text-gray-900 shadow-xl transition-all hover:scale-[1.02] hover:bg-white hover:shadow-2xl"
              >
                <Play className="h-6 w-6" />
                Iniciar Nova Medição
              </Button>
            </div>
          </div>

          {/* ── Today's Sessions ── */}
          <div className="mt-6 flex-1">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Sessões de Hoje
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {todaySessions.length} registros
              </span>
            </h2>

            {todaySessions.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <HeartPulse className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground">Nenhuma medição hoje</p>
                <p className="text-sm text-muted-foreground">
                  Inicie sua primeira medição do dia
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => {
                  const count = Object.keys(session.data).length;
                  const time = session.startTime.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isComplete = count === 6;

                  return (
                    <Card
                      key={session.id}
                      className={cn(
                        "flex items-center gap-4 border-2 p-4 transition-all",
                        isComplete
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-amber-200 bg-amber-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                          isComplete
                            ? "bg-gradient-to-br from-emerald-500 to-green-500"
                            : "bg-gradient-to-br from-amber-500 to-yellow-500"
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                          <AlertTriangle className="h-6 w-6 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-foreground">{time}</span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-semibold",
                              isComplete
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            )}
                          >
                            {count}/6 sinais
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isComplete ? "Sessão completa" : `Faltam ${6 - count} sinais`}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACTIVE SESSION STATE
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100dvh-6rem)] flex-col overflow-hidden md:h-[calc(100dvh-5.5rem)]">
      <div className="flex h-full flex-col px-4 py-4 md:mx-auto md:w-full md:max-w-4xl md:px-6">
        {/* ── Session Header ── */}
        <div
          className={cn(
            "relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-r p-4 text-white shadow-xl md:p-5",
            period.gradient
          )}
        >
          {/* Decorative */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between gap-4">
            {/* Left: Session info */}
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                  Sessão Ativa
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <span className="text-2xl font-bold tabular-nums md:text-3xl">
                    {formatTimeLeft(timeLeft)}
                  </span>
                </div>
                <span className="text-sm text-white/70">restantes</span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-sm font-bold">{filledCount}/6</span>
              </div>
            </div>

            {/* Right: Progress circle */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center md:h-24 md:w-24">
              <svg className="h-full w-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="36"
                  strokeWidth="6"
                  fill="none"
                  className="stroke-white/20"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="36"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPct / 100)}`}
                  className="stroke-white transition-all duration-700"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold md:text-3xl">{progressPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Vitals Grid ── */}
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {measurements.map((m) => {
            const Icon = m.icon;
            const filled = !!filledData[m.id];
            const val = getDisplayValue(m.id, m, filledData);

            return (
              <Dialog
                key={m.id}
                open={dialogOpen === m.id}
                onOpenChange={(o) => {
                  if (!o) setDialogOpen(null);
                }}
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
                  <div
                    className={cn(
                      "h-1 w-full bg-gradient-to-r",
                      m.bgGradient,
                      !filled && "opacity-40"
                    )}
                  />

                  <div className="flex flex-1 items-center gap-3 p-3 md:p-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md md:h-12 md:w-12",
                        m.bgGradient
                      )}
                    >
                      <Icon className="h-5 w-5 text-white md:h-6 md:w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground md:text-sm">
                        {m.shortTitle}
                      </span>
                      {filled ? (
                        <span className={cn("truncate text-lg font-bold md:text-xl", m.color)}>
                          {val}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Toque para registrar</span>
                      )}
                    </div>

                    {/* Status */}
                    {filled && <CheckCircle2 className={cn("h-5 w-5 shrink-0 md:h-6 md:w-6", m.color)} />}
                  </div>
                </Card>

                {/* Dialog */}
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div
                        className={cn(
                          "rounded-xl bg-gradient-to-br p-2.5 shadow-lg",
                          m.bgGradient
                        )}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg">{m.title}</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          Sessão iniciada às{" "}
                          {activeSession.startTime.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </DialogTitle>
                    <DialogDescription>
                      {filled
                        ? "Os valores anteriores serão substituídos."
                        : "Registre sua medição atual."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => onSubmit(m.id, e)} className="space-y-4 py-3">
                    {m.fields.map((f) => (
                      <div key={f.id} className="space-y-2">
                        <Label htmlFor={f.id} className="text-sm font-semibold">
                          {f.label}
                        </Label>
                        <div className="relative">
                          <Input
                            id={f.id}
                            name={f.id}
                            type="number"
                            step="0.1"
                            placeholder={f.placeholder}
                            defaultValue={filledData[m.id]?.[f.id] || ""}
                            className="h-12 pr-16 text-lg font-bold"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                            {f.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                    <DialogFooter className="gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(null)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className={cn(
                          "flex-1 bg-gradient-to-r font-bold text-white shadow-lg",
                          m.bgGradient
                        )}
                      >
                        Salvar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>

        {/* ── Confirm Button ── */}
        <div className="mt-4 pb-1">
          <Button
            onClick={handleFinalize}
            disabled={filledCount === 0}
            className={cn(
              "h-14 w-full gap-2 text-base font-bold transition-all md:h-16 md:text-lg",
              confirmButtonStyle
            )}
          >
            {filledCount === 6 && <CheckCircle2 className="h-5 w-5" />}
            {filledCount > 0 && filledCount < 6 && <AlertTriangle className="h-5 w-5" />}
            {filledCount === 0 && <Send className="h-5 w-5" />}
            {filledCount === 0
              ? "Preencha os sinais vitais"
              : filledCount < 6
                ? `Finalizar Sessão (${filledCount}/6)`
                : "Finalizar Sessão"}
          </Button>
        </div>
      </div>

      {/* ── Alert: Already filled ── */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Substituir Registro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Este sinal vital já foi preenchido nesta sessão. Deseja substituir os valores
              anteriores?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingId) setDialogOpen(pendingId);
                setShowWarning(false);
              }}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Substituir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Alert: Incomplete session ── */}
      <AlertDialog open={showIncompleteAlert} onOpenChange={setShowIncompleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sessão Incompleta
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você preencheu apenas {filledCount} de 6 sinais vitais. Deseja finalizar mesmo assim?
              Os dados serão salvos como estão.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar Preenchendo</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                finalizeSession();
                setShowIncompleteAlert(false);
              }}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Finalizar Assim Mesmo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
