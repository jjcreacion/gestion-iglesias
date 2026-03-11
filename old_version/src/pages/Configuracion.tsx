import { Settings, Users, BookOpen, MapPin, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Configuracion() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Configuración
        </h1>
        <p className="text-muted-foreground">
          Administra la configuración del sistema
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="guias" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Guías
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Información de la Iglesia</CardTitle>
              <CardDescription>
                Datos generales de la congregación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Iglesia</Label>
                  <Input id="nombre" defaultValue="Iglesia Cristiana" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastor">Pastor Principal</Label>
                  <Input id="pastor" defaultValue="Pastor Juan García" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" placeholder="Av. Principal #123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" placeholder="+58 212-555-0000" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Configuración de Guías</CardTitle>
              <CardDescription>
                Administra las guías de consolidación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
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
                ].map((guia) => (
                  <div
                    key={guia.numero}
                    className="flex items-center gap-4 p-3 rounded-lg border"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {guia.numero}
                    </div>
                    <Input
                      defaultValue={guia.titulo}
                      className="flex-1"
                    />
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <Button variant="outline">Agregar Guía</Button>
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Permisos por Rol</CardTitle>
              <CardDescription>
                Configura los permisos de cada rol en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  rol: "Pastor / Administrador",
                  descripcion: "Acceso completo al sistema",
                  permisos: ["Crear territorios", "Crear células", "Ver todos los reportes", "Gestionar usuarios"],
                },
                {
                  rol: "Líder de Territorio",
                  descripcion: "Gestión de su territorio",
                  permisos: ["Ver células del territorio", "Agregar miembros", "Ver reportes del territorio", "Trasladar miembros"],
                },
                {
                  rol: "Líder de Célula",
                  descripcion: "Gestión de su célula",
                  permisos: ["Tomar asistencia", "Marcar guías", "Ver reportes de célula", "Recibir miembros"],
                },
                {
                  rol: "Co-líder",
                  descripcion: "Apoyo al líder de célula",
                  permisos: ["Tomar asistencia", "Marcar guías", "Ver reportes de célula"],
                },
              ].map((item) => (
                <div key={item.rol} className="space-y-3 p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.rol}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {item.permisos.map((permiso) => (
                      <div
                        key={permiso}
                        className="flex items-center justify-between p-2 rounded bg-muted/50"
                      >
                        <span className="text-sm">{permiso}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Preferencias de Notificación</CardTitle>
              <CardDescription>
                Configura las notificaciones del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  titulo: "Nuevos miembros",
                  descripcion: "Recibir notificación cuando se registre un nuevo miembro",
                },
                {
                  titulo: "Asistencia no registrada",
                  descripcion: "Alerta cuando no se ha registrado asistencia el domingo",
                },
                {
                  titulo: "Guías completadas",
                  descripcion: "Notificar cuando un miembro complete las 10 guías",
                },
                {
                  titulo: "Solicitudes de traslado",
                  descripcion: "Recibir notificación de solicitudes de traslado",
                },
                {
                  titulo: "Reportes semanales",
                  descripcion: "Enviar resumen semanal por correo electrónico",
                },
              ].map((notif) => (
                <div
                  key={notif.titulo}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{notif.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {notif.descripcion}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              <Separator />
              <div className="flex justify-end">
                <Button>Guardar Preferencias</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
