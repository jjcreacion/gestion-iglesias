"use client";

import { Grid3X3, Users, MapPin, Plus, Calendar, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock data
const celulas = [
    {
        id: "1",
        codigo: "C-N01",
        nombre: "Célula Vida Nueva",
        territorio: "Zona Norte",
        lider: { nombre: "María", apellido: "González" },
        colider: { nombre: "José", apellido: "Hernández" },
        anfitrion: { nombre: "Ana", apellido: "Pérez" },
        miembros: 12,
        asistenciaPromedio: 85,
        ganadosMes: 3,
        diaCelula: "Miércoles",
        horaCelula: "7:00 PM",
    },
    {
        id: "2",
        codigo: "C-S01",
        nombre: "Célula Esperanza",
        territorio: "Zona Sur",
        lider: { nombre: "Pedro", apellido: "Martínez" },
        colider: { nombre: "Luisa", apellido: "Rodríguez" },
        anfitrion: { nombre: "Carmen", apellido: "López" },
        miembros: 10,
        asistenciaPromedio: 78,
        ganadosMes: 2,
        diaCelula: "Jueves",
        horaCelula: "7:30 PM",
    },
    {
        id: "3",
        codigo: "C-C01",
        nombre: "Célula Restauración",
        territorio: "Zona Centro",
        lider: { nombre: "Roberto", apellido: "Díaz" },
        colider: null,
        anfitrion: { nombre: "Elena", apellido: "Vargas" },
        miembros: 15,
        asistenciaPromedio: 92,
        ganadosMes: 5,
        diaCelula: "Viernes",
        horaCelula: "7:00 PM",
    },
    {
        id: "4",
        codigo: "C-E01",
        nombre: "Célula Gracia",
        territorio: "Zona Este",
        lider: { nombre: "Laura", apellido: "Ramírez" },
        colider: { nombre: "Miguel", apellido: "Santos" },
        anfitrion: { nombre: "Patricia", apellido: "Mora" },
        miembros: 8,
        asistenciaPromedio: 70,
        ganadosMes: 1,
        diaCelula: "Miércoles",
        horaCelula: "6:30 PM",
    },
];

export default function CelulasPage() {
    return (
        <div className="space-y-6 p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="title-page">
                        Células
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona las células y sus miembros
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Célula
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Territorio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="norte">Zona Norte</SelectItem>
                        <SelectItem value="sur">Zona Sur</SelectItem>
                        <SelectItem value="centro">Zona Centro</SelectItem>
                        <SelectItem value="este">Zona Este</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Día" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los días</SelectItem>
                        <SelectItem value="miercoles">Miércoles</SelectItem>
                        <SelectItem value="jueves">Jueves</SelectItem>
                        <SelectItem value="viernes">Viernes</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Grid3X3 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">24</p>
                            <p className="text-sm text-muted-foreground">Células Activas</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                            <Users className="h-6 w-6 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">248</p>
                            <p className="text-sm text-muted-foreground">Miembros Total</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                            <Calendar className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">82%</p>
                            <p className="text-sm text-muted-foreground">Asistencia Prom.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                            <MapPin className="h-6 w-6 text-info" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">+28</p>
                            <p className="text-sm text-muted-foreground">Ganados Este Mes</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cells Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {celulas.map((celula) => (
                    <Card key={celula.id} className="animate-fade-in">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <Badge variant="secondary" className="mb-2">
                                        {celula.codigo}
                                    </Badge>
                                    <CardTitle className="title-section">
                                        {celula.nombre}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {celula.territorio}
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                                        <DropdownMenuItem>Tomar Asistencia</DropdownMenuItem>
                                        <DropdownMenuItem>Ver Miembros</DropdownMenuItem>
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Schedule */}
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{celula.diaCelula} - {celula.horaCelula}</span>
                            </div>

                            {/* Leaders */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                            {celula.lider.nombre[0]}{celula.lider.apellido[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {celula.lider.nombre} {celula.lider.apellido}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Líder</p>
                                    </div>
                                </div>
                                {celula.colider && (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-7 w-7">
                                            <AvatarFallback className="bg-info/20 text-info text-xs">
                                                {celula.colider.nombre[0]}{celula.colider.apellido[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {celula.colider.nombre} {celula.colider.apellido}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Co-líder</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
                                <div>
                                    <p className="text-lg font-bold">{celula.miembros}</p>
                                    <p className="text-xs text-muted-foreground">Miembros</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-success">+{celula.ganadosMes}</p>
                                    <p className="text-xs text-muted-foreground">Ganados</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold">{celula.asistenciaPromedio}%</p>
                                    <p className="text-xs text-muted-foreground">Asistencia</p>
                                </div>
                            </div>

                            {/* Attendance Progress */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Asistencia promedio</span>
                                    <span className="font-medium">{celula.asistenciaPromedio}%</span>
                                </div>
                                <Progress value={celula.asistenciaPromedio} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
