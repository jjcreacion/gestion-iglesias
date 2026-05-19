"use client";

import { BarChart3, Users, TrendingUp, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Mock data
const asistenciaMensual = [
    { mes: "Ene", asistencia: 145, ganados: 12 },
    { mes: "Feb", asistencia: 158, ganados: 15 },
    { mes: "Mar", asistencia: 162, ganados: 10 },
    { mes: "Abr", asistencia: 175, ganados: 18 },
    { mes: "May", asistencia: 168, ganados: 14 },
    { mes: "Jun", asistencia: 182, ganados: 20 },
];

const distribucionRoles = [
    { name: "Líderes", value: 24, color: "hsl(220, 45%, 25%)" },
    { name: "Co-líderes", value: 18, color: "hsl(200, 80%, 45%)" },
    { name: "Consolidadores", value: 35, color: "hsl(145, 60%, 40%)" },
    { name: "Anfitriones", value: 24, color: "hsl(38, 85%, 55%)" },
    { name: "Miembros", value: 147, color: "hsl(30, 15%, 70%)" },
];

const topLideres = [
    { nombre: "María García", celula: "Norte", ganados: 8 },
    { nombre: "Pedro Martínez", celula: "Centro", ganados: 6 },
    { nombre: "Ana López", celula: "Sur", ganados: 5 },
    { nombre: "Juan Pérez", celula: "Este", ganados: 4 },
    { nombre: "Rosa Fernández", celula: "Oeste", ganados: 3 },
];

export default function ReportesPage() {
    return (
        <div className="space-y-6 p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="title-page">
                        Reportes
                    </h1>
                    <p className="text-muted-foreground">
                        Análisis y estadísticas de la congregación
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="mes">
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semana">Esta Semana</SelectItem>
                            <SelectItem value="mes">Este Mes</SelectItem>
                            <SelectItem value="trimestre">Trimestre</SelectItem>
                            <SelectItem value="año">Este Año</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Miembros</p>
                                <p className="text-3xl font-bold">248</p>
                                <p className="text-xs text-success">+12 este mes</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Ganados del Mes</p>
                                <p className="text-3xl font-bold">28</p>
                                <p className="text-xs text-success">+15% vs mes anterior</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                                <TrendingUp className="h-6 w-6 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Asistencia Prom.</p>
                                <p className="text-3xl font-bold">162</p>
                                <p className="text-xs text-muted-foreground">Último domingo</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                                <Calendar className="h-6 w-6 text-accent" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Con 10 Guías</p>
                                <p className="text-3xl font-bold">186</p>
                                <p className="text-xs text-muted-foreground">75% del total</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                                <BarChart3 className="h-6 w-6 text-info" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="asistencia" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
                    <TabsTrigger value="consolidacion">Consolidación</TabsTrigger>
                    <TabsTrigger value="formacion">Formación</TabsTrigger>
                </TabsList>

                <TabsContent value="asistencia" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Bar Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="title-section">Asistencia y Ganados por Mes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                                        <BarChart data={asistenciaMensual}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis dataKey="mes" className="text-xs" />
                                            <YAxis className="text-xs" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--card))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "var(--radius)",
                                                }}
                                            />
                                            <Bar dataKey="asistencia" fill="hsl(220, 45%, 25%)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="ganados" fill="hsl(38, 85%, 55%)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Leaders */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="title-section">Top Ganadores del Mes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topLideres.map((lider, i) => (
                                        <div
                                            key={lider.nombre}
                                            className="flex items-center gap-3"
                                        >
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i === 0
                                                    ? "bg-accent text-accent-foreground"
                                                    : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{lider.nombre}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Célula {lider.celula}
                                                </p>
                                            </div>
                                            <Badge variant="secondary">{lider.ganados}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="consolidacion" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Distribution Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="title-section">Distribución por Roles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                                        <PieChart>
                                            <Pie
                                                data={distribucionRoles}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {distribucionRoles.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--card))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "var(--radius)",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {distribucionRoles.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-sm">
                                                {item.name}: {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consolidation Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="title-section">Estado de Consolidación</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                                        <span>10 Guías Completas</span>
                                        <Badge className="bg-success text-success-foreground">186</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                                        <span>En Proceso (1-9 guías)</span>
                                        <Badge className="bg-accent text-accent-foreground">42</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                        <span>Sin Iniciar</span>
                                        <Badge variant="secondary">20</Badge>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Con Encuentro</span>
                                        <span className="font-medium">198 (80%)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Sin Encuentro</span>
                                        <span className="font-medium">50 (20%)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Bautizados</span>
                                        <span className="font-medium">220 (89%)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="formacion" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                titulo: "Escuela de Líderes", etapas: [
                                    { nombre: "Fundamento", cantidad: 45 },
                                    { nombre: "Familia", cantidad: 38 },
                                    { nombre: "Visión", cantidad: 30 },
                                    { nombre: "Intercesión", cantidad: 25 },
                                    { nombre: "Liderazgo", cantidad: 20 },
                                    { nombre: "Consolidación", cantidad: 15 },
                                ]
                            },
                            {
                                titulo: "Escuela Profética", etapas: [
                                    { nombre: "Nivel 1", cantidad: 35 },
                                    { nombre: "Nivel 2", cantidad: 28 },
                                    { nombre: "Nivel 3", cantidad: 18 },
                                ]
                            },
                            {
                                titulo: "Teología", etapas: [
                                    { nombre: "Universidad AM", cantidad: 22 },
                                    { nombre: "Escuela Teológica", cantidad: 15 },
                                ]
                            },
                        ].map((escuela) => (
                            <Card key={escuela.titulo}>
                                <CardHeader>
                                    <CardTitle className="title-section">{escuela.titulo}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {escuela.etapas.map((etapa) => (
                                        <div
                                            key={etapa.nombre}
                                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                                        >
                                            <span className="text-sm">{etapa.nombre}</span>
                                            <Badge variant="outline">{etapa.cantidad}</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
