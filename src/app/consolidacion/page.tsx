"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Circle, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data - Guías
const guias = [
    { numero: 1, titulo: "Salvación" },
    { numero: 2, titulo: "Seguridad" },
    { numero: 3, titulo: "Oración" },
    { numero: 4, titulo: "Biblia" },
    { numero: 5, titulo: "Iglesia" },
    { numero: 6, titulo: "Bautismo" },
    { numero: 7, titulo: "Victoria" },
    { numero: 8, titulo: "Testimonio" },
    { numero: 9, titulo: "Diezmo" },
    { numero: 10, titulo: "Servicio" },
];

// Mock data - Miembros en consolidación
const miembrosConsolidacion = [
    {
        id: "1",
        nombre: "María",
        apellido: "García",
        consolidador: "Juan Pérez",
        guiasCompletadas: [1, 2, 3, 4, 5, 6, 7],
        encuentro: true,
        escuelaLideres: "Fundamento",
    },
    {
        id: "2",
        nombre: "Pedro",
        apellido: "López",
        consolidador: "Ana Martínez",
        guiasCompletadas: [1, 2, 3, 4, 5],
        encuentro: true,
        escuelaLideres: null,
    },
    {
        id: "3",
        nombre: "Carmen",
        apellido: "Rodríguez",
        consolidador: "Juan Pérez",
        guiasCompletadas: [1, 2, 3],
        encuentro: false,
        escuelaLideres: null,
    },
    {
        id: "4",
        nombre: "Luis",
        apellido: "Hernández",
        consolidador: "Rosa Fernández",
        guiasCompletadas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        encuentro: true,
        escuelaLideres: "Liderazgo",
    },
    {
        id: "5",
        nombre: "Elena",
        apellido: "Vargas",
        consolidador: "Ana Martínez",
        guiasCompletadas: [1],
        encuentro: false,
        escuelaLideres: null,
    },
];

export default function ConsolidacionPage() {
    const [selectedCell, setSelectedCell] = useState("all");

    const completados = miembrosConsolidacion.filter(
        (m) => m.guiasCompletadas.length === 10
    ).length;
    const enProceso = miembrosConsolidacion.filter(
        (m) => m.guiasCompletadas.length > 0 && m.guiasCompletadas.length < 10
    ).length;

    return (
        <TooltipProvider>
            <div className="space-y-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="title-page">
                            Consolidación
                        </h1>
                        <p className="text-muted-foreground">
                            Seguimiento de guías y proceso de consolidación
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select value={selectedCell} onValueChange={setSelectedCell}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por célula" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las células</SelectItem>
                                <SelectItem value="norte">Célula Norte</SelectItem>
                                <SelectItem value="sur">Célula Sur</SelectItem>
                                <SelectItem value="centro">Célula Centro</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{miembrosConsolidacion.length}</p>
                                <p className="text-sm text-muted-foreground">En Consolidación</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                                <CheckCircle2 className="h-6 w-6 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completados}</p>
                                <p className="text-sm text-muted-foreground">10 Guías Completas</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                                <BookOpen className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{enProceso}</p>
                                <p className="text-sm text-muted-foreground">En Proceso</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                                <Circle className="h-6 w-6 text-info" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {miembrosConsolidacion.filter((m) => m.encuentro).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Con Encuentro</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Guides Legend */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="title-section">Guías de Consolidación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {guias.map((guia) => (
                                <Badge
                                    key={guia.numero}
                                    variant="outline"
                                    className="text-xs px-3 py-1"
                                >
                                    {guia.numero}. {guia.titulo}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Members Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {miembrosConsolidacion.map((miembro) => {
                        const progreso = (miembro.guiasCompletadas.length / 10) * 100;
                        const isComplete = miembro.guiasCompletadas.length === 10;

                        return (
                            <Card
                                key={miembro.id}
                                className={`animate-fade-in ${isComplete ? "border-success/50 bg-success/5" : ""
                                    }`}
                            >
                                <CardContent className="p-4 space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback
                                                className={
                                                    isComplete
                                                        ? "bg-success text-success-foreground"
                                                        : "bg-primary/10 text-primary"
                                                }
                                            >
                                                {miembro.nombre[0]}{miembro.apellido[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {miembro.nombre} {miembro.apellido}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Consolidador: {miembro.consolidador}
                                            </p>
                                        </div>
                                        {isComplete && (
                                            <Badge className="bg-success text-success-foreground">
                                                Completo
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progreso</span>
                                            <span className="font-medium">
                                                {miembro.guiasCompletadas.length}/10 guías
                                            </span>
                                        </div>
                                        <Progress value={progreso} className="h-2" />
                                    </div>

                                    {/* Guides Grid */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {guias.map((guia) => {
                                            const completed = miembro.guiasCompletadas.includes(guia.numero);
                                            return (
                                                <Tooltip key={guia.numero}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${completed
                                                                ? "bg-success text-success-foreground"
                                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                                }`}
                                                        >
                                                            {guia.numero}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Guía {guia.numero}: {guia.titulo}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {completed ? "Completada" : "Pendiente"}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>

                                    {/* Additional Info */}
                                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                                        <Badge
                                            variant={miembro.encuentro ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {miembro.encuentro ? "✓ Encuentro" : "Sin Encuentro"}
                                        </Badge>
                                        {miembro.escuelaLideres && (
                                            <Badge variant="outline" className="text-xs">
                                                Escuela: {miembro.escuelaLideres}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
}
