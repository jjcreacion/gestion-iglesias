import { MapPin, Users, Grid3X3, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const territorios = [
  {
    id: "1",
    codigo: "T-001",
    nombre: "Zona Norte",
    color: "#1e3a5f",
    lider: { nombre: "Carlos", apellido: "Mendoza" },
    celulas: 5,
    miembros: 48,
    ganados: 6,
  },
  {
    id: "2",
    codigo: "T-002",
    nombre: "Zona Sur",
    color: "#2d5a3d",
    lider: { nombre: "Rosa", apellido: "Fernández" },
    celulas: 4,
    miembros: 42,
    ganados: 4,
  },
  {
    id: "3",
    codigo: "T-003",
    nombre: "Zona Centro",
    color: "#5a3d2d",
    lider: { nombre: "Miguel", apellido: "Torres" },
    celulas: 6,
    miembros: 58,
    ganados: 8,
  },
  {
    id: "4",
    codigo: "T-004",
    nombre: "Zona Este",
    color: "#3d2d5a",
    lider: { nombre: "Laura", apellido: "Ramírez" },
    celulas: 4,
    miembros: 38,
    ganados: 3,
  },
  {
    id: "5",
    codigo: "T-005",
    nombre: "Zona Oeste",
    color: "#5a2d3d",
    lider: { nombre: "Jorge", apellido: "Díaz" },
    celulas: 3,
    miembros: 32,
    ganados: 5,
  },
  {
    id: "6",
    codigo: "T-006",
    nombre: "Zona Metropolitana",
    color: "#2d4a5a",
    lider: { nombre: "Elena", apellido: "Vargas" },
    celulas: 2,
    miembros: 30,
    ganados: 2,
  },
];

export default function Territorios() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Territorios
          </h1>
          <p className="text-muted-foreground">
            Gestiona las zonas y territorios de la iglesia
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Territorio
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{territorios.length}</p>
              <p className="text-sm text-muted-foreground">Territorios Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Grid3X3 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {territorios.reduce((acc, t) => acc + t.celulas, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Células Totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {territorios.reduce((acc, t) => acc + t.miembros, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Miembros Totales</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Territory Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {territorios.map((territorio) => (
          <Card key={territorio.id} className="overflow-hidden animate-fade-in">
            <div 
              className="h-2" 
              style={{ backgroundColor: territorio.color }}
            />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {territorio.codigo}
                  </Badge>
                  <CardTitle className="font-serif text-xl">
                    {territorio.nombre}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Ver Células</DropdownMenuItem>
                    <DropdownMenuItem>Ver Reportes</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Leader */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {territorio.lider.nombre[0]}{territorio.lider.apellido[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {territorio.lider.nombre} {territorio.lider.apellido}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Líder de Territorio
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xl font-bold text-primary">
                    {territorio.celulas}
                  </p>
                  <p className="text-xs text-muted-foreground">Células</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xl font-bold text-primary">
                    {territorio.miembros}
                  </p>
                  <p className="text-xs text-muted-foreground">Miembros</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xl font-bold text-success">
                    +{territorio.ganados}
                  </p>
                  <p className="text-xs text-muted-foreground">Ganados</p>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Ver Células
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
