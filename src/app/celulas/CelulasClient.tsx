"use client";

import { useEffect, useState, useTransition } from "react";
import {
    Grid3X3, Users, MapPin, Plus, Calendar, MoreHorizontal, Loader2, Search, Save, Info, Tag, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { createCelula, updateCelula } from "@/lib/actions/celulas.actions";
import { useRouter } from "next/navigation";

// ─── Interfaces simples ────────────────────────────────────────────────────
type DiaReunion = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

type HorariosReunion = Partial<Record<DiaReunion, string>>;

interface TerritorioSimple {
    id: number;
    nombre: string;
    codigo: string;
}

interface MiembroOption {
    id: number;
    nombre: string;
    apellido: string;
    celulaId?: number;
}

interface CelulaItem {
    id: number;
    codigo: string;
    nombre: string;
    territorioId: number;
    direccion?: string;
    diasReunion?: DiaReunion[];
    horariosReunion?: HorariosReunion;
    horaReunion?: string;
    activo: boolean;
    territorio?: TerritorioSimple;
    lider?: { id: number; nombre: string; apellido: string };
    colider?: { id: number; nombre: string; apellido: string };
    liderId?: number;
    coliderId?: number;
    _miembros: number;
    _asistencia: number;
    _ganados: number;
}

type Props = {
    initialData?: {
        celulas: CelulaItem[];
        territorios: TerritorioSimple[];
    };
};

const diasSemana: { value: DiaReunion; label: string }[] = [
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miercoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
    { value: "sabado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
];

const diaLabel = (dia?: string) => diasSemana.find((d) => d.value === dia)?.label ?? dia ?? "—";

const emptyForm = {
    codigo: "",
    nombre: "",
    territorioId: "",
    direccion: "",
    diasReunion: [] as DiaReunion[],
    horariosReunion: {} as HorariosReunion,
    horaReunion: "",
    liderId: "",
    coliderId: "",
};

export default function CelulasClient({ initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(!initialData);

    const [celulas, setCelulas] = useState<CelulaItem[]>(initialData?.celulas || []);
    const [territorios, setTerritorios] = useState<TerritorioSimple[]>(initialData?.territorios || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTerritorio, setFilterTerritorio] = useState("all");
    const [filterDia, setFilterDia] = useState("all");

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<CelulaItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [celulaMembers, setCelulaMembers] = useState<MiembroOption[]>([]);

    // Fetch data if not provided
    const fetchCelulas = async () => {
        try {
            const res = await fetch("/api/celulas", { cache: "no-store" });
            const data = await res.json();
            setCelulas(data.celulas || []);
            setTerritorios(data.territorios || []);
        } catch (err) {
            console.error("Error fetching celulas:", err);
            toast.error("Error al cargar los datos");
            setCelulas([]);
            setTerritorios([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData) {
            fetchCelulas();
        }
    }, [initialData]);

    // Filtrado
    const filtered = celulas.filter((c) => {
        const matchSearch =
            c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.codigo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchTerr = filterTerritorio === "all" || c.territorioId === parseInt(filterTerritorio);
        const matchDia = filterDia === "all" || (c.diasReunion && c.diasReunion.includes(filterDia as DiaReunion));
        return matchSearch && matchTerr && matchDia;
    });

    const getSelectedDias = (horarios: HorariosReunion) =>
        (Object.entries(horarios) as [DiaReunion, string][])
            .filter(([, hora]) => hora?.trim())
            .map(([dia]) => dia);

    function openEdit(c: CelulaItem) {
        setSelected(c);
        setCelulaMembers([]);
        setForm({
            codigo: c.codigo,
            nombre: c.nombre,
            territorioId: String(c.territorioId),
            direccion: c.direccion || "",
            diasReunion: c.diasReunion || getSelectedDias(c.horariosReunion || {}),
            horariosReunion: c.horariosReunion || {},
            horaReunion: c.horaReunion || "",
            liderId: c.lider?.id ? String(c.lider.id) : "",
            coliderId: c.colider?.id ? String(c.colider.id) : "",
        });
        fetch(`/api/miembros?celulaId=${c.id}`)
            .then((res) => res.json())
            .then((data) => setCelulaMembers(data.miembros || []))
            .catch((err) => {
                console.error("Error fetching miembros for celula:", err);
                toast.error("Error al cargar miembros de la célula");
            });
        setIsEditOpen(true);
    }

    function openView(c: CelulaItem) {
        setSelected(c);
        setIsViewOpen(true);
    }

    function openDelete(c: CelulaItem) {
        setSelected(c);
        setIsDeleteOpen(true);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            try {
                const horariosReunion = Object.fromEntries(
                    Object.entries(form.horariosReunion).filter(([, hora]) => hora?.trim())
                ) as HorariosReunion;
                const diasReunion = getSelectedDias(horariosReunion);

                const territorioId = Number(form.territorioId);
                if (!territorioId || isNaN(territorioId)) {
                    throw new Error("Selecciona un territorio válido antes de crear la célula.");
                }

                const nueva = await createCelula({
                    codigo: form.codigo,
                    nombre: form.nombre,
                    territorioId,
                    direccion: form.direccion || undefined,
                    diasReunion: diasReunion.length > 0 ? diasReunion : undefined,
                    horariosReunion: Object.keys(horariosReunion).length > 0 ? horariosReunion : undefined,
                    horaReunion: form.horaReunion || undefined,
                    liderId: form.liderId && form.liderId !== "none" ? Number(form.liderId) : null,
                    coliderId: form.coliderId && form.coliderId !== "none" ? Number(form.coliderId) : null,
                });
                setIsCreateOpen(false);
                setForm(emptyForm);
                toast.success(`Célula "${form.nombre}" creada exitosamente`);
                // Refetch to update the list with correct stats
                fetchCelulas();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error al crear la célula. Verifica que el código sea único.");
            }
        });
    }

    async function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!selected) return;
        startTransition(async () => {
            try {
                const horariosReunion = Object.fromEntries(
                    Object.entries(form.horariosReunion).filter(([, hora]) => hora?.trim())
                ) as HorariosReunion;
                const diasReunion = getSelectedDias(horariosReunion);

                const territorioId = Number(form.territorioId);
                if (!territorioId || isNaN(territorioId)) {
                    throw new Error("Selecciona un territorio válido antes de actualizar la célula.");
                }

                const updated = await updateCelula(selected.id, {
                    codigo: form.codigo,
                    nombre: form.nombre,
                    territorioId,
                    direccion: form.direccion || undefined,
                    diasReunion: diasReunion.length > 0 ? diasReunion : undefined,
                    horariosReunion: Object.keys(horariosReunion).length > 0 ? horariosReunion : undefined,
                    horaReunion: form.horaReunion || undefined,
                    liderId: form.liderId && form.liderId !== "none" ? Number(form.liderId) : null,
                    coliderId: form.coliderId && form.coliderId !== "none" ? Number(form.coliderId) : null,
                });
                setIsEditOpen(false);
                toast.success("Célula actualizada exitosamente");
                // Refetch to update the list
                fetchCelulas();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error al actualizar la célula");
            }
        });
    }

    async function handleDelete() {
        if (!selected) return;
        startTransition(async () => {
            try {
                const res = await fetch(`/api/celulas?id=${selected.id}`, {
                    method: "DELETE",
                    cache: "no-store",
                });

                if (!res.ok) {
                    const payload = await res.json().catch(() => null);
                    throw new Error(payload?.error || "Error al eliminar la célula");
                }

                setIsDeleteOpen(false);
                setCelulas((prev) => prev.filter((c) => c.id !== selected.id));
                setSelected(null);
                toast.success("Célula eliminada exitosamente");
                // Refetch to update the list
                await fetchCelulas();
            } catch (error) {
                console.error("Delete célula error:", error);
                toast.error(error instanceof Error ? error.message : "Error al eliminar la célula");
            }
        });
    }

    const totalMiembros = filtered.reduce((acc, c) => acc + c._miembros, 0);
    const avgAsistencia = filtered.length
        ? Math.round(filtered.reduce((acc, c) => acc + c._asistencia, 0) / filtered.length)
        : 0;
    const totalGanados = filtered.reduce((acc, c) => acc + c._ganados, 0);

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
                    <h1 className="title-page">Células</h1>
                    <p className="text-muted-foreground">Gestiona las células y sus miembros</p>
                </div>
                <Button className="gap-2" onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }}>
                    <Plus className="h-4 w-4" />
                    Nueva Célula
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar célula..."
                        className="pl-10 w-52"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterTerritorio} onValueChange={setFilterTerritorio}>
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Territorio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los territorios</SelectItem>
                        {territorios.map((t) => (
                            <SelectItem key={t.id} value={t.id.toString()}>{t.nombre}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterDia} onValueChange={setFilterDia}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Día" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los días</SelectItem>
                        {diasSemana.map((d) => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
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
                            <p className="text-2xl font-bold">{filtered.length}</p>
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
                            <p className="text-2xl font-bold">{totalMiembros}</p>
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
                            <p className="text-2xl font-bold">{avgAsistencia}%</p>
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
                            <p className="text-2xl font-bold">+{totalGanados}</p>
                            <p className="text-sm text-muted-foreground">Ganados Este Mes</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cells Grid */}
            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No se encontraron células con los filtros aplicados.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((celula) => (
                        <Card key={celula.id} className="animate-fade-in">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge variant="secondary" className="mb-2">{celula.codigo}</Badge>
                                        <CardTitle className="title-section">{celula.nombre}</CardTitle>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            {celula.territorio?.nombre || "Sin territorio"}
                                        </p>
                                        {celula.lider && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                <span className="font-medium">Líder:</span> {celula.lider.nombre} {celula.lider.apellido}
                                            </p>
                                        )}
                                        {celula.colider && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                <span className="font-medium">Co-líder:</span> {celula.colider.nombre} {celula.colider.apellido}
                                            </p>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(celula)}>Ver Detalles</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openEdit(celula)}>Editar</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => openDelete(celula)}>
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Schedule */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {celula.horariosReunion && Object.keys(celula.horariosReunion).length > 0
                                            ? (Object.entries(celula.horariosReunion) as [DiaReunion, string][]) 
                                                  .map(([dia, hora]) => `${diaLabel(dia)} ${hora?.slice(0, 5)}`)
                                                  .join(" • ")
                                            : celula.diasReunion && celula.diasReunion.length > 0
                                                ? celula.diasReunion.map(d => diaLabel(d)).join(", ")
                                                : "Sin días definidos"}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
                                    <div>
                                        <p className="text-lg font-bold">{celula._miembros}</p>
                                        <p className="text-xs text-muted-foreground">Miembros</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-success">+{celula._ganados}</p>
                                        <p className="text-xs text-muted-foreground">Ganados</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold">{celula._asistencia}%</p>
                                        <p className="text-xs text-muted-foreground">Asistencia</p>
                                    </div>
                                </div>

                                {/* Attendance Progress */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Asistencia promedio</span>
                                        <span className="font-medium">{celula._asistencia}%</span>
                                    </div>
                                    <Progress value={celula._asistencia} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ─── Dialog: Nueva Célula ─── */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-none shadow-2xl">
                    <form onSubmit={handleCreate}>
                        <div className="bg-primary px-6 py-8 text-primary-foreground">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Nueva Célula</DialogTitle>
                                <DialogDescription className="text-primary-foreground/80">
                                    Registra una nueva célula de crecimiento en la congregación.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <CelulaForm form={form} setForm={setForm} territorios={territorios} members={celulaMembers} />
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

            {/* ─── Dialog: Editar Célula ─── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-none shadow-2xl">
                    <form onSubmit={handleEdit}>
                        <div className="bg-accent px-6 py-8 text-accent-foreground">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Editar Célula</DialogTitle>
                                <DialogDescription className="text-accent-foreground/80">
                                    Actualiza la información de la célula seleccionada.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <CelulaForm form={form} setForm={setForm} territorios={territorios} members={celulaMembers} />
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

            {/* ─── Dialog: Ver Detalle ─── */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Detalle de la Célula</DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary">{selected.codigo}</Badge>
                                <div>
                                    <h3 className="font-bold">{selected.nombre}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {selected.territorio?.nombre || "Sin territorio"}
                                    </p>
                                    {selected.lider && (
                                        <p className="text-xs text-muted-foreground mt-1"><span className="font-medium">Líder:</span> {selected.lider.nombre} {selected.lider.apellido}</p>
                                    )}
                                    {selected.colider && (
                                        <p className="text-xs text-muted-foreground mt-1"><span className="font-medium">Co-líder:</span> {selected.colider.nombre} {selected.colider.apellido}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    {selected.horariosReunion && Object.keys(selected.horariosReunion).length > 0 ? (
                                        <div className="space-y-1">
                                            {Object.entries(selected.horariosReunion).map(([dia, hora]) => (
                                                <div key={dia} className="flex items-center gap-2">
                                                    <span className="font-medium">{diaLabel(dia as DiaReunion)}:</span>
                                                    <span>{hora?.slice(0, 5)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : selected.diasReunion && selected.diasReunion.length > 0 ? (
                                        <span>{selected.diasReunion.map(d => diaLabel(d)).join(", ")}</span>
                                    ) : (
                                        <span>Sin días definidos</span>
                                    )}
                                </div>
                            </div>
                            {selected.direccion && (
                                <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{selected.direccion}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xl font-bold">{selected._miembros}</p>
                                    <p className="text-xs text-muted-foreground">Miembros</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xl font-bold text-success">+{selected._ganados}</p>
                                    <p className="text-xs text-muted-foreground">Ganados</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xl font-bold">{selected._asistencia}%</p>
                                    <p className="text-xs text-muted-foreground">Asistencia</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewOpen(false)}>Cerrar</Button>
                        {selected && (
                            <Button onClick={() => { setIsViewOpen(false); openEdit(selected); }}>Editar</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── Alert: Eliminar Célula ─── */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta célula?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selected && (
                                <>La célula <strong>{selected.nombre}</strong> será desactivada. Los miembros asignados quedarán sin célula.</>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ─── Subcomponente: CelulaForm ──────────────────────────────────────────────
function CelulaForm({
    form,
    setForm,
    territorios,
    members,
}: {
    form: typeof emptyForm;
    setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
    territorios: TerritorioSimple[];
    members: MiembroOption[];
}) {
    const set = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    const setSelect = (field: keyof typeof emptyForm) => (val: string) =>
        setForm((prev) => ({ ...prev, [field]: val }));

    const toggleDia = (dia: DiaReunion, checked: boolean) => {
        setForm((prev) => {
            const diasReunion = checked
                ? [...new Set([...prev.diasReunion, dia])]
                : prev.diasReunion.filter((d) => d !== dia);
            const horariosReunion = { ...prev.horariosReunion };
            if (!checked) {
                delete horariosReunion[dia];
            }
            return { ...prev, diasReunion, horariosReunion };
        });
    };

    const setHora = (dia: DiaReunion, value: string) => {
        setForm((prev) => {
            const horariosReunion = { ...prev.horariosReunion };
            if (value.trim()) {
                horariosReunion[dia] = value;
            } else {
                delete horariosReunion[dia];
            }
            const diasReunion = value.trim()
                ? [...new Set([...prev.diasReunion, dia])]
                : prev.diasReunion.filter((d) => d !== dia);
            return { ...prev, diasReunion, horariosReunion };
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="c-nombre" className="text-sm font-semibold">Nombre de la Célula *</Label>
                    <div className="relative">
                        <Grid3X3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="c-nombre" value={form.nombre} onChange={set("nombre")} placeholder="Ej. Célula Norte" required className="pl-10 bg-muted/30" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="c-codigo" className="text-sm font-semibold">Código *</Label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="c-codigo" value={form.codigo} onChange={set("codigo")} placeholder="Ej. C-N02" required className="pl-10 bg-muted/30" />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="c-territorio" className="text-sm font-semibold">Territorio *</Label>
                <Select value={form.territorioId} onValueChange={(val) => setForm((prev) => ({ ...prev, territorioId: val }))} required>
                    <SelectTrigger id="c-territorio" className="bg-muted/30"><SelectValue placeholder="Seleccionar territorio" /></SelectTrigger>
                    <SelectContent>
                        {territorios.map((t) => (
                            <SelectItem key={t.id} value={t.id.toString()}>{t.nombre}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="c-lider" className="text-sm font-semibold">Líder de la célula</Label>
                    <Select value={form.liderId} onValueChange={setSelect("liderId")}>
                        <SelectTrigger id="c-lider" className="bg-muted/30"><SelectValue placeholder="Seleccionar líder" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem key="none" value="none">Sin líder</SelectItem>
                            {members.length === 0 ? (
                                <SelectItem key="none-disabled" value="none-disabled" disabled>No hay miembros en esta célula</SelectItem>
                            ) : (
                                members.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>{m.nombre} {m.apellido}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="c-colider" className="text-sm font-semibold">Co-líder de la célula</Label>
                    <Select value={form.coliderId} onValueChange={setSelect("coliderId")}>
                        <SelectTrigger id="c-colider" className="bg-muted/30"><SelectValue placeholder="Seleccionar co-líder" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem key="none" value="none">Sin co-líder</SelectItem>
                            {members.length === 0 ? (
                                <SelectItem key="none-disabled" value="none-disabled" disabled>No hay miembros en esta célula</SelectItem>
                            ) : (
                                members.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>{m.nombre} {m.apellido}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-sm font-semibold">Horario por día</Label>
                <p className="text-xs text-muted-foreground">Marca los días de reunión y asigna la hora correspondiente para cada uno.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {diasSemana.map((dia) => {
                        const selected = form.diasReunion.includes(dia.value);
                        return (
                            <div key={dia.value} className="rounded-lg border border-muted/40 bg-muted/30 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <label htmlFor={`dia-${dia.value}`} className="flex items-center gap-2 text-sm font-medium">
                                        <input
                                            type="checkbox"
                                            id={`dia-${dia.value}`}
                                            checked={selected}
                                            onChange={(e) => toggleDia(dia.value, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        {dia.label}
                                    </label>
                                    <Input
                                        id={`hora-${dia.value}`}
                                        type="time"
                                        value={form.horariosReunion[dia.value] ?? ""}
                                        onChange={(e) => setHora(dia.value, e.target.value)}
                                        className="max-w-[130px] bg-muted/30"
                                        disabled={!selected}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="c-dir" className="text-sm font-semibold">Dirección de la Célula</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="c-dir" value={form.direccion} onChange={set("direccion")} placeholder="Ej. Av. Principal #123, Sector Norte" className="pl-10 bg-muted/30" />
                </div>
            </div>
        </div>
    );
}
