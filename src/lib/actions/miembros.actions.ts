"use server";

import { getDataSource } from "@/lib/db";
import { Miembro } from "@/core/entities/Miembro";
import type { DeepPartial } from "typeorm";
import type {
    EstadoCivil,
    Genero,
    ProgresoFormacion,
    EstadoMiembro,
} from "@/core/entities/Miembro";

// ── Tipos de entrada ───────────────────────────────────────────────────────
type CreateMiembroInput = {
    nombre: string;
    apellido: string;
    telefono?: string;
    direccion?: string;
    cedula?: string;
    fechaNacimiento?: Date;
    estadoCivil?: EstadoCivil;
    genero?: Genero;
    profesion?: string;
    oficio?: string;
    lugarTrabajo?: string;
    talentos?: string;
    celulaId?: string;
    fechaConversion?: Date;
    invitadoPorId?: string;
    consolidadorId?: string;
    fotoUrl?: string;
    notas?: string;
};

type UpdateMiembroInput = Partial<
    CreateMiembroInput & {
        encuentro: boolean;
        fechaEncuentro: Date;
        bautismo: boolean;
        fechaBautismo: Date;
        escuelaFundamento: ProgresoFormacion;
        escuelaFamilia: ProgresoFormacion;
        escuelaVision: ProgresoFormacion;
        escuelaIntercesion: ProgresoFormacion;
        escuelaLiderazgo: ProgresoFormacion;
        escuelaConsolidacion: ProgresoFormacion;
        escuelaProfetica: ProgresoFormacion;
        universidadAm: ProgresoFormacion;
        escuelaTeologica: ProgresoFormacion;
        estado: EstadoMiembro;
        usuarioId: string;
    }
>;

// ── Consultas ──────────────────────────────────────────────────────────────
export async function getMiembros(filtros?: { celulaId?: string; estado?: EstadoMiembro }) {
    const ds = await getDataSource();
    const query = ds.getRepository(Miembro).createQueryBuilder("m")
        .leftJoinAndSelect("m.celula", "celula")
        .leftJoinAndSelect("celula.territorio", "territorio")
        .leftJoinAndSelect("m.consolidador", "consolidador");

    if (filtros?.celulaId) {
        query.andWhere("m.celula_id = :celulaId", { celulaId: filtros.celulaId });
    }
    if (filtros?.estado) {
        query.andWhere("m.estado = :estado", { estado: filtros.estado });
    }

    return query.orderBy("m.apellido", "ASC").addOrderBy("m.nombre", "ASC").getMany();
}

export async function getMiembroPorId(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Miembro).findOne({
        where: { id },
        relations: ["celula", "celula.territorio", "usuario", "consolidador", "invitadoPor", "roles", "roles.rol"],
    });
}

export async function getMiembrosByCelula(celulaId: string) {
    const ds = await getDataSource();
    return ds.getRepository(Miembro).find({
        where: { celulaId, estado: "activo" },
        order: { apellido: "ASC" },
    });
}

export async function getMiembrosByConsolidador(consolidadorId: string) {
    const ds = await getDataSource();
    return ds.getRepository(Miembro).find({
        where: { consolidadorId },
        order: { apellido: "ASC" },
    });
}

// ── Mutaciones ─────────────────────────────────────────────────────────────
export async function createMiembro(data: CreateMiembroInput) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Miembro);
    const miembro = repo.create(data);
    return repo.save(miembro);
}

export async function updateMiembro(id: string, data: UpdateMiembroInput) {
    const ds = await getDataSource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ds.getRepository(Miembro).update(id, data as any);
    return getMiembroPorId(id);
}

export async function updateFormacionMiembro(
    id: string,
    formacion: Partial<{
        encuentro: boolean;
        fechaEncuentro: Date;
        bautismo: boolean;
        fechaBautismo: Date;
        escuelaFundamento: ProgresoFormacion;
        escuelaFamilia: ProgresoFormacion;
        escuelaVision: ProgresoFormacion;
        escuelaIntercesion: ProgresoFormacion;
        escuelaLiderazgo: ProgresoFormacion;
        escuelaConsolidacion: ProgresoFormacion;
        escuelaProfetica: ProgresoFormacion;
        universidadAm: ProgresoFormacion;
        escuelaTeologica: ProgresoFormacion;
    }>
) {
    const ds = await getDataSource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ds.getRepository(Miembro).update(id, formacion as any);
    return getMiembroPorId(id);
}

export async function cambiarEstadoMiembro(id: string, estado: EstadoMiembro) {
    const ds = await getDataSource();
    await ds.getRepository(Miembro).update(id, { estado });
    return getMiembroPorId(id);
}

export async function deleteMiembro(id: string) {
    const ds = await getDataSource();
    // Baja lógica
    return ds.getRepository(Miembro).update(id, { estado: "baja" });
}

// ── Estadísticas ───────────────────────────────────────────────────────────
export async function getResumenFormacion(celulaId?: string) {
    const ds = await getDataSource();
    const query = ds.getRepository(Miembro).createQueryBuilder("m")
        .select("COUNT(*)", "total")
        .addSelect("SUM(CASE WHEN m.encuentro = TRUE THEN 1 ELSE 0 END)", "conEncuentro")
        .addSelect("SUM(CASE WHEN m.bautismo = TRUE THEN 1 ELSE 0 END)", "bautizados")
        .where("m.estado = 'activo'");

    if (celulaId) {
        query.andWhere("m.celula_id = :celulaId", { celulaId });
    }

    return query.getRawOne();
}
