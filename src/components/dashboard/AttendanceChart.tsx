import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Ene", asistencia: 120, ganados: 8 },
  { name: "Feb", asistencia: 135, ganados: 12 },
  { name: "Mar", asistencia: 128, ganados: 10 },
  { name: "Abr", asistencia: 145, ganados: 15 },
  { name: "May", asistencia: 158, ganados: 18 },
  { name: "Jun", asistencia: 162, ganados: 14 },
];

export function AttendanceChart() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="title-section">
          Tendencia de Asistencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAsistencia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0369A1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0369A1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGanados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B45309" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area
                type="monotone"
                dataKey="asistencia"
                stroke="#0369A1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAsistencia)"
                name="Asistencia"
              />
              <Area
                type="monotone"
                dataKey="ganados"
                stroke="#B45309"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGanados)"
                name="Ganados"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Asistencia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Ganados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
