"use server";

import { getDataSource } from "@/lib/db";
import { Traslado, EstadoTraslado } from "@/core/entities/Traslado";
import { Miembro } from "@/core/entities/Miembro";

export async function getTraslados(filtros?: { estado?: EstadoTraslado; celulaId?: string }) {
    const ds = await getDataSource();
    const query = ds.getRepository(Traslado)
        .createQueryBuilder("t")
        .leftJoinAndSelect("t.miembro", "miembro")
        .leftJoinAndSelect("t.celulaOrigen", "origen")
        .leftJoinAndSelect("t.celulaDestino", "destino")
        .leftJoinAndSelect("t.solicitadoPor", "solicitado");

    if (filtros?.estado) {
        query.andWhere("t.estado = :estado", { estado: filtros.estado });
    }
    if (filtros?.celulaId) {
        query.andWhere("(t.celula_origen_id = :cid OR t.celula_destino_id = :cid)", {
            cid: filtros.celulaId,
        });
    }

    return query.orderBy("t.fecha_solicitud", "DESC").getMany();
}

export async function createTraslado(data: {
    miembroId: string;
    celulaOrigenId: string;
    celulaDestinoId: string;
    solicitadoPorId: string;
    motivo?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Traslado);
    const traslado = repo.create({ ...data, estado: "pendiente", fechaSolicitud: new Date() });
    return repo.save(traslado);
}

export async function resolverTraslado(
    trasladoId: string,
    aprobadoPorId: string,
    estado: "aprobado" | "rechazado"
) {
    const ds = await getDataSource();

    await ds.getRepository(Traslado).update(trasladoId, {
        estado,
        aprobadoPorId,
        fechaResolucion: new Date(),
    });

    // Si se aprueba, actualizar la célula del miembro
    if (estado === "aprobado") {
        const traslado = await ds.getRepository(Traslado).findOne({ where: { id: trasladoId } });
        if (traslado) {
            await ds.getRepository(Miembro).update(traslado.miembroId, {
                celulaId: traslado.celulaDestinoId,
                estado: "trasladado",
            });
        }
    }

    return ds.getRepository(Traslado).findOne({
        where: { id: trasladoId },
        relations: ["miembro", "celulaOrigen", "celulaDestino"],
    });
}

export async function getTrasladosPendientes() {
    return getTraslados({ estado: "pendiente" });
}
