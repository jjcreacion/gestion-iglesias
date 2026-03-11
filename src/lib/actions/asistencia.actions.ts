"use server";

import { getDataSource } from "@/lib/db";
import { Servicio, TipoServicio } from "@/core/entities/Servicio";
import { AsistenciaServicio } from "@/core/entities/AsistenciaServicio";
import { AsistenciaDetalle, TipoAsistente } from "@/core/entities/AsistenciaDetalle";

// ── Servicios ──────────────────────────────────────────────────────────────
export async function getServicios(limit = 20) {
    const ds = await getDataSource();
    return ds.getRepository(Servicio).find({
        order: { fecha: "DESC" },
        take: limit,
    });
}

export async function getServicioPorId(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Servicio).findOne({
        where: { id },
        relations: ["asistencias", "asistencias.celula", "asistencias.detalles"],
    });
}

export async function createServicio(data: {
    fecha: Date;
    tipo?: TipoServicio;
    descripcion?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Servicio);
    return repo.save(repo.create(data));
}

// ── Asistencia por célula ──────────────────────────────────────────────────
export async function registrarAsistenciaServicio(data: {
    servicioId: string;
    celulaId: string;
    registradoPorId: string;
    ofrendas?: number;
    notas?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(AsistenciaServicio);
    const asistencia = repo.create({ ...data, ofrendas: data.ofrendas ?? 0 });
    return repo.save(asistencia);
}

export async function getAsistenciaPorServicioCelula(servicioId: string, celulaId: string) {
    const ds = await getDataSource();
    return ds.getRepository(AsistenciaServicio).findOne({
        where: { servicioId, celulaId },
        relations: ["detalles", "detalles.miembro"],
    });
}

// ── Detalle de asistencia por miembro ─────────────────────────────────────
export async function registrarDetalleAsistencia(data: {
    asistenciaServicioId: string;
    miembroId: string;
    presente: boolean;
    tipoAsistente?: TipoAsistente;
    notas?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(AsistenciaDetalle);

    // Upsert: si ya existe, actualizar
    let detalle = await repo.findOne({
        where: { asistenciaServicioId: data.asistenciaServicioId, miembroId: data.miembroId },
    });

    if (detalle) {
        detalle.presente = data.presente;
        if (data.tipoAsistente) detalle.tipoAsistente = data.tipoAsistente;
        if (data.notas) detalle.notas = data.notas;
    } else {
        detalle = repo.create(data);
    }

    return repo.save(detalle);
}

export async function registrarListaAsistencia(
    asistenciaServicioId: string,
    lista: Array<{ miembroId: string; presente: boolean; tipoAsistente?: TipoAsistente }>
) {
    const ds = await getDataSource();
    const repo = ds.getRepository(AsistenciaDetalle);

    const detalles = lista.map((item) =>
        repo.create({ asistenciaServicioId, ...item })
    );

    return repo.save(detalles);
}

// ── Reportes de asistencia ─────────────────────────────────────────────────
export async function getReporteAsistenciaPorCelula(celulaId: string, desde?: Date, hasta?: Date) {
    const ds = await getDataSource();
    const query = ds.getRepository(AsistenciaServicio)
        .createQueryBuilder("asv")
        .leftJoinAndSelect("asv.servicio", "s")
        .leftJoinAndSelect("asv.detalles", "ad")
        .where("asv.celula_id = :celulaId", { celulaId });

    if (desde) query.andWhere("s.fecha >= :desde", { desde });
    if (hasta) query.andWhere("s.fecha <= :hasta", { hasta });

    return query.orderBy("s.fecha", "DESC").getMany();
}
