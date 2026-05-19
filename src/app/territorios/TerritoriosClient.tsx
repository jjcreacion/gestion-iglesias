"use client";

import { useState, useTransition, useEffect } from "react";
import { MapPin, Users, Grid3X3, Plus, MoreHorizontal, Loader2, Save, Info, Tag, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { createTerritorio, updateTerritorio } from "@/lib/actions/territorios.actions";
import { useRouter } from "next/navigation";

// ─── Interfaces simples ────────────────────────────────────────────────────
interface MiembroOption {
    id: number;
    nombre: string;
    apellido: string;
    celulaId?: number;
}

interface TerritorioItem {
    id: number;
    codigo: string;
    nombre: string;
    color: string;
    descripcion?: string;
    activo: boolean;
    createdAt: Date | string;
    _celulas: number;
    _miembros: number;
    lider?: { id: number; nombre: string; apellido: string };
    colider?: { id: number; nombre: string; apellido: string };
    liderId?: number;
    coliderId?: number;
}

type Props = {
    initialTerritorios?: TerritorioItem[];
};

const emptyForm = {
    codigo: "",
    nombre: "",
    color: "#1a365d",
    descripcion: "",
    liderId: "",
    coliderId: "",
};

export default function TerritoriosClient({ initialTerritorios }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(!initialTerritorios);

    const [territorios, setTerritorios] = useState<TerritorioItem[]>(initialTerritorios || []);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<TerritorioItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [territorioMembers, setTerritorioMembers] = useState<MiembroOption[]>([]);

    // Fetch data if not provided
    const fetchTerritorios = async () => {
        try {
            const res = await fetch("/api/territorios", { cache: "no-store" });
            const data = await res.json();
            setTerritorios(data.territorios || []);
        } catch (err) {
            console.error("Error fetching territorios:", err);
            toast.error("Error al cargar los datos");
            setTerritorios([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!initialTerritorios) {
            fetchTerritorios();
        }
    }, [initialTerritorios]);

    function openEdit(t: TerritorioItem) {
        setSelected(t);
        setTerritorioMembers([]);
        setForm({
            codigo: t.codigo,
            nombre: t.nombre,
            color: t.color,
            descripcion: t.descripcion || "",
            liderId: t.lider?.id ? String(t.lider.id) : "",
            coliderId: t.colider?.id ? String(t.colider.id) : "",
        });
        fetch(`/api/miembros?territorioId=${t.id}`)
            .then((res) => res.json())
            .then((data) => setTerritorioMembers(data.miembros || []))
            .catch((err) => {
                console.error("Error fetching miembros for territorio:", err);
                toast.error("Error al cargar los miembros del territorio");
            });
        setIsEditOpen(true);
    }

    function openView(t: TerritorioItem) {
        setSelected(t);
        setIsViewOpen(true);
    }

    function openDelete(t: TerritorioItem) {
        setSelected(t);
        setIsDeleteOpen(true);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            try {
                const nuevo = await createTerritorio({
                    codigo: form.codigo,
                    nombre: form.nombre,
                    color: form.color,
                    descripcion: form.descripcion || undefined,
                    liderId: form.liderId && form.liderId !== "none" ? Number(form.liderId) : null,
                    coliderId: form.coliderId && form.coliderId !== "none" ? Number(form.coliderId) : null,
                });
                setIsCreateOpen(false);
                setForm(emptyForm);
                toast.success(`Territorio "${form.nombre}" creado exitosamente`);
                // Refetch to update the list with correct stats
                fetchTerritorios();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error al crear el territorio. Verifica que el código sea único.");
            }
        });
    }

    async function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!selected) return;
        startTransition(async () => {
            try {
                await updateTerritorio(selected.id, {
                    codigo: form.codigo,
                    nombre: form.nombre,
                    color: form.color,
                    descripcion: form.descripcion || undefined,
                    liderId: form.liderId && form.liderId !== "none" ? Number(form.liderId) : null,
                    coliderId: form.coliderId && form.coliderId !== "none" ? Number(form.coliderId) : null,
                });
                setIsEditOpen(false);
                toast.success("Territorio actualizado exitosamente");
                // Refetch to update the list
                await fetchTerritorios();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error al actualizar el territorio");
            }
        });
    }

    async function handleDelete() {
        if (!selected) return;
        startTransition(async () => {
            try {
                const res = await fetch(`/api/territorios?id=${selected.id}`, {
                    method: "DELETE",
                    cache: "no-store",
                });

                if (!res.ok) {
                    const payload = await res.json().catch(() => null);
                    throw new Error(payload?.error || "Error al eliminar el territorio");
                }

                setIsDeleteOpen(false);
                setTerritorios((prev) => prev.filter((t) => t.id !== selected.id));
                setSelected(null);
                toast.success("Territorio eliminado exitosamente");
                // Refetch to update the list
                await fetchTerritorios();
            } catch (error) {
                console.error("Delete territorio error:", error);
                toast.error(error instanceof Error ? error.message : "Error al eliminar el territorio");
            }
        });
    }

    const totalCelulas = territorios.reduce((acc, t) => acc + t._celulas, 0);
    const totalMiembros = territorios.reduce((acc, t) => acc + t._miembros, 0);

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
                    <h1 className="title-page">Territorios</h1>
                    <p className="text-muted-foreground">Gestiona las zonas y territorios de la iglesia</p>
                </div>
                <Button className="gap-2" onClick={() => { setForm(emptyForm); setTerritorioMembers([]); setIsCreateOpen(true); }}>
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
                            <p className="text-2xl font-bold">{totalCelulas}</p>
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
                            <p className="text-2xl font-bold">{totalMiembros}</p>
                            <p className="text-sm text-muted-foreground">Miembros Totales</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Territory Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {territorios.map((territorio) => (
                    <Card key={territorio.id} className="overflow-hidden animate-fade-in">
                        <div className="h-2" style={{ backgroundColor: territorio.color }} />
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <Badge variant="secondary" className="mb-2">{territorio.codigo}</Badge>
                                    <CardTitle className="title-section">{territorio.nombre}</CardTitle>
                                    {territorio.descripcion && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{territorio.descripcion}</p>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openView(territorio)}>Ver Detalles</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openEdit(territorio)}>Editar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => openDelete(territorio)}>
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xl font-bold text-primary">{territorio._celulas}</p>
                                    <p className="text-xs text-muted-foreground">Células</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xl font-bold text-primary">{territorio._miembros}</p>
                                    <p className="text-xs text-muted-foreground">Miembros</p>
                                </div>
                            </div>
                            {territorio.lider && (
                                <p className="text-sm text-muted-foreground">Líder: {territorio.lider.nombre} {territorio.lider.apellido}</p>
                            )}
                            {territorio.colider && (
                                <p className="text-sm text-muted-foreground">Co-líder: {territorio.colider.nombre} {territorio.colider.apellido}</p>
                            )}
                            <Button variant="outline" className="w-full" onClick={() => openView(territorio)}>
                                Ver Detalles
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ─── Dialog: Nuevo Territorio ─── */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                    <form onSubmit={handleCreate}>
                        <div className="bg-primary px-6 py-8 text-primary-foreground">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Nuevo Territorio</DialogTitle>
                                <DialogDescription className="text-primary-foreground/80">
                                    Define una nueva zona o territorio de la congregación.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <TerritorioForm form={form} setForm={setForm} members={territorioMembers} />
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

            {/* ─── Dialog: Editar Territorio ─── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                    <form onSubmit={handleEdit}>
                        <div className="bg-accent px-6 py-8 text-accent-foreground">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Editar Territorio</DialogTitle>
                                <DialogDescription className="text-accent-foreground/80">
                                    Actualiza los datos del territorio seleccionado.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <TerritorioForm form={form} setForm={setForm} members={territorioMembers} />
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

            {/* ─── Dialog: Ver Detalles ─── */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Detalles del Territorio</DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="h-3 rounded" style={{ backgroundColor: selected.color }} />
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary">{selected.codigo}</Badge>
                                <h3 className="text-lg font-bold">{selected.nombre}</h3>
                            </div>
                            {selected.descripcion && (
                                <p className="text-sm text-muted-foreground">{selected.descripcion}</p>
                            )}
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-2xl font-bold text-primary">{selected._celulas}</p>
                                    <p className="text-sm text-muted-foreground">Células</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-2xl font-bold text-primary">{selected._miembros}</p>
                                    <p className="text-sm text-muted-foreground">Miembros</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Creado: {new Date(selected.createdAt).toLocaleDateString("es-VE")}
                            </p>
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

            {/* ─── Alert: Eliminar ─── */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este territorio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selected && (
                                <>El territorio <strong>{selected.nombre}</strong> será desactivado.</>
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

// ─── Form Component ─────────────────────────────────────────────────────────
function TerritorioForm({
    form,
    setForm,
    members,
}: {
    form: typeof emptyForm;
    setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
    members: MiembroOption[];
}) {
    const set = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    const setSelect = (field: keyof typeof emptyForm) => (value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="t-codigo" className="text-sm font-semibold">Código *</Label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="t-codigo" value={form.codigo} onChange={set("codigo")} placeholder="Ej. T-007" required className="pl-10 bg-muted/30" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="t-color" className="text-sm font-semibold">Color Distintivo</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="t-color"
                                type="color"
                                value={form.color}
                                onChange={set("color")}
                                className="h-10 w-full cursor-pointer p-1 pl-10 bg-muted/30"
                            />
                        </div>
                        <Input value={form.color} onChange={set("color")} className="w-24 font-mono text-xs bg-muted/30 text-center" maxLength={7} />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="t-nombre" className="text-sm font-semibold">Nombre del Territorio *</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="t-nombre" value={form.nombre} onChange={set("nombre")} placeholder="Ej. Zona Norte" required className="pl-10 bg-muted/30" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="t-descripcion" className="text-sm font-semibold">Descripción</Label>
                <div className="relative">
                    <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="t-descripcion" value={form.descripcion} onChange={set("descripcion")} rows={3} placeholder="Detalles adicionales sobre el territorio..." className="pl-10 bg-muted/30" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="t-lider" className="text-sm font-semibold">Líder</Label>
                    <Select value={form.liderId} onValueChange={setSelect("liderId")}>
                        <SelectTrigger id="t-lider" className="bg-muted/30"><SelectValue placeholder="Seleccionar líder" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin líder</SelectItem>
                            {members.length === 0 ? (
                                <SelectItem value="none" disabled>No hay miembros en este territorio</SelectItem>
                            ) : (
                                members.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>{m.nombre} {m.apellido}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="t-colider" className="text-sm font-semibold">Co-líder</Label>
                    <Select value={form.coliderId} onValueChange={setSelect("coliderId")}>
                        <SelectTrigger id="t-colider" className="bg-muted/30"><SelectValue placeholder="Seleccionar co-líder" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin co-líder</SelectItem>
                            {members.length === 0 ? (
                                <SelectItem value="none" disabled>No hay miembros en este territorio</SelectItem>
                            ) : (
                                members.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>{m.nombre} {m.apellido}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
