"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ClipboardCheck, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    title: "Nuevo Miembro",
    description: "Registrar persona ganada",
    icon: UserPlus,
    href: "/miembros/nuevo",
    variant: "outline" as const,
  },
  {
    title: "Tomar Asistencia",
    description: "Registro dominical",
    icon: ClipboardCheck,
    href: "/asistencia",
    variant: "outline" as const,
  },
  {
    title: "Ver Reportes",
    description: "Estadísticas del mes",
    icon: FileText,
    href: "/reportes",
    variant: "outline" as const,
  },
  {
    title: "Mis Células",
    description: "Gestionar células",
    icon: Users,
    href: "/celulas",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="title-section">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto justify-start gap-4 p-4 text-left transition-all hover:bg-primary hover:text-primary-foreground group"
            onClick={() => router.push(action.href)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary-foreground/20">
              <action.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">{action.title}</span>
              <span className="text-xs text-muted-foreground">
                {action.description}
              </span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
