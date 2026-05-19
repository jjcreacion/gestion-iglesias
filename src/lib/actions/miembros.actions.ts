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
    celulaId?: number;
    fechaConversion?: Date;
    invitadoPorId?: number;
    consolidadorId?: number;
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
        usuarioId: number;
    }
>;

// ── Consultas ──────────────────────────────────────────────────────────────
export async function getMiembros(filtros?: { celulaId?: number; estado?: EstadoMiembro }) {
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

    const miembros = await query.orderBy("m.apellido", "ASC").addOrderBy("m.nombre", "ASC").getMany();
    return miembros.map(m => ({
        id: m.id,
        usuarioId: m.usuarioId,
        nombre: m.nombre,
        apellido: m.apellido,
        telefono: m.telefono,
        direccion: m.direccion,
        cedula: m.cedula,
        fechaNacimiento: m.fechaNacimiento,
        estadoCivil: m.estadoCivil,
        genero: m.genero,
        profesion: m.profesion,
        oficio: m.oficio,
        lugarTrabajo: m.lugarTrabajo,
        talentos: m.talentos,
        celulaId: m.celulaId,
        fechaConversion: m.fechaConversion,
        invitadoPorId: m.invitadoPorId,
        consolidadorId: m.consolidadorId,
        estado: m.estado,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        celula: m.celula ? {
            id: m.celula.id,
            nombre: m.celula.nombre,
            territorio: m.celula.territorio ? {
                id: m.celula.territorio.id,
                nombre: m.celula.territorio.nombre,
            } : undefined,
        } : undefined,
        consolidador: m.consolidador ? {
            id: m.consolidador.id,
            nombre: m.consolidador.nombre,
            apellido: m.consolidador.apellido,
        } : undefined,
    }));
}

export async function getMiembrosByTerritorio(territorioId: number) {
    const ds = await getDataSource();
    const miembros = await ds.getRepository(Miembro)
        .createQueryBuilder("m")
        .leftJoinAndSelect("m.celula", "celula")
        .leftJoinAndSelect("celula.territorio", "territorio")
        .where("celula.territorio_id = :territorioId", { territorioId })
        .andWhere("m.estado = 'activo'")
        .orderBy("m.apellido", "ASC")
        .addOrderBy("m.nombre", "ASC")
        .getMany();

    return miembros.map(m => ({
        id: m.id,
        usuarioId: m.usuarioId,
        nombre: m.nombre,
        apellido: m.apellido,
        telefono: m.telefono,
        direccion: m.direccion,
        cedula: m.cedula,
        fechaNacimiento: m.fechaNacimiento,
        estadoCivil: m.estadoCivil,
        genero: m.genero,
        profesion: m.profesion,
        oficio: m.oficio,
        lugarTrabajo: m.lugarTrabajo,
        talentos: m.talentos,
        celulaId: m.celulaId,
        fechaConversion: m.fechaConversion,
        invitadoPorId: m.invitadoPorId,
        consolidadorId: m.consolidadorId,
        estado: m.estado,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        celula: m.celula ? {
            id: m.celula.id,
            nombre: m.celula.nombre,
            territorio: m.celula.territorio ? {
                id: m.celula.territorio.id,
                nombre: m.celula.territorio.nombre,
            } : undefined,
        } : undefined,
        consolidador: m.consolidador ? {
            id: m.consolidador.id,
            nombre: m.consolidador.nombre,
            apellido: m.consolidador.apellido,
        } : undefined,
    }));
}

export async function getMiembroPorId(id: number) {
    const ds = await getDataSource();
    const miembro = await ds.getRepository(Miembro).findOne({
        where: { id },
        relations: ["celula", "celula.territorio", "usuario", "consolidador", "invitadoPor", "roles", "roles.rol"],
    });
    if (!miembro) return null;
    return {
        id: miembro.id,
        usuarioId: miembro.usuarioId,
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        telefono: miembro.telefono,
        direccion: miembro.direccion,
        cedula: miembro.cedula,
        fechaNacimiento: miembro.fechaNacimiento,
        estadoCivil: miembro.estadoCivil,
        genero: miembro.genero,
        profesion: miembro.profesion,
        oficio: miembro.oficio,
        lugarTrabajo: miembro.lugarTrabajo,
        talentos: miembro.talentos,
        celulaId: miembro.celulaId,
        fechaConversion: miembro.fechaConversion,
        invitadoPorId: miembro.invitadoPorId,
        consolidadorId: miembro.consolidadorId,
        estado: miembro.estado,
        createdAt: miembro.createdAt,
        updatedAt: miembro.updatedAt,
        celula: miembro.celula ? {
            id: miembro.celula.id,
            nombre: miembro.celula.nombre,
            territorio: miembro.celula.territorio ? {
                id: miembro.celula.territorio.id,
                nombre: miembro.celula.territorio.nombre,
            } : undefined,
        } : undefined,
        usuario: miembro.usuario ? {
            id: miembro.usuario.id,
            email: miembro.usuario.email,
        } : undefined,
        consolidador: miembro.consolidador ? {
            id: miembro.consolidador.id,
            nombre: miembro.consolidador.nombre,
            apellido: miembro.consolidador.apellido,
        } : undefined,
        invitadoPor: miembro.invitadoPor ? {
            id: miembro.invitadoPor.id,
            nombre: miembro.invitadoPor.nombre,
            apellido: miembro.invitadoPor.apellido,
        } : undefined,
        roles: miembro.roles?.map(r => ({
            id: r.id,
            rol: r.rol ? {
                id: r.rol.id,
                nombre: r.rol.nombre,
            } : undefined,
        })) || [],
        // Add other fields as needed
    };
}

export async function getMiembrosByCelula(celulaId: number) {
    const ds = await getDataSource();
    return ds.getRepository(Miembro).find({
        where: { celulaId, estado: "activo" },
        order: { apellido: "ASC" },
    });
}

export async function getMiembrosByConsolidador(consolidadorId: number) {
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

    // Verificar unicidad de cédula si se proporciona
    if (data.cedula) {
        const existing = await repo.findOne({ where: { cedula: data.cedula } });
        if (existing) {
            throw new Error("La cédula ya existe. Debe ser única.");
        }
    }

    const miembro = repo.create(data);
    const saved = await repo.save(miembro);
    return {
        id: saved.id,
        usuarioId: saved.usuarioId,
        nombre: saved.nombre,
        apellido: saved.apellido,
        telefono: saved.telefono,
        direccion: saved.direccion,
        cedula: saved.cedula,
        fechaNacimiento: saved.fechaNacimiento,
        estadoCivil: saved.estadoCivil,
        genero: saved.genero,
        profesion: saved.profesion,
        oficio: saved.oficio,
        lugarTrabajo: saved.lugarTrabajo,
        talentos: saved.talentos,
        celulaId: saved.celulaId,
        fechaConversion: saved.fechaConversion,
        invitadoPorId: saved.invitadoPorId,
        consolidadorId: saved.consolidadorId,
        estado: saved.estado,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
        // Add other fields as needed
    };
}

export async function updateMiembro(id: number, data: UpdateMiembroInput) {
    const ds = await getDataSource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ds.getRepository(Miembro).update(id, data as any);
    return getMiembroPorId(id);
}

export async function updateFormacionMiembro(
    id: number,
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
