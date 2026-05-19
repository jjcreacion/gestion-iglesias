import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import type { AsistenciaServicio } from "./AsistenciaServicio";
import type { Miembro } from "./Miembro";

export type TipoAsistente = "miembro" | "primera_vez" | "visita";

@Entity("asistencia_detalle")
@Unique("uk_detalle_asistencia_miembro", ["asistenciaServicioId", "miembroId"])
export class AsistenciaDetalle {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "asistencia_servicio_id", type: "int" })
    asistenciaServicioId!: number;

    @Column({ name: "miembro_id", type: "int" })
    miembroId!: number;

    @Column({ type: "boolean", default: false })
    presente!: boolean;

    @Column({
        name: "tipo_asistente",
        type: "enum",
        enum: ["miembro", "primera_vez", "visita"],
        default: "miembro",
    })
    tipoAsistente!: TipoAsistente;

    @Column({ type: "varchar", length: 255, nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne("AsistenciaServicio", "detalles", { onDelete: "CASCADE" })
    @JoinColumn({ name: "asistencia_servicio_id" })
    asistenciaServicio!: AsistenciaServicio;

    @ManyToOne("Miembro", "asistenciasDetalle", { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;
}