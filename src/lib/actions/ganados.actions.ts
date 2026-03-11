"use server";

import { getDataSource } from "@/lib/db";
import { Ganado, ContextoGanado } from "@/core/entities/Ganado";

export async function getGanados(filtros?: { celulaId?: string; mes?: string }) {
    const ds = await getDataSource();
    const query = ds.getRepository(Ganado)
        .createQueryBuilder("g")
        .leftJoinAndSelect("g.ganadoPor", "ganadoPor")
        .leftJoinAndSelect("g.celula", "celula");

    if (filtros?.celulaId) {
        query.andWhere("g.celula_id = :celulaId", { celulaId: filtros.celulaId });
    }
    if (filtros?.mes) {
        // mes en formato 'YYYY-MM'
        query.andWhere("DATE_FORMAT(g.fecha_ganado, '%Y-%m') = :mes", { mes: filtros.mes });
    }

    return query.orderBy("g.fecha_ganado", "DESC").getMany();
}

export async function getGanadoPorId(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Ganado).findOne({
        where: { id },
        relations: ["ganadoPor", "celula", "servicio", "miembro"],
    });
}

export async function createGanado(data: {
    nombre: string;
    apellido: string;
    telefono?: string;
    direccion?: string;
    fechaGanado?: Date;
    ganadoPorId: string;
    celulaId?: string;
    servicioId?: string;
    contexto?: ContextoGanado;
    notas?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Ganado);
    const ganado = repo.create({
        ...data,
        fechaGanado: data.fechaGanado ?? new Date(),
        contexto: data.contexto ?? "personal",
    });
    return repo.save(ganado);
}

export async function convertirGanadoAMiembro(ganadoId: string, miembroId: string) {
    const ds = await getDataSource();
    return ds.getRepository(Ganado).update(ganadoId, {
        convertidoAMiembro: true,
        miembroId,
    });
}

export async function getResumenGanadosMes(mes: string, territorioId?: string) {
    const ds = await getDataSource();
    const query = ds.getRepository(Ganado)
        .createQueryBuilder("g")
        .select("g.contexto", "contexto")
        .addSelect("COUNT(*)", "total")
        .where("DATE_FORMAT(g.fecha_ganado, '%Y-%m') = :mes", { mes })
        .groupBy("g.contexto");

    return query.getRawMany();
}
