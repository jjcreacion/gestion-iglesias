"use server";

import { getDataSource } from "@/lib/db";
import { Territorio } from "@/core/entities/Territorio";

export async function getTerritorios(soloActivos = true) {
    const ds = await getDataSource();
    return ds.getRepository(Territorio).find({
        where: soloActivos ? { activo: true } : {},
        order: { nombre: "ASC" },
    });
}

export async function getTerritorioPorId(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Territorio).findOne({
        where: { id },
        relations: ["celulas"],
    });
}

export async function createTerritorio(data: {
    codigo: string;
    nombre: string;
    color?: string;
    descripcion?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Territorio);
    const territorio = repo.create({ ...data, activo: true });
    return repo.save(territorio);
}

export async function updateTerritorio(
    id: string,
    data: Partial<{ codigo: string; nombre: string; color: string; descripcion: string; activo: boolean }>
) {
    const ds = await getDataSource();
    await ds.getRepository(Territorio).update(id, data);
    return getTerritorioPorId(id);
}

export async function deleteTerritorio(id: string) {
    const ds = await getDataSource();
    // Desactivar en lugar de borrar para preservar integridad referencial
    return ds.getRepository(Territorio).update(id, { activo: false });
}
