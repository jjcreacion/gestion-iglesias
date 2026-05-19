"use server";

import "reflect-metadata";
import { getDataSource } from "@/lib/db";
import { Territorio } from "@/core/entities/Territorio";
import { Miembro } from "@/core/entities/Miembro";

export async function getTerritorios(soloActivos = true) {
    const ds = await getDataSource();
    const territorios = await ds.getRepository(Territorio).find({
        where: soloActivos ? { activo: true } : {},
        relations: ["lider", "colider"],
        order: { nombre: "ASC" },
    });
    return territorios.map(t => ({
        id: t.id,
        codigo: t.codigo,
        nombre: t.nombre,
        color: t.color,
        descripcion: t.descripcion,
        activo: t.activo,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        lider: t.lider ? { id: t.lider.id, nombre: t.lider.nombre, apellido: t.lider.apellido } : undefined,
        colider: t.colider ? { id: t.colider.id, nombre: t.colider.nombre, apellido: t.colider.apellido } : undefined,
        liderId: t.liderId,
        coliderId: t.coliderId,
    }));
}

export async function getTerritorioPorId(id: number) {
    const ds = await getDataSource();
    const territorio = await ds.getRepository(Territorio).findOne({
        where: { id },
        relations: ["celulas", "lider", "colider"],
    });
    if (!territorio) return null;
    return {
        id: territorio.id,
        codigo: territorio.codigo,
        nombre: territorio.nombre,
        color: territorio.color,
        descripcion: territorio.descripcion,
        activo: territorio.activo,
        createdAt: territorio.createdAt,
        updatedAt: territorio.updatedAt,
        lider: territorio.lider ? { id: territorio.lider.id, nombre: territorio.lider.nombre, apellido: territorio.lider.apellido } : undefined,
        colider: territorio.colider ? { id: territorio.colider.id, nombre: territorio.colider.nombre, apellido: territorio.colider.apellido } : undefined,
        liderId: territorio.liderId,
        coliderId: territorio.coliderId,
        celulas: territorio.celulas?.map(c => ({
            id: c.id,
            codigo: c.codigo,
            nombre: c.nombre,
            // add other fields if needed
        })) || [],
    };
}

export async function createTerritorio(data: {
    codigo: string;
    nombre: string;
    color?: string;
    descripcion?: string;
    liderId?: number | null;
    coliderId?: number | null;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Territorio);

    // Normalizar el código: trim y uppercase
    const normalizedCodigo = data.codigo.trim().toUpperCase();

    // Verificar unicidad del código entre territorios activos (case-insensitive)
    const existing = await repo.findOne({ where: { codigo: normalizedCodigo, activo: true } });
    if (existing) {
        throw new Error("El código del territorio ya existe. Debe ser único.");
    }

    const territorio = repo.create({ ...data, codigo: normalizedCodigo, activo: true });
    const saved = await repo.save(territorio);

    if (data.liderId || data.coliderId) {
        if (data.liderId != null && data.coliderId != null && data.liderId === data.coliderId) {
            throw new Error("El líder y el co-líder deben ser personas diferentes.");
        }

        const miembroRepo = ds.getRepository(Miembro);
        if (data.liderId != null) {
            const lider = await miembroRepo.findOne({ where: { id: data.liderId }, relations: ["celula"] });
            if (!lider || !lider.celula || lider.celula.territorioId !== saved.id) {
                throw new Error("El líder debe pertenecer a este territorio.");
            }
        }
        if (data.coliderId != null) {
            const colider = await miembroRepo.findOne({ where: { id: data.coliderId }, relations: ["celula"] });
            if (!colider || !colider.celula || colider.celula.territorioId !== saved.id) {
                throw new Error("El co-líder debe pertenecer a este territorio.");
            }
        }

        saved.liderId = data.liderId ?? null;
        saved.coliderId = data.coliderId ?? null;
        await repo.save(saved);
    }
    return {
        id: saved.id,
        codigo: saved.codigo,
        nombre: saved.nombre,
        color: saved.color,
        descripcion: saved.descripcion,
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

export async function updateTerritorio(
    id: number,
    data: Partial<{ codigo: string; nombre: string; color: string; descripcion: string; activo: boolean; liderId: number | null; coliderId: number | null }>
) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Territorio);

    // Normalizar el código si se está cambiando
    if (data.codigo) {
        data.codigo = data.codigo.trim().toUpperCase();
        const existing = await repo.findOne({ where: { codigo: data.codigo, activo: true } });
        if (existing && existing.id !== id) {
            throw new Error("El código del territorio ya existe. Debe ser único.");
        }
    }

    if (data.liderId != null && data.coliderId != null && data.liderId === data.coliderId) {
        throw new Error("El líder y el co-líder deben ser personas diferentes.");
    }

    const miembroRepo = ds.getRepository(Miembro);

    if (data.liderId != null) {
        const lider = await miembroRepo.findOne({ where: { id: data.liderId }, relations: ["celula"] });
        if (!lider || !lider.celula || lider.celula.territorioId !== id) {
            throw new Error("El líder debe pertenecer a este territorio.");
        }
    }

    if (data.coliderId != null) {
        const colider = await miembroRepo.findOne({ where: { id: data.coliderId }, relations: ["celula"] });
        if (!colider || !colider.celula || colider.celula.territorioId !== id) {
            throw new Error("El co-líder debe pertenecer a este territorio.");
        }
    }

    const territorio = await repo.findOne({ where: { id } });
    if (!territorio) {
        throw new Error("Territorio no encontrado.");
    }

    if (data.codigo !== undefined) territorio.codigo = data.codigo;
    if (data.nombre !== undefined) territorio.nombre = data.nombre;
    if (data.color !== undefined) territorio.color = data.color;
    if (data.descripcion !== undefined) territorio.descripcion = data.descripcion;
    if (data.activo !== undefined) {
        if (data.activo === false && territorio.activo === true) {
            territorio.codigo = normalizeInactiveCodigo(territorio.codigo, territorio.id);
            territorio.activo = false;
        } else {
            territorio.activo = data.activo;
        }
    }
    if (data.liderId !== undefined) {
        territorio.lider = data.liderId != null ? (await ds.getRepository(Miembro).findOne({ where: { id: data.liderId } })) || undefined : null;
    }
    if (data.coliderId !== undefined) {
        territorio.colider = data.coliderId != null ? (await ds.getRepository(Miembro).findOne({ where: { id: data.coliderId } })) || undefined : null;
    }

    await repo.save(territorio);
    return getTerritorioPorId(id);
}

export async function deleteTerritorio(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Territorio);
    const territorio = await repo.findOne({ where: { id } });
    if (!territorio) {
        throw new Error("Territorio no encontrado.");
    }
    if (!territorio.activo) {
        return { success: true };
    }

    territorio.codigo = normalizeInactiveCodigo(territorio.codigo, territorio.id);
    territorio.activo = false;
    await repo.save(territorio);
    return { success: true };
}
