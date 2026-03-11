"use server";

import { getDataSource } from "@/lib/db";
import { Usuario } from "@/core/entities/Usuario";

// ── Listar todos los usuarios ──────────────────────────────────────────────
export async function getUsuarios() {
    const ds = await getDataSource();
    return ds.getRepository(Usuario).find({ select: ["id", "email", "activo", "createdAt"] });
}

// ── Obtener usuario por ID ─────────────────────────────────────────────────
export async function getUsuarioById(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Usuario).findOne({ where: { id } });
}

// ── Crear usuario ──────────────────────────────────────────────────────────
export async function createUsuario(data: {
    email: string;
    passwordHash: string;
    activo?: boolean;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Usuario);
    const usuario = repo.create(data);
    return repo.save(usuario);
}

// ── Actualizar usuario ─────────────────────────────────────────────────────
export async function updateUsuario(
    id: string,
    data: Partial<{ email: string; passwordHash: string; activo: boolean }>
) {
    const ds = await getDataSource();
    await ds.getRepository(Usuario).update(id, data);
    return getUsuarioById(id);
}

// ── Eliminar usuario ───────────────────────────────────────────────────────
export async function deleteUsuario(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Usuario).delete(id);
}
