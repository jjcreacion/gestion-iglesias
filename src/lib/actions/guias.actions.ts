"use server";

import { getDataSource } from "@/lib/db";
import { Guia } from "@/core/entities/Guia";
import { MiembroGuia } from "@/core/entities/MiembroGuia";

// ── Guías ──────────────────────────────────────────────────────────────────
export async function getGuias(soloActivas = true) {
    const ds = await getDataSource();
    return ds.getRepository(Guia).find({
        where: soloActivas ? { activo: true } : {},
        order: { numero: "ASC" },
    });
}

export async function createGuia(data: { numero: number; titulo: string; descripcion?: string }) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Guia);
    const guia = repo.create({ ...data, activo: true });
    return repo.save(guia);
}

export async function updateGuia(
    id: number,
    data: Partial<{ numero: number; titulo: string; descripcion: string; activo: boolean }>
) {
    const ds = await getDataSource();
    return ds.getRepository(Guia).update(id, data);
}

// ── Guías de Miembro ───────────────────────────────────────────────────────
export async function getGuiasPorMiembro(miembroId: number) {
    const ds = await getDataSource();
    return ds.getRepository(MiembroGuia).find({
        where: { miembroId },
        relations: ["guia"],
        order: { guia: { numero: "ASC" } },
    });
}

export async function marcarGuiaCompletada(
    miembroId: number,
    guiaId: number,
    marcadaPorId: number,
    notas?: string
) {
    const ds = await getDataSource();
    const repo = ds.getRepository(MiembroGuia);

    let miembroGuia = await repo.findOne({ where: { miembroId, guiaId } });

    if (!miembroGuia) {
        miembroGuia = repo.create({ miembroId, guiaId });
    }

    miembroGuia.completada = true;
    miembroGuia.fechaCompletada = new Date();
    miembroGuia.marcadaPorId = marcadaPorId;
    if (notas) miembroGuia.notas = notas;

    return repo.save(miembroGuia);
}

export async function desmarcarGuia(miembroId: number, guiaId: number) {
    const ds = await getDataSource();
    return ds.getRepository(MiembroGuia).update(
        { miembroId, guiaId },
        { completada: false, fechaCompletada: undefined, marcadaPorId: undefined }
    );
}

export async function getProgresoPorMiembro(miembroId: number) {
    const ds = await getDataSource();
    return ds.getRepository(MiembroGuia).count({
        where: { miembroId, completada: true },
    });
}
