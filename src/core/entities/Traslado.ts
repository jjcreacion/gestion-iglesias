import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Miembro } from "./Miembro";
import { Celula } from "./Celula";

export type EstadoTraslado = "pendiente" | "aprobado" | "rechazado";

@Entity("traslados")
export class Traslado {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "miembro_id", type: "char", length: 36 })
    miembroId!: string;

    @Column({ name: "celula_origen_id", type: "char", length: 36 })
    celulaOrigenId!: string;

    @Column({ name: "celula_destino_id", type: "char", length: 36 })
    celulaDestinoId!: string;

    @Column({ name: "solicitado_por_id", type: "char", length: 36 })
    solicitadoPorId!: string;

    @Column({ name: "aprobado_por_id", type: "char", length: 36, nullable: true })
    aprobadoPorId?: string;

    @Column({ type: "text", nullable: true })
    motivo?: string;

    @Column({
        type: "enum",
        enum: ["pendiente", "aprobado", "rechazado"],
        default: "pendiente",
    })
    estado!: EstadoTraslado;

    @Column({ name: "fecha_solicitud", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    fechaSolicitud!: Date;

    @Column({ name: "fecha_resolucion", type: "timestamp", nullable: true })
    fechaResolucion?: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne(() => Miembro, (miembro) => miembro.traslados, { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne(() => Celula, (celula) => celula.trasladosOrigen, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "celula_origen_id" })
    celulaOrigen!: Celula;

    @ManyToOne(() => Celula, (celula) => celula.trasladosDestino, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "celula_destino_id" })
    celulaDestino!: Celula;

    @ManyToOne(() => Miembro, (miembro) => miembro.trasladosSolicitados, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "solicitado_por_id" })
    solicitadoPor!: Miembro;

    @ManyToOne(() => Miembro, (miembro) => miembro.trasladosAprobados, {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "aprobado_por_id" })
    aprobadoPor?: Miembro;
}
