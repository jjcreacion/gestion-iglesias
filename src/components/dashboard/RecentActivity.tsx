import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, BookOpen, Calendar, Award } from "lucide-react";

interface Activity {
  id: string;
  type: "new_member" | "consolidation" | "attendance" | "graduation";
  title: string;
  description: string;
  time: string;
  avatar?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "new_member",
    title: "María García",
    description: "Nueva persona ganada en célula Norte",
    time: "Hace 2 horas",
  },
  {
    id: "2",
    type: "consolidation",
    title: "Juan Pérez completó Guía 5",
    description: "Consolidador: Pedro López",
    time: "Hace 3 horas",
  },
  {
    id: "3",
    type: "attendance",
    title: "Célula Centro registró asistencia",
    description: "18 presentes, 3 nuevos",
    time: "Ayer",
  },
  {
    id: "4",
    type: "graduation",
    title: "Ana Martínez graduada",
    description: "Escuela de Líderes - Fundamento",
    time: "Hace 2 días",
  },
];

const activityIcons = {
  new_member: UserPlus,
  consolidation: BookOpen,
  attendance: Calendar,
  graduation: Award,
};

const activityColors = {
  new_member: "bg-success/10 text-success",
  consolidation: "bg-info/10 text-info",
  attendance: "bg-accent/10 text-accent-foreground",
  graduation: "bg-primary/10 text-primary",
};

export function RecentActivity() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="title-section">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${activityColors[activity.type]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
