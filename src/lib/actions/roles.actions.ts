"use server";

import { getDataSource } from "@/lib/db";
import { Rol } from "@/core/entities/Rol";
import { MiembroRol } from "@/core/entities/MiembroRol";

// ── Roles ──────────────────────────────────────────────────────────────────
export async function getRoles() {
    const ds = await getDataSource();
    return ds.getRepository(Rol).find({ order: { nombre: "ASC" } });
}

export async function createRol(data: { nombre: string; descripcion?: string }) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Rol);
    return repo.save(repo.create(data));
}

// ── Roles de Miembro ───────────────────────────────────────────────────────
export async function getRolesPorMiembro(miembroId: string) {
    const ds = await getDataSource();
    return ds.getRepository(MiembroRol).find({
        where: { miembroId, activo: true },
        relations: ["rol", "territorio", "celula"],
    });
}

export async function asignarRol(data: {
    miembroId: string;
    rolId: string;
    territorioId?: string;
    celulaId?: string;
    fechaAsignacion?: Date;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(MiembroRol);
    const miembroRol = repo.create({
        ...data,
        fechaAsignacion: data.fechaAsignacion ?? new Date(),
        activo: true,
    });
    return repo.save(miembroRol);
}

export async function revocarRol(miembroRolId: string) {
    const ds = await getDataSource();
    return ds.getRepository(MiembroRol).update(miembroRolId, { activo: false });
}

export async function getMiembrosPorRol(rolId: string, celulaId?: string) {
    const ds = await getDataSource();
    const query = ds.getRepository(MiembroRol)
        .createQueryBuilder("mr")
        .leftJoinAndSelect("mr.miembro", "miembro")
        .leftJoinAndSelect("mr.territorio", "territorio")
        .leftJoinAndSelect("mr.celula", "celula")
        .where("mr.rol_id = :rolId", { rolId })
        .andWhere("mr.activo = TRUE");

    if (celulaId) {
        query.andWhere("mr.celula_id = :celulaId", { celulaId });
    }

    return query.getMany();
}
