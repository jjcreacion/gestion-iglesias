"use server";

import "reflect-metadata";
import { getDataSource } from "@/lib/db";
import { Celula, DiaReunion } from "@/core/entities/Celula";
import { Miembro } from "@/core/entities/Miembro";

export async function getCelulas(soloActivas = true) {
    const ds = await getDataSource();
    const celulas = await ds.getRepository(Celula).find({
        where: soloActivas ? { activo: true } : {},
        relations: ["territorio", "lider", "colider"],
        order: { nombre: "ASC" },
    });
    return celulas.map(c => ({
        id: c.id,
        codigo: c.codigo,
        nombre: c.nombre,
        territorioId: c.territorioId,
        direccion: c.direccion,
        diasReunion: c.diasReunion,
        horariosReunion: c.horariosReunion,
        horaReunion: c.horaReunion,
        activo: c.activo,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        territorio: c.territorio ? {
            id: c.territorio.id,
            codigo: c.territorio.codigo,
            nombre: c.territorio.nombre,
            color: c.territorio.color,
        } : undefined,
        lider: c.lider ? { id: c.lider.id, nombre: c.lider.nombre, apellido: c.lider.apellido } : undefined,
        colider: c.colider ? { id: c.colider.id, nombre: c.colider.nombre, apellido: c.colider.apellido } : undefined,
        liderId: c.liderId,
        coliderId: c.coliderId,
    }));
}

export async function getCelulasPorTerritorio(territorioId: number) {
    const ds = await getDataSource();
    return ds.getRepository(Celula).find({
        where: { territorioId, activo: true },
        order: { nombre: "ASC" },
    });
}

export async function getCelulaPorId(id: number) {
    const ds = await getDataSource();
    const celula = await ds.getRepository(Celula).findOne({
        where: { id },
        relations: ["territorio", "miembros", "lider", "colider"],
    });
    if (!celula) return null;
    return {
        id: celula.id,
        codigo: celula.codigo,
        nombre: celula.nombre,
        territorioId: celula.territorioId,
        direccion: celula.direccion,
        diasReunion: celula.diasReunion,
        horariosReunion: celula.horariosReunion,
        horaReunion: celula.horaReunion,
        activo: celula.activo,
        createdAt: celula.createdAt,
        updatedAt: celula.updatedAt,
        territorio: celula.territorio ? {
            id: celula.territorio.id,
            codigo: celula.territorio.codigo,
            nombre: celula.territorio.nombre,
            color: celula.territorio.color,
        } : undefined,
        lider: celula.lider ? { id: celula.lider.id, nombre: celula.lider.nombre, apellido: celula.lider.apellido } : undefined,
        colider: celula.colider ? { id: celula.colider.id, nombre: celula.colider.nombre, apellido: celula.colider.apellido } : undefined,
        liderId: celula.liderId,
        coliderId: celula.coliderId,
        miembros: celula.miembros?.map(m => ({
            id: m.id,
            nombre: m.nombre,
            apellido: m.apellido,
            // add other fields
        })) || [],
    };
}

export async function createCelula(data: {
    codigo: string;
    nombre: string;
    territorioId: number;
    direccion?: string;
    diasReunion?: DiaReunion[];
    horariosReunion?: Partial<Record<DiaReunion, string>>;
    horaReunion?: string;
    liderId?: number | null;
    coliderId?: number | null;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Celula);

    // Normalizar el código: trim y uppercase
    const normalizedCodigo = data.codigo.trim().toUpperCase();

    // Verificar unicidad del código entre células activas (case-insensitive)
    const existing = await repo.findOne({ where: { codigo: normalizedCodigo, activo: true } });
    if (existing) {
        throw new Error("El código de la célula ya existe. Debe ser único.");
    }

    if (data.liderId || data.coliderId) {
        throw new Error("No se puede asignar líder ni co-líder al crear una célula. Asignalos después de crearla.");
    }

    const celula = repo.create({ ...data, codigo: normalizedCodigo, activo: true });
    const saved = await repo.save(celula);
    return {
        id: saved.id,
        codigo: saved.codigo,
        nombre: saved.nombre,
        territorioId: saved.territorioId,
        direccion: saved.direccion,
        diasReunion: saved.diasReunion,
        horariosReunion: saved.horariosReunion,
        horaReunion: saved.horaReunion,
        activo: saved.activo,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
    };
}

function normalizeInactiveCodigo(codigo: string, id: number) {
    const suffix = `-${id}`;
    const maxLength = 20;
    const base = codigo.slice(0, Math.max(0, maxLength - suffix.length));
    return `${base}${suffix}`.toUpperCase();
}

export async function updateCelula(
    id: number,
    data: Partial<{
        codigo: string;
        nombre: string;
        territorioId: number;
        direccion: string;
        diasReunion: DiaReunion[];
        horariosReunion: Partial<Record<DiaReunion, string>>;
        horaReunion: string;
        activo: boolean;
        liderId: number | null;
        coliderId: number | null;
    }>
) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Celula);

    // Normalizar el código si se está cambiando
    if (data.codigo) {
        data.codigo = data.codigo.trim().toUpperCase();
        const existing = await repo.findOne({ where: { codigo: data.codigo, activo: true } });
        if (existing && existing.id !== id) {
            throw new Error("El código de la célula ya existe. Debe ser único.");
        }
    }

    if (data.liderId != null && data.coliderId != null && data.liderId === data.coliderId) {
        throw new Error("El líder y el co-líder deben ser personas diferentes.");
    }

    const miembroRepo = ds.getRepository(Miembro);

    if (data.liderId != null) {
        const lider = await miembroRepo.findOne({ where: { id: data.liderId } });
        if (!lider || lider.celulaId !== id) {
            throw new Error("El líder debe pertenecer a la célula seleccionada.");
        }
    }

    if (data.coliderId != null) {
        const colider = await miembroRepo.findOne({ where: { id: data.coliderId } });
        if (!colider || colider.celulaId !== id) {
            throw new Error("El co-líder debe pertenecer a la célula seleccionada.");
        }
    }

    const celula = await repo.findOne({ where: { id } });
    if (!celula) {
        throw new Error("Célula no encontrada.");
    }

    if (data.codigo !== undefined) celula.codigo = data.codigo;
    if (data.nombre !== undefined) celula.nombre = data.nombre;
    if (data.territorioId !== undefined) celula.territorioId = data.territorioId;
    if (data.direccion !== undefined) celula.direccion = data.direccion;
    if (data.diasReunion !== undefined) celula.diasReunion = data.diasReunion;
    if (data.horariosReunion !== undefined) celula.horariosReunion = data.horariosReunion;
    if (data.horaReunion !== undefined) celula.horaReunion = data.horaReunion;
    if (data.activo !== undefined) {
        if (data.activo === false && celula.activo === true) {
            celula.codigo = normalizeInactiveCodigo(celula.codigo, celula.id);
            celula.activo = false;
        } else {
            celula.activo = data.activo;
        }
    }
    if (data.liderId !== undefined) {
        celula.lider = data.liderId != null ? (await ds.getRepository(Miembro).findOne({ where: { id: data.liderId } })) || undefined : null;
    }
    if (data.coliderId !== undefined) {
        celula.colider = data.coliderId != null ? (await ds.getRepository(Miembro).findOne({ where: { id: data.coliderId } })) || undefined : null;
    }

    await repo.save(celula);
    return getCelulaPorId(id);
}

export async function deleteCelula(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Celula);
    const celula = await repo.findOne({ where: { id } });
    if (!celula) {
        throw new Error("Célula no encontrada.");
    }
    if (!celula.activo) {
        return { success: true };
    }

    celula.codigo = normalizeInactiveCodigo(celula.codigo, celula.id);
    celula.activo = false;
    await repo.save(celula);
    return { success: true };
}
