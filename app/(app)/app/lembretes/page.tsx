import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function LembretesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          Lembretes
        </h1>
        <p className="text-muted-foreground">
          Configure os horários para suas medições diárias
        </p>
      </div>

      {/* Under Construction */}
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
          <Construction className="h-10 w-10 text-secondary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          Em Construção
        </h2>
        <p className="max-w-md text-muted-foreground">
          Esta funcionalidade está sendo desenvolvida. Em breve você poderá
          configurar lembretes personalizados para suas medições diárias.
        </p>
      </Card>
    </div>
  );
}
