import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import type { Miembro } from "./Miembro";
import type { Celula } from "./Celula";

export type EstadoTraslado = "pendiente" | "aprobado" | "rechazado";

@Entity("traslados")
export class Traslado {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "miembro_id", type: "int" })
    miembroId!: number;

    @Column({ name: "celula_origen_id", type: "int" })
    celulaOrigenId!: number;

    @Column({ name: "celula_destino_id", type: "int" })
    celulaDestinoId!: number;

    @Column({ name: "solicitado_por_id", type: "int" })
    solicitadoPorId!: number;

    @Column({ name: "aprobado_por_id", type: "int", nullable: true })
    aprobadoPorId?: number;

    @Column({ type: "text", nullable: true })
    motivo?: number;

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
    @ManyToOne("Miembro", "traslados", { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne("Celula", "trasladosOrigen", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "celula_origen_id" })
    celulaOrigen!: Celula;

    @ManyToOne("Celula", "trasladosDestino", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "celula_destino_id" })
    celulaDestino!: Celula;

    @ManyToOne("Miembro", "trasladosSolicitados", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "solicitado_por_id" })
    solicitadoPor!: Miembro;

    @ManyToOne("Miembro", "trasladosAprobados", {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "aprobado_por_id" })
    aprobadoPor?: Miembro;
}