import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { Usuario } from "./Usuario";

@Entity("auditoria")
@Index("idx_auditoria_tabla", ["tablaAfectada"])
@Index("idx_auditoria_fecha", ["createdAt"])
export class Auditoria {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "usuario_id", type: "char", length: 36, nullable: true })
    usuarioId?: string;

    @Column({ type: "varchar", length: 50 })
    accion!: string;

    @Column({ name: "tabla_afectada", type: "varchar", length: 50 })
    tablaAfectada!: string;

    @Column({ name: "registro_id", type: "char", length: 36, nullable: true })
    registroId?: string;

    @Column({ name: "datos_anteriores", type: "json", nullable: true })
    datosAnteriores?: Record<string, unknown>;

    @Column({ name: "datos_nuevos", type: "json", nullable: true })
    datosNuevos?: Record<string, unknown>;

    @Column({ type: "varchar", length: 45, nullable: true })
    ip?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne(() => Usuario, (usuario) => usuario.auditorias, {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "usuario_id" })
    usuario?: Usuario;
}
