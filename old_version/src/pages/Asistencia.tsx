import { useState } from "react";
import { 
  ClipboardCheck, 
  Calendar, 
  Users, 
  UserPlus, 
  Check,
  X,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const miembrosCelula = [
  { id: "1", nombre: "María", apellido: "García", rol: "Líder", presente: true },
  { id: "2", nombre: "Juan", apellido: "Pérez", rol: "Co-líder", presente: true },
  { id: "3", nombre: "Ana", apellido: "Martínez", rol: "Anfitriona", presente: true },
  { id: "4", nombre: "Pedro", apellido: "López", rol: "Consolidador", presente: false },
  { id: "5", nombre: "Carmen", apellido: "Rodríguez", rol: "Miembro", presente: true },
  { id: "6", nombre: "Luis", apellido: "Hernández", rol: "Miembro", presente: true },
  { id: "7", nombre: "Rosa", apellido: "Fernández", rol: "Miembro", presente: false },
  { id: "8", nombre: "Carlos", apellido: "Díaz", rol: "Miembro", presente: true },
  { id: "9", nombre: "Elena", apellido: "Vargas", rol: "Invitado", presente: true },
  { id: "10", nombre: "Miguel", apellido: "Torres", rol: "Invitado", presente: true },
];

export default function Asistencia() {
  const [asistencia, setAsistencia] = useState<Record<string, boolean>>(
    miembrosCelula.reduce((acc, m) => ({ ...acc, [m.id]: m.presente }), {})
  );
  const [nuevos, setNuevos] = useState(2);
  const [visitas, setVisitas] = useState(1);
  const [ofrenda, setOfrenda] = useState("");

  const presentes = Object.values(asistencia).filter(Boolean).length;
  const total = presentes + nuevos + visitas;

  const toggleAsistencia = (id: string) => {
    setAsistencia((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Asistencia Dominical
          </h1>
          <p className="text-muted-foreground">
            Registro de asistencia del servicio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-base px-4 py-2">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Badge>
        </div>
      </div>

      {/* Cell Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2 flex-1 min-w-48">
              <Label>Seleccionar Célula</Label>
              <Select defaultValue="celula-norte">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una célula" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celula-norte">Célula Norte - María García</SelectItem>
                  <SelectItem value="celula-sur">Célula Sur - Pedro Martínez</SelectItem>
                  <SelectItem value="celula-centro">Célula Centro - Roberto Díaz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Lista de Miembros
                </CardTitle>
                <Badge variant="outline" className="text-sm">
                  {presentes}/{miembrosCelula.length} presentes
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {miembrosCelula.map((miembro) => (
                  <div
                    key={miembro.id}
                    className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
                      asistencia[miembro.id]
                        ? "bg-success/5 border-success/20"
                        : "bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      id={`asistencia-${miembro.id}`}
                      checked={asistencia[miembro.id]}
                      onCheckedChange={() => toggleAsistencia(miembro.id)}
                      className="h-5 w-5"
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={
                          asistencia[miembro.id]
                            ? "bg-success text-success-foreground"
                            : "bg-muted text-muted-foreground"
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
                        {miembro.rol}
                      </p>
                    </div>
                    {asistencia[miembro.id] ? (
                      <Check className="h-5 w-5 text-success" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <Users className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-bold">{presentes}</p>
                  <p className="text-xs text-muted-foreground">Presentes</p>
                </div>
                <div className="rounded-lg bg-success/10 p-4 text-center">
                  <UserPlus className="h-6 w-6 mx-auto text-success mb-1" />
                  <p className="text-2xl font-bold">{nuevos}</p>
                  <p className="text-xs text-muted-foreground">Nuevos</p>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="nuevos">Nuevos (1ra vez)</Label>
                  <Input
                    id="nuevos"
                    type="number"
                    min="0"
                    value={nuevos}
                    onChange={(e) => setNuevos(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitas">Visitas</Label>
                  <Input
                    id="visitas"
                    type="number"
                    min="0"
                    value={visitas}
                    onChange={(e) => setVisitas(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ofrenda">Ofrenda</Label>
                  <Input
                    id="ofrenda"
                    type="text"
                    placeholder="$0.00"
                    value={ofrenda}
                    onChange={(e) => setOfrenda(e.target.value)}
                  />
                </div>
              </div>

              {/* Total */}
              <div className="rounded-lg bg-accent/10 p-4 text-center">
                <p className="text-3xl font-bold text-accent-foreground">{total}</p>
                <p className="text-sm text-muted-foreground">Total Participantes</p>
              </div>

              <Button className="w-full gap-2" size="lg">
                <Save className="h-4 w-4" />
                Guardar Asistencia
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Últimos Domingos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { fecha: "26 Ene", total: 158, ganados: 5 },
                  { fecha: "19 Ene", total: 162, ganados: 3 },
                  { fecha: "12 Ene", total: 145, ganados: 4 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-muted-foreground">{item.fecha}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.total}</span>
                      <Badge variant="secondary" className="text-xs">
                        +{item.ganados}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
