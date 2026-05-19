"use client";

import { useState, useTransition } from "react";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Phone,
    MapPin,
    Users,
    BookOpen,
    Loader2,
    UserCheck,
    Calendar,
    User,
    Home,
    Briefcase,
    GraduationCap,
    Info,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { createMiembro, updateMiembro, cambiarEstadoMiembro } from "@/lib/actions/miembros.actions";
import { useRouter } from "next/navigation";

// ─── Interfaces simples (sin importar entidades TypeORM) ───────────────────
type EstadoMiembro = "activo" | "inactivo" | "trasladado" | "baja";
type EstadoCivil = "soltero" | "casado" | "divorciado" | "viudo" | "union_libre";
type Genero = "masculino" | "femenino";
type ProgresoFormacion = "no_iniciado" | "en_curso" | "completado";

interface CelulaSimple {
    id: number;
    nombre: string;
    codigo: string;
    territorioId: number;
}

interface MiembroItem {
    id: number;
    nombre: string;
    apellido: string;
    telefono?: string;
    direccion?: string;
    cedula?: string;
    fechaNacimiento?: Date | string;
    estadoCivil?: EstadoCivil;
    genero?: Genero;
    profesion?: string;
    celulaId?: number;
    notas?: string;
    estado: EstadoMiembro;
    encuentro: boolean;
    bautismo: boolean;
    escuelaFundamento: ProgresoFormacion;
    fechaConversion?: Date | string;
    createdAt?: Date | string;
    celula?: { id: number; territorio?: { nombre: string } };
}

// ─── Colores ───────────────────────────────────────────────────────────────
const estadoColors: Record<string, string> = {
    activo: "bg-success text-success-foreground",
    inactivo: "bg-muted text-muted-foreground",
    trasladado: "bg-info text-info-foreground",
    baja: "bg-destructive text-destructive-foreground",
};

// ─── Props ─────────────────────────────────────────────────────────────────
type Props = {
    initialData?: {
        miembros: MiembroItem[];
        celulas: CelulaSimple[];
        stats: {
            total: number;
            activos: number;
            nuevos: number;
            conDecadas: number;
        };
    };
};

const emptyForm = {
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    cedula: "",
    fechaNacimiento: "",
    estadoCivil: "" as EstadoCivil | "",
    genero: "" as Genero | "",
    profesion: "",
    celulaId: "",
    notas: "",
};

export default function MiembrosClient({ initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(!initialData);

    const [miembros, setMiembros] = useState<MiembroItem[]>(initialData?.miembros || []);
    const [celulas, setCelulas] = useState<CelulaSimple[]>(initialData?.celulas || []);
    const [stats, setStats] = useState(initialData?.stats || {
        total: 0,
        activos: 0,
        nuevos: 0,
        conDecadas: 0,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCelula, setFilterCelula] = useState("all");
    const [filterEstado, setFilterEstado] = useState("all");

    // Fetch data if not provided
    useState(() => {
        if (!initialData) {
            fetch("/api/miembros")
                .then((res) => res.json())
                .then((data) => {
                    setMiembros(data.miembros);
                    setCelulas(data.celulas);
                    setStats(data.stats);
                })
                .catch((err) => {
                    console.error("Error fetching miembros:", err);
                    toast.error("Error al cargar los datos");
                })
                .finally(() => setIsLoading(false));
        }
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isBajaOpen, setIsBajaOpen] = useState(false);
    const [isReactivarOpen, setIsReactivarOpen] = useState(false);

    const [selectedMiembro, setSelectedMiembro] = useState<MiembroItem | null>(null);
    const [form, setForm] = useState(emptyForm);

    const filteredMiembros = miembros.filter((m) => {
        const matchSearch =
            m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.telefono || "").includes(searchTerm);
        const matchCelula = filterCelula === "all" || String(m.celulaId) === filterCelula;
        const matchEstado = filterEstado === "all" || m.estado === filterEstado;
        return matchSearch && matchCelula && matchEstado;
    });

    function openEdit(miembro: MiembroItem) {
        setSelectedMiembro(miembro);
        setForm({
            nombre: miembro.nombre,
            apellido: miembro.apellido,
            telefono: miembro.telefono || "",
            direccion: miembro.direccion || "",
            cedula: miembro.cedula || "",
            fechaNacimiento: miembro.fechaNacimiento
                ? new Date(miembro.fechaNacimiento).toISOString().split("T")[0]
                : "",
            estadoCivil: miembro.estadoCivil || "",
            genero: miembro.genero || "",
            profesion: miembro.profesion || "",
            celulaId: miembro.celulaId ? String(miembro.celulaId) : "",
            notas: miembro.notas || "",
        });
        setIsEditOpen(true);
    }

    function openView(miembro: MiembroItem) {
        setSelectedMiembro(miembro);
        setIsViewOpen(true);
    }

    function openBaja(miembro: MiembroItem) {
        setSelectedMiembro(miembro);
        setIsBajaOpen(true);
    }

    function openReactivar(miembro: MiembroItem) {
        setSelectedMiembro(miembro);
        setIsReactivarOpen(true);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            try {
                const nuevo = await createMiembro({
                    nombre: form.nombre,
                    apellido: form.apellido,
                    telefono: form.telefono || undefined,
                    direccion: form.direccion || undefined,
                    cedula: form.cedula || undefined,
                    fechaNacimiento: form.fechaNacimiento ? new Date(form.fechaNacimiento) : undefined,
                    estadoCivil: (form.estadoCivil as EstadoCivil) || undefined,
                    genero: (form.genero as Genero) || undefined,
                    profesion: form.profesion || undefined,
                    celulaId: form.celulaId && form.celulaId !== "none" ? Number(form.celulaId) : undefined,
                    notas: form.notas || undefined,
                });
                setMiembros((prev) => [nuevo as unknown as MiembroItem, ...prev]);
                setStats((prev) => ({
                    total: prev.total + 1,
                    activos: prev.activos + 1,
                    nuevos: prev.nuevos + 1,
                    conDecadas: prev.conDecadas + (form.celulaId && form.celulaId !== "none" ? 1 : 0),
                }));
                setIsCreateOpen(false);
                setForm(emptyForm);
                toast.success(`Miembro ${nuevo.nombre} ${nuevo.apellido} creado exitosamente`);
                router.refresh();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error al crear el miembro");
            }
        });
    }

    async function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedMiembro) return;
        startTransition(async () => {
            try {
                const updated = await updateMiembro(selectedMiembro.id, {
                    nombre: form.nombre,
                    apellido: form.apellido,
                    telefono: form.telefono || undefined,
                    direccion: form.direccion || undefined,
                    cedula: form.cedula || undefined,
                    fechaNacimiento: form.fechaNacimiento ? new Date(form.fechaNacimiento) : undefined,
                    estadoCivil: (form.estadoCivil as EstadoCivil) || undefined,
                    genero: (form.genero as Genero) || undefined,
                    profesion: form.profesion || undefined,
                    celulaId: form.celulaId && form.celulaId !== "none" ? Number(form.celulaId) : undefined,
                    notas: form.notas || undefined,
                });
                setMiembros((prev) =>
                    prev.map((m) => (m.id === selectedMiembro.id ? (updated as unknown as MiembroItem) : m))
                );
                setIsEditOpen(false);
                toast.success("Miembro actualizado exitosamente");
                router.refresh();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error al actualizar el miembro");
            }
        });
    }

    async function handleBaja() {
        if (!selectedMiembro) return;
        startTransition(async () => {
            try {
                await cambiarEstadoMiembro(String(selectedMiembro.id), "baja");
                setMiembros((prev) =>
                    prev.map((m) => (m.id === selectedMiembro.id ? { ...m, estado: "baja" as EstadoMiembro } : m))
                );
                setStats((prev) => ({
                    ...prev,
                    activos: Math.max(0, prev.activos - 1),
                }));
                setIsBajaOpen(false);
                toast.success("Miembro dado de baja exitosamente");
                router.refresh();
            } catch {
                toast.error("Error al dar de baja el miembro");
            }
        });
    }

    async function handleReactivar() {
        if (!selectedMiembro) return;
        startTransition(async () => {
            try {
                await cambiarEstadoMiembro(String(selectedMiembro.id), "activo");
                setMiembros((prev) =>
                    prev.map((m) => (m.id === selectedMiembro.id ? { ...m, estado: "activo" as EstadoMiembro } : m))
                );
                setStats((prev) => ({
                    ...prev,
                    activos: prev.activos + 1,
                }));
                setIsReactivarOpen(false);
                toast.success("Miembro reactivado exitosamente");
                router.refresh();
            } catch {
                toast.error("Error al reactivar el miembro");
            }
        });
    }

    const celulaLabel = (celulaId?: number | string) => {
        const id = typeof celulaId === "string" ? Number(celulaId) : celulaId;
        const c = celulas.find((c) => c.id === id);
        return c ? c.nombre : "—";
    };

    const initials = (m: MiembroItem) => `${m.nombre[0] || ""}${m.apellido[0] || ""}`;

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="title-page">Miembros</h1>
                    <p className="text-muted-foreground">Gestiona los miembros de la congregación</p>
                </div>
                <Button className="gap-2" onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }}>
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
                            <p className="text-2xl font-bold">{stats.total}</p>
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
                            <p className="text-2xl font-bold">{stats.activos}</p>
                            <p className="text-sm text-muted-foreground">Miembros Activos</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                            <MapPin className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.conDecadas}</p>
                            <p className="text-sm text-muted-foreground">En Células</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                            <Phone className="h-6 w-6 text-info" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.nuevos}</p>
                            <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Listado */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="title-section">Listado de Miembros</CardTitle>
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
                            <Select value={filterCelula} onValueChange={setFilterCelula}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="Célula" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las células</SelectItem>
                                    {celulas.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterEstado} onValueChange={setFilterEstado}>
                                <SelectTrigger className="w-full sm:w-36">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                    <SelectItem value="baja">Baja</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={() => { setSearchTerm(""); setFilterCelula("all"); setFilterEstado("all"); }}>
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
                                    <TableHead className="hidden sm:table-cell">Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMiembros.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No se encontraron miembros
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredMiembros.map((miembro) => (
                                        <TableRow key={miembro.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                                            {initials(miembro)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{miembro.nombre} {miembro.apellido}</p>
                                                        <p className="text-xs text-muted-foreground md:hidden">{miembro.telefono}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{miembro.telefono || "—"}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div>
                                                    <p className="text-sm">{celulaLabel(miembro.celulaId)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {miembro.celula?.territorio?.nombre || ""}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge className={estadoColors[miembro.estado] || "bg-muted"}>
                                                    {miembro.estado}
                                                </Badge>
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
                                                        <DropdownMenuItem onClick={() => openView(miembro)}>Ver Perfil</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEdit(miembro)}>Editar</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {miembro.estado === "baja" ? (
                                                            <DropdownMenuItem
                                                                onClick={() => openReactivar(miembro)}
                                                            >
                                                                Reactivar
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => openBaja(miembro)}
                                                            >
                                                                Dar de Baja
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* ─── Dialog: Nuevo Miembro ─── */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                    <form onSubmit={handleCreate}>
                        <div className="bg-primary px-6 py-8 text-primary-foreground">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Nuevo Miembro</DialogTitle>
                                <DialogDescription className="text-primary-foreground/80">
                                    Registra a un nuevo integrante en la congregación.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <MiembroForm form={form} setForm={setForm} celulas={celulas} />
                        </div>
                        <DialogFooter className="bg-muted/50 px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="min-w-[120px]">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ─── Dialog: Editar Miembro ─── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                    <form onSubmit={handleEdit}>
                        <div className="bg-accent px-6 py-8 text-accent-foreground">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Editar Miembro</DialogTitle>
                                <DialogDescription className="text-accent-foreground/80">
                                    Actualiza la información del miembro seleccionado.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <MiembroForm form={form} setForm={setForm} celulas={celulas} />
                        </div>
                        <DialogFooter className="bg-muted/50 px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="min-w-[120px]">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Actualizar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ─── Dialog: Ver Perfil ─── */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Perfil del Miembro</DialogTitle>
                    </DialogHeader>
                    {selectedMiembro && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                        {initials(selectedMiembro)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedMiembro.nombre} {selectedMiembro.apellido}</h3>
                                    <Badge className={estadoColors[selectedMiembro.estado]}>{selectedMiembro.estado}</Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={selectedMiembro.telefono} />
                                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Célula" value={celulaLabel(selectedMiembro.celulaId)} />
                                <InfoRow icon={<UserCheck className="h-4 w-4" />} label="Cédula" value={selectedMiembro.cedula} />
                                <InfoRow icon={<Calendar className="h-4 w-4" />} label="F. Conversión"
                                    value={selectedMiembro.fechaConversion ? new Date(selectedMiembro.fechaConversion).toLocaleDateString("es-VE") : undefined} />
                                <InfoRow icon={<Users className="h-4 w-4" />} label="Género" value={selectedMiembro.genero} />
                                <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Profesión" value={selectedMiembro.profesion} />
                            </div>
                            {selectedMiembro.notas && (
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Notas</p>
                                    <p className="text-sm">{selectedMiembro.notas}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
                                <div className="rounded-lg bg-muted/50 p-2">
                                    <p className="text-sm font-medium">{selectedMiembro.encuentro ? "Sí" : "No"}</p>
                                    <p className="text-xs text-muted-foreground">Encuentro</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-2">
                                    <p className="text-sm font-medium">{selectedMiembro.bautismo ? "Sí" : "No"}</p>
                                    <p className="text-xs text-muted-foreground">Bautismo</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-2">
                                    <p className="text-sm font-medium capitalize">{selectedMiembro.escuelaFundamento?.replace("_", " ")}</p>
                                    <p className="text-xs text-muted-foreground">Fundamento</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewOpen(false)}>Cerrar</Button>
                        {selectedMiembro && (
                            <Button onClick={() => { setIsViewOpen(false); openEdit(selectedMiembro); }}>Editar</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── Alert: Dar de Baja ─── */}
            <AlertDialog open={isBajaOpen} onOpenChange={setIsBajaOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Dar de baja a este miembro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedMiembro && (
                                <>Esta acción cambiará el estado de <strong>{selectedMiembro.nombre} {selectedMiembro.apellido}</strong> a &quot;baja&quot;. Podrá reactivarlo posteriormente.</>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBaja} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Dar de Baja
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ─── Alert: Reactivar Miembro ─── */}
            <AlertDialog open={isReactivarOpen} onOpenChange={setIsReactivarOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Reactivar este miembro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedMiembro && (
                                <>Esta acción cambiará el estado de <strong>{selectedMiembro.nombre} {selectedMiembro.apellido}</strong> a &quot;activo&quot;.</>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReactivar} className="bg-success text-success-foreground hover:bg-success/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reactivar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ─── Subcomponente: Form Fields ─────────────────────────────────────────────
function MiembroForm({
    form,
    setForm,
    celulas,
}: {
    form: typeof emptyForm;
    setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
    celulas: CelulaSimple[];
}) {
    const set = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    const setSelect = (field: keyof typeof emptyForm) => (val: string) =>
        setForm((prev) => ({ ...prev, [field]: val }));

    return (
        <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="personal" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="contacto" className="gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">Contacto</span>
                </TabsTrigger>
                <TabsTrigger value="iglesia" className="gap-2">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Iglesia</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="f-nombre" className="text-sm font-semibold">Nombre *</Label>
                        <Input id="f-nombre" value={form.nombre} onChange={set("nombre")} placeholder="Ej. Juan" required className="bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="f-apellido" className="text-sm font-semibold">Apellido *</Label>
                        <Input id="f-apellido" value={form.apellido} onChange={set("apellido")} placeholder="Ej. Pérez" required className="bg-muted/30" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="f-cedula" className="text-sm font-semibold">Cédula / ID</Label>
                        <Input id="f-cedula" value={form.cedula} onChange={set("cedula")} placeholder="V-00.000.000" className="bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="f-fnac" className="text-sm font-semibold">Fecha de Nacimiento</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="f-fnac" type="date" value={form.fechaNacimiento} onChange={set("fechaNacimiento")} className="pl-10 bg-muted/30" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="f-genero" className="text-sm font-semibold">Género</Label>
                        <Select value={form.genero} onValueChange={setSelect("genero")}>
                            <SelectTrigger id="f-genero" className="bg-muted/30"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="femenino">Femenino</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="f-ecivil" className="text-sm font-semibold">Estado Civil</Label>
                        <Select value={form.estadoCivil} onValueChange={setSelect("estadoCivil")}>
                            <SelectTrigger id="f-ecivil" className="bg-muted/30"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="soltero">Soltero/a</SelectItem>
                                <SelectItem value="casado">Casado/a</SelectItem>
                                <SelectItem value="divorciado">Divorciado/a</SelectItem>
                                <SelectItem value="viudo">Viudo/a</SelectItem>
                                <SelectItem value="union_libre">Unión Libre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="contacto" className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                    <Label htmlFor="f-telefono" className="text-sm font-semibold">Teléfono de Contacto</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="f-telefono" value={form.telefono} onChange={set("telefono")} placeholder="+58 412-0000000" className="pl-10 bg-muted/30" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="f-direccion" className="text-sm font-semibold">Dirección de Habitación</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea id="f-direccion" value={form.direccion} onChange={set("direccion")} placeholder="Calle, sector, ciudad..." className="pl-10 bg-muted/30 min-h-[100px]" />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="iglesia" className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="f-celula" className="text-sm font-semibold">Célula Asignada</Label>
                        <Select value={form.celulaId} onValueChange={setSelect("celulaId")}>
                            <SelectTrigger id="f-celula" className="bg-muted/30"><SelectValue placeholder="Seleccionar célula" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin célula</SelectItem>
                                {celulas.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="f-profesion" className="text-sm font-semibold">Profesión / Oficio</Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="f-profesion" value={form.profesion} onChange={set("profesion")} placeholder="Ej. Ingeniero" className="pl-10 bg-muted/30" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="f-notas" className="text-sm font-semibold">Notas Adicionales</Label>
                    <div className="relative">
                        <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea id="f-notas" value={form.notas} onChange={set("notas")} rows={3} placeholder="Observaciones importantes..." className="pl-10 bg-muted/30" />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}

// ─── Subcomponente: InfoRow ─────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground">{icon}</span>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
}
