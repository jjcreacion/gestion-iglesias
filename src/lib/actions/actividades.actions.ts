"use server";

import { getDataSource } from "@/lib/db";
import { Actividad, TipoActividad } from "@/core/entities/Actividad";
import { MiembroActividad } from "@/core/entities/MiembroActividad";

export async function getActividades(soloActivas = true) {
    const ds = await getDataSource();
    return ds.getRepository(Actividad).find({
        where: soloActivas ? { activo: true } : {},
        order: { fecha: "DESC" },
    });
}

export async function getActividadPorId(id: string) {
    const ds = await getDataSource();
    return ds.getRepository(Actividad).findOne({
        where: { id },
        relations: ["miembroActividades", "miembroActividades.miembro"],
    });
}

export async function createActividad(data: {
    nombre: string;
    descripcion?: string;
    fecha?: Date;
    tipo?: TipoActividad;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Actividad);
    return repo.save(repo.create({ ...data, activo: true }));
}

export async function registrarAsistenciaActividad(data: {
    miembroId: string;
    actividadId: string;
    asistio: boolean;
    fechaRegistro?: Date;
    notas?: string;
}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(MiembroActividad);

    let registro = await repo.findOne({
        where: { miembroId: data.miembroId, actividadId: data.actividadId },
    });

    if (registro) {
        registro.asistio = data.asistio;
        if (data.fechaRegistro) registro.fechaRegistro = data.fechaRegistro;
        if (data.notas) registro.notas = data.notas;
    } else {
        registro = repo.create(data);
    }

    return repo.save(registro);
}

export async function registrarListaActividad(
    actividadId: string,
    lista: Array<{ miembroId: string; asistio: boolean }>
) {
    const ds = await getDataSource();
    const repo = ds.getRepository(MiembroActividad);
    const registros = lista.map((item) => repo.create({ actividadId, ...item }));
    return repo.save(registros);
}

export async function getActividadesPorMiembro(miembroId: string) {
    const ds = await getDataSource();
    return ds.getRepository(MiembroActividad).find({
        where: { miembroId },
        relations: ["actividad"],
        order: { actividad: { fecha: "DESC" } },
    });
}
