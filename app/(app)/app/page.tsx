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
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MeasurementValue = { [key: string]: string };
type ScheduleData = { [time: string]: FilledData };
type FilledData = { [key: string]: MeasurementValue };

const scheduleHours = ["08:00", "12:00", "18:00", "21:00"];

const measurements = [
  {
    id: "pressao",
    icon: Gauge,
    title: "Pressão Arterial",
    shortTitle: "PA",
    color: "text-rose-500",
    bgFrom: "from-rose-500",
    bgTo: "to-pink-400",
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
    bgFrom: "from-pink-500",
    bgTo: "to-fuchsia-400",
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
    bgFrom: "from-orange-500",
    bgTo: "to-amber-400",
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
    bgFrom: "from-sky-500",
    bgTo: "to-blue-400",
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
    bgFrom: "from-emerald-500",
    bgTo: "to-teal-400",
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
    bgFrom: "from-amber-500",
    bgTo: "to-yellow-400",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
    fields: [{ id: "pain", label: "Dor (0-10)", placeholder: "0", unit: "/10" }],
  },
];

export default function HomePage() {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));

      const nowMins = now.getHours() * 60 + now.getMinutes();
      let currentSlot: string | null = null;
      let nextSlot: string | null = null;

      for (let i = 0; i < scheduleHours.length; i++) {
        const [h, m] = scheduleHours[i].split(":").map(Number);
        const slotMins = h * 60 + m;
        if (nowMins >= slotMins - 30 && nowMins < slotMins + 90) {
          currentSlot = scheduleHours[i];
          nextSlot = scheduleHours[i + 1] || null;
          break;
        }
        if (nowMins < slotMins) {
          nextSlot = scheduleHours[i];
          currentSlot = scheduleHours[i - 1] || null;
          break;
        }
      }
      if (!currentSlot && !nextSlot) currentSlot = scheduleHours[scheduleHours.length - 1];
      if (currentSlot && !selectedSchedule) setSelectedSchedule(currentSlot);

      if (nextSlot) {
        const [nh, nm] = nextSlot.split(":").map(Number);
        const diff = nh * 60 + nm - nowMins;
        if (diff > 0) {
          setCountdown(`${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, "0")}m`);
        } else {
          setCountdown("");
        }
      } else {
        setCountdown("");
      }
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [selectedSchedule]);

  const getSlotStatus = (time: string) => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const [h, m] = time.split(":").map(Number);
    const slotMins = h * 60 + m;
    if (nowMins >= slotMins - 30 && nowMins < slotMins + 90) return "current";
    if (nowMins >= slotMins + 90) return "past";
    return "future";
  };

  const getPeriod = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return { label: "Bom dia", icon: Sunrise, gradient: "from-amber-500 to-orange-500" };
    if (h >= 12 && h < 18) return { label: "Boa tarde", icon: Sun, gradient: "from-orange-400 to-rose-400" };
    return { label: "Boa noite", icon: Moon, gradient: "from-blue-500 to-indigo-500" };
  };

  const getStats = () => {
    let done = 0, missed = 0, pending = 0;
    scheduleHours.forEach((t) => {
      const st = getSlotStatus(t);
      const c = scheduleData[t] ? Object.keys(scheduleData[t]).length : 0;
      if (st === "past") { c === 6 ? done++ : missed++; }
      else if (st === "current") pending++;
    });
    return { done, missed, pending, total: scheduleHours.length };
  };

  const filledData = scheduleData[selectedSchedule] || {};
  const filledCount = Object.keys(filledData).length;
  const pct = Math.round((filledCount / 6) * 100);
  const period = getPeriod();
  const PIcon = period.icon;
  const stats = getStats();
  const slotStatus = getSlotStatus(selectedSchedule);

  const openDialog = (id: string) => {
    if (slotStatus !== "current") return;
    if (filledData[id]) { setPendingId(id); setShowWarning(true); }
    else setDialogOpen(id);
  };

  const onSubmit = (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const vals: MeasurementValue = {};
    fd.forEach((v, k) => (vals[k] = v.toString()));
    setScheduleData((p) => ({ ...p, [selectedSchedule]: { ...p[selectedSchedule], [id]: vals } }));
    setDialogOpen(null);
  };

  const getVal = (id: string, m: (typeof measurements)[0]) => {
    const d = filledData[id];
    if (!d) return null;
    return m.fields.length === 2
      ? `${d[m.fields[0].id]}/${d[m.fields[1].id]}`
      : `${d[m.fields[0].id]}${m.fields[0].unit}`;
  };

  const confirmColor =
    slotStatus !== "current" ? "bg-muted text-muted-foreground"
      : filledCount === 0 ? "bg-muted text-muted-foreground"
        : filledCount < 6 ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-lg shadow-amber-500/25"
          : "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/25";

  return (
    <div className="flex h-[calc(100dvh-6rem)] flex-col overflow-hidden md:h-[calc(100dvh-5.5rem)]">
      <div className="flex h-full flex-col px-4 py-3 md:mx-auto md:max-w-3xl md:px-6 md:py-4">

        {/* ── Hero Header ── */}
        <div className={cn("relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-r p-5 text-white shadow-xl md:mb-5 md:p-6", period.gradient)}>
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <PIcon className="h-6 w-6" />
                <h1 className="text-xl font-bold md:text-2xl">{period.label}</h1>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/90">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">{currentTime}</span>
                {countdown && (
                  <>
                    <span className="text-white/50">|</span>
                    <Timer className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Próx. em {countdown}</span>
                  </>
                )}
              </div>

              {/* Mini stats row */}
              <div className="flex flex-wrap gap-2 pt-1">
                {stats.pending > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-300" />
                    {stats.pending} agora
                  </span>
                )}
                {stats.done > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
                    <CheckCircle2 className="h-3 w-3" />
                    {stats.done} feitos
                  </span>
                )}
                {stats.missed > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-400/30 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
                    <XCircle className="h-3 w-3" />
                    {stats.missed} perdidos
                  </span>
                )}
              </div>
            </div>

            {/* Circular progress */}
            <div className="relative flex-shrink-0">
              <svg className="h-16 w-16 -rotate-90 md:h-20 md:w-20">
                <circle cx="50%" cy="50%" r="28" strokeWidth="5" fill="none" className="stroke-white/20" />
                <circle
                  cx="50%" cy="50%" r="28" strokeWidth="5" fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
                  className="stroke-white transition-all duration-700"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold leading-none md:text-xl">{pct}%</span>
              </div>
            </div>
          </div>

          {/* Schedule Slot Selector */}
          <div className="relative mt-4 flex gap-2 overflow-x-auto">
            {scheduleHours.map((time) => {
              const st = getSlotStatus(time);
              const sel = selectedSchedule === time;
              const cnt = scheduleData[time] ? Object.keys(scheduleData[time]).length : 0;
              return (
                <button
                  key={time}
                  disabled={st === "future"}
                  onClick={() => setSelectedSchedule(time)}
                  className={cn(
                    "flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-bold transition-all md:min-w-[84px] md:text-sm",
                    sel && "bg-white text-gray-900 shadow-lg",
                    !sel && st === "current" && "bg-white/20 text-white hover:bg-white/30",
                    !sel && st === "past" && "bg-white/10 text-white/70 hover:bg-white/20",
                    st === "future" && "cursor-not-allowed bg-white/5 text-white/30"
                  )}
                >
                  <div className="flex items-center gap-1">
                    {st === "current" && sel && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />}
                    {st === "current" && !sel && <Clock className="h-3 w-3" />}
                    {st === "past" && cnt === 6 && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                    {st === "past" && cnt < 6 && cnt > 0 && <AlertCircle className="h-3 w-3 text-amber-500" />}
                    {st === "past" && cnt === 0 && <XCircle className="h-3 w-3 text-red-400" />}
                    {st === "future" && <Lock className="h-3 w-3" />}
                    <span>{time}</span>
                  </div>
                  <span className={cn("text-[10px] font-medium", sel ? "text-gray-500" : "text-white/60")}>
                    {cnt}/6
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Vitals Grid ── */}
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {measurements.map((m) => {
            const Icon = m.icon;
            const filled = !!filledData[m.id];
            const val = getVal(m.id, m);
            const disabled = slotStatus !== "current";
            const viewOnly = slotStatus === "past";

            return (
              <Dialog
                key={m.id}
                open={dialogOpen === m.id}
                onOpenChange={(o) => { if (!o) setDialogOpen(null); }}
              >
                <Card
                  onClick={() => openDialog(m.id)}
                  className={cn(
                    "group relative flex cursor-pointer flex-col overflow-hidden border-2 transition-all duration-200",
                    filled
                      ? `${m.borderColor} ${m.lightBg} shadow-md`
                      : "border-border hover:border-primary/20 hover:shadow-md",
                    disabled && !viewOnly && "cursor-not-allowed opacity-50",
                    viewOnly && "cursor-default"
                  )}
                >
                  {/* Colored top accent */}
                  <div className={cn("h-1.5 w-full bg-gradient-to-r", m.bgFrom, m.bgTo, !filled && "opacity-30")} />

                  <div className="flex flex-1 items-center gap-3 px-3 py-3 md:px-4 md:py-4">
                    {/* Icon */}
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm md:h-12 md:w-12",
                      m.bgFrom, m.bgTo
                    )}>
                      <Icon className="h-5 w-5 text-white md:h-6 md:w-6" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                      <span className="text-xs font-bold text-foreground md:text-sm">{m.shortTitle}</span>
                      {filled ? (
                        <span className={cn("truncate text-base font-extrabold md:text-lg", m.color)}>{val}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {disabled ? "Indisponível" : "Toque para registrar"}
                        </span>
                      )}
                    </div>

                    {/* Status icon */}
                    <div className="shrink-0">
                      {filled && <CheckCircle2 className={cn("h-5 w-5", m.color)} />}
                      {viewOnly && !filled && <Eye className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </Card>

                {/* Dialog */}
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div className={cn("rounded-xl bg-gradient-to-br p-2.5 shadow-lg", m.bgFrom, m.bgTo)}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg">{m.title}</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          Horário: {selectedSchedule}
                        </div>
                      </div>
                    </DialogTitle>
                    <DialogDescription>
                      {filled ? "Os valores anteriores serão substituídos." : "Registre sua medição."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => onSubmit(m.id, e)} className="space-y-4 py-3">
                    {m.fields.map((f) => (
                      <div key={f.id} className="space-y-1.5">
                        <Label htmlFor={f.id} className="text-sm font-semibold">{f.label}</Label>
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
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(null)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button type="submit" className={cn("flex-1 bg-gradient-to-r font-bold shadow-lg", m.bgFrom, m.bgTo, "text-white")}>
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
        <div className="mt-3 pb-1 md:mt-4">
          <Button
            onClick={() => {
              if (filledCount === 0 || slotStatus !== "current") return;
              if (filledCount < 6) setShowConfirmAlert(true);
              else alert(`Sinais vitais das ${selectedSchedule} confirmados!`);
            }}
            disabled={filledCount === 0 || slotStatus !== "current"}
            className={cn("h-12 w-full gap-2 text-sm font-bold transition-all md:h-14 md:text-base", confirmColor)}
          >
            {filledCount === 6 && <CheckCircle2 className="h-5 w-5" />}
            {filledCount > 0 && filledCount < 6 && <AlertTriangle className="h-5 w-5" />}
            {filledCount === 0 && <Send className="h-5 w-5" />}
            {slotStatus !== "current"
              ? "Selecione o horário atual"
              : filledCount === 0
                ? "Preencha os sinais vitais"
                : filledCount < 6
                  ? `Confirmar (${filledCount}/6 preenchidos)`
                  : "Confirmar Sinais Vitais"}
          </Button>
        </div>
      </div>

      {/* ── Alert: field already filled ── */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Campo já preenchido
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se continuar, o registro anterior será substituído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setShowWarning(false); if (pendingId) setDialogOpen(pendingId); }}
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              Substituir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Alert: incomplete confirmation ── */}
      <AlertDialog open={showConfirmAlert} onOpenChange={setShowConfirmAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Campos incompletos
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você preencheu {filledCount} de 6 campos. Deseja confirmar mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                alert(`Confirmado: ${filledCount}/6 sinais das ${selectedSchedule}`);
                setShowConfirmAlert(false);
              }}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white"
            >
              Confirmar assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
