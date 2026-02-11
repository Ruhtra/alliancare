"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Heart,
  Thermometer,
  Droplet,
  Weight,
  AlertCircle,
  Download,
  Filter,
  Calendar,
} from "lucide-react";

const mockData = [
  {
    id: 1,
    date: "2024-02-11",
    time: "08:00",
    type: "pressao",
    icon: Activity,
    label: "Pressão Arterial",
    value: "120/80 mmHg",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    id: 2,
    date: "2024-02-11",
    time: "08:05",
    type: "frequencia",
    icon: Heart,
    label: "Frequência Cardíaca",
    value: "72 bpm",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    id: 3,
    date: "2024-02-11",
    time: "08:10",
    type: "temperatura",
    icon: Thermometer,
    label: "Temperatura",
    value: "36.5 °C",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 4,
    date: "2024-02-10",
    time: "18:00",
    type: "saturacao",
    icon: Droplet,
    label: "Saturação O₂",
    value: "98%",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 5,
    date: "2024-02-10",
    time: "08:00",
    type: "peso",
    icon: Weight,
    label: "Peso",
    value: "70 kg",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: 6,
    date: "2024-02-09",
    time: "22:00",
    type: "dor",
    icon: AlertCircle,
    label: "Nível de Dor",
    value: "2/10",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
];

export default function HistoricoPage() {
  const [filter, setFilter] = useState("7");

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log("Exporting to CSV...");
  };

  const groupedData = mockData.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof mockData>);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          Histórico de Medições
        </h1>
        <p className="text-muted-foreground">
          Visualize e exporte seus registros anteriores
        </p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockData.length}
              </p>
              <p className="text-sm text-muted-foreground">Total de registros</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Activity className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Object.keys(groupedData).length}
              </p>
              <p className="text-sm text-muted-foreground">Dias de registro</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">72</p>
              <p className="text-sm text-muted-foreground">Adesão (%)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <ScrollArea className="h-[600px] rounded-lg border border-border">
        <div className="p-4">
          {Object.entries(groupedData).map(([date, items]) => (
            <div key={date} className="mb-6 last:mb-0">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4" />
                {date}
              </div>
              <div className="space-y-3">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bgColor}`}
                          >
                            <Icon className={`h-5 w-5 ${item.color}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-card-foreground">
                              {item.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {item.value}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
