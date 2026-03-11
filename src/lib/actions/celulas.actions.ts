"use server";

import { getDataSource } from "@/lib/db";
import { Celula, DiaReunion } from "@/core/entities/Celula";

export async function getCelulas(soloActivas = true) {
    const ds = await getDataSource();
    return ds.getRepository(Celula).find({
        where: soloActivas ? { activo: true } : {},
        relations: ["territorio"],
        order: { nombre: "ASC" },
    });
}

export async function getCelulasPorTerritorio(territorioId: string) {
    const ds = await getDataSource();
    return ds.getRepository(Celula).find({
        where: { territorioId, activo: true },
        order: { nombre: "ASC" },
    });
}

export async function getCelulaPorId(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Celula).findOne({
        where: { id },
        relations: ["territorio", "miembros"],
    });
}

export async function createCelula(data: {
    codigo: string;
    nombre: string;
    territorioId: string;
    direccion?: string;
    diaReunion?: DiaReunion;
    horaReunion?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Celula);
    const celula = repo.create({ ...data, activo: true });
    return repo.save(celula);
}

export async function updateCelula(
    id: string,
    data: Partial<{
        codigo: string;
        nombre: string;
        territorioId: string;
        direccion: string;
        diaReunion: DiaReunion;
        horaReunion: string;
        activo: boolean;
    }>
) {
    const ds = await getDataSource();
    await ds.getRepository(Celula).update(id, data);
    return getCelulaPorId(id);
}

export async function deleteCelula(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Celula).update(id, { activo: false });
}
