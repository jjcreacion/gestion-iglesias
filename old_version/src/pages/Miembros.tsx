import { useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Phone,
  MapPin,
  Users,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
const miembros = [
  {
    id: "1",
    nombre: "María",
    apellido: "García",
    telefono: "+58 412-555-0001",
    celula: "Célula Norte",
    territorio: "Zona Norte",
    rol: "Miembro",
    guias: 7,
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "+58 414-555-0002",
    celula: "Célula Centro",
    territorio: "Zona Centro",
    rol: "Líder",
    guias: 10,
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Ana",
    apellido: "Martínez",
    telefono: "+58 424-555-0003",
    celula: "Célula Sur",
    territorio: "Zona Sur",
    rol: "Consolidadora",
    guias: 10,
    estado: "Activo",
  },
  {
    id: "4",
    nombre: "Pedro",
    apellido: "López",
    telefono: "+58 416-555-0004",
    celula: "Célula Este",
    territorio: "Zona Este",
    rol: "Anfitrión",
    guias: 5,
    estado: "En proceso",
  },
  {
    id: "5",
    nombre: "Carmen",
    apellido: "Rodríguez",
    telefono: "+58 426-555-0005",
    celula: "Célula Oeste",
    territorio: "Zona Oeste",
    rol: "Co-líder",
    guias: 10,
    estado: "Activo",
  },
];

const rolColors: Record<string, string> = {
  "Líder": "bg-primary text-primary-foreground",
  "Co-líder": "bg-info text-info-foreground",
  "Consolidadora": "bg-success text-success-foreground",
  "Consolidador": "bg-success text-success-foreground",
  "Anfitrión": "bg-accent text-accent-foreground",
  "Anfitriona": "bg-accent text-accent-foreground",
  "Miembro": "bg-muted text-muted-foreground",
  "Invitado": "bg-secondary text-secondary-foreground",
};

export default function Miembros() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMiembros = miembros.filter(
    (m) =>
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.celula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Miembros
          </h1>
          <p className="text-muted-foreground">
            Gestiona los miembros de la congregación
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Miembro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">248</p>
              <p className="text-sm text-muted-foreground">Total Miembros</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <BookOpen className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">186</p>
              <p className="text-sm text-muted-foreground">Con 10 Guías</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">62</p>
              <p className="text-sm text-muted-foreground">En Consolidación</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
              <Phone className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="font-serif text-xl">
              Listado de Miembros
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Territorio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="norte">Zona Norte</SelectItem>
                  <SelectItem value="sur">Zona Sur</SelectItem>
                  <SelectItem value="centro">Zona Centro</SelectItem>
                  <SelectItem value="este">Zona Este</SelectItem>
                  <SelectItem value="oeste">Zona Oeste</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                  <TableHead className="hidden lg:table-cell">Célula</TableHead>
                  <TableHead className="hidden sm:table-cell">Rol</TableHead>
                  <TableHead className="text-center">Guías</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMiembros.map((miembro) => (
                  <TableRow key={miembro.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {miembro.nombre[0]}{miembro.apellido[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {miembro.nombre} {miembro.apellido}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {miembro.telefono}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {miembro.telefono}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div>
                        <p className="text-sm">{miembro.celula}</p>
                        <p className="text-xs text-muted-foreground">
                          {miembro.territorio}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={rolColors[miembro.rol] || "bg-muted"}>
                        {miembro.rol}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {miembro.guias}/10
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Seguimiento</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Trasladar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Dar de Baja
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
