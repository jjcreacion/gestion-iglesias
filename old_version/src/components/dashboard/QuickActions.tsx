import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ClipboardCheck, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Nuevo Miembro",
    description: "Registrar persona ganada",
    icon: UserPlus,
    href: "/miembros/nuevo",
    variant: "default" as const,
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
  const navigate = useNavigate();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-xl">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto justify-start gap-4 p-4 text-left"
            onClick={() => navigate(action.href)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <action.icon className="h-5 w-5 text-primary" />
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
