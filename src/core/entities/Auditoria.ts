import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import type { Usuario } from "./Usuario";

@Entity("auditoria")
@Index("idx_auditoria_tabla", ["tablaAfectada"])
@Index("idx_auditoria_fecha", ["createdAt"])
export class Auditoria {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "usuario_id", type: "int", nullable: true })
    usuarioId?: number;

    @Column({ type: "varchar", length: 50 })
    accion!: string;

    @Column({ name: "tabla_afectada", type: "varchar", length: 50 })
    tablaAfectada!: string;

    @Column({ name: "registro_id", type: "int", nullable: true })
    registroId?: number;

    @Column({ name: "datos_anteriores", type: "json", nullable: true })
    datosAnteriores?: Record<string, unknown>;

    @Column({ name: "datos_nuevos", type: "json", nullable: true })
    datosNuevos?: Record<string, unknown>;

    @Column({ type: "varchar", length: 45, nullable: true })
    ip?: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne("Usuario", "auditorias", {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "usuario_id" })
    usuario?: Usuario;
}