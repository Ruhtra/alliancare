"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, BarChart3, TableIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type MeasurementRecord = {
  date: string;
  pa_sistolica: number;
  pa_diastolica: number;
  fc: number;
  temp: number;
  spo2: number;
  peso: number;
  dor: number;
};

const mockData: MeasurementRecord[] = [
  {
    date: "11/02/26",
    pa_sistolica: 120,
    pa_diastolica: 80,
    fc: 72,
    temp: 36.5,
    spo2: 98,
    peso: 70.5,
    dor: 0,
  },
  {
    date: "10/02/26",
    pa_sistolica: 118,
    pa_diastolica: 78,
    fc: 70,
    temp: 36.6,
    spo2: 97,
    peso: 70.3,
    dor: 1,
  },
  {
    date: "09/02/26",
    pa_sistolica: 122,
    pa_diastolica: 82,
    fc: 75,
    temp: 36.4,
    spo2: 98,
    peso: 70.7,
    dor: 0,
  },
  {
    date: "08/02/26",
    pa_sistolica: 125,
    pa_diastolica: 85,
    fc: 78,
    temp: 36.7,
    spo2: 96,
    peso: 71.0,
    dor: 2,
  },
  {
    date: "07/02/26",
    pa_sistolica: 119,
    pa_diastolica: 79,
    fc: 71,
    temp: 36.5,
    spo2: 98,
    peso: 70.8,
    dor: 1,
  },
  {
    date: "06/02/26",
    pa_sistolica: 121,
    pa_diastolica: 81,
    fc: 73,
    temp: 36.6,
    spo2: 97,
    peso: 70.6,
    dor: 0,
  },
  {
    date: "05/02/26",
    pa_sistolica: 123,
    pa_diastolica: 83,
    fc: 74,
    temp: 36.5,
    spo2: 98,
    peso: 70.4,
    dor: 1,
  },
];

export default function HistoricoPage() {
  const [viewMode, setViewMode] = useState<"table" | "chart">("chart");
  const [filter, setFilter] = useState("7");

  const handleExportCSV = () => {
    const headers = ["DATA", "PA", "FC", "TEMP", "SPO2", "PESO", "DOR"];
    const rows = mockData.map((record) => [
      record.date,
      `${record.pa_sistolica}/${record.pa_diastolica}`,
      record.fc,
      record.temp,
      record.spo2,
      record.peso,
      record.dor,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vigidoc-historico-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const chartData = [...mockData].reverse().map((record) => ({
    date: record.date,
    "PA Sistólica": record.pa_sistolica,
    "PA Diastólica": record.pa_diastolica,
    "FC (bpm)": record.fc,
    "Temp (°C)": record.temp,
    "SpO₂ (%)": record.spo2,
    "Peso (kg)": record.peso,
    "Dor": record.dor,
  }));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Histórico de Medições
        </h1>
        <p className="text-muted-foreground">
          Visualize e acompanhe a evolução dos seus sinais vitais
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-lg border-2 border-border bg-muted p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2"
              >
                <TableIcon className="h-4 w-4" />
                Tabela
              </Button>
              <Button
                variant={viewMode === "chart" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("chart")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Gráficos
              </Button>
            </div>
          </div>

          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </Card>

      {/* Content */}
      {viewMode === "table" ? (
        <Card className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">DATA</TableHead>
                  <TableHead className="font-bold">PA</TableHead>
                  <TableHead className="font-bold">FC</TableHead>
                  <TableHead className="font-bold">TEMP</TableHead>
                  <TableHead className="font-bold">SPO₂</TableHead>
                  <TableHead className="font-bold">PESO</TableHead>
                  <TableHead className="font-bold">DOR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((record, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>
                      {record.pa_sistolica
                        ? `${record.pa_sistolica}/${record.pa_diastolica}`
                        : "-"}
                    </TableCell>
                    <TableCell>{record.fc || "-"}</TableCell>
                    <TableCell>{record.temp || "-"}</TableCell>
                    <TableCell>{record.spo2 || "-"}</TableCell>
                    <TableCell>{record.peso || "-"}</TableCell>
                    <TableCell>{record.dor || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pressão Arterial Chart */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">
              Pressão Arterial
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="PA Sistólica"
                  stroke="hsl(0 84% 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(0 84% 60%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="PA Diastólica"
                  stroke="hsl(0 84% 40%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(0 84% 40%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Frequência Cardíaca Chart */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">
              Frequência Cardíaca
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="FC (bpm)"
                  stroke="hsl(330 81% 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(330 81% 60%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Temperatura Chart */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">
              Temperatura Corporal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[36, 37.5]}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Temp (°C)"
                  stroke="hsl(24 95% 53%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(24 95% 53%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Grid for remaining metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* SpO2 Chart */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">
                Saturação O₂
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    domain={[94, 100]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="SpO₂ (%)"
                    stroke="hsl(217 91% 60%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(217 91% 60%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Peso Chart */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">Peso</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    domain={[69, 72]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Peso (kg)"
                    stroke="hsl(142 76% 36%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(142 76% 36%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Dor Chart */}
            <Card className="p-6 md:col-span-2">
              <h3 className="mb-4 text-lg font-bold text-foreground">
                Nível de Dor
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Dor"
                    stroke="hsl(48 96% 53%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(48 96% 53%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
