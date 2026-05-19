import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from "typeorm";
import type { Miembro } from "./Miembro";
import type { Celula } from "./Celula";
import type { Servicio } from "./Servicio";

export type ContextoGanado = "celula" | "servicio" | "personal";

@Entity("ganados")
@Index("idx_ganado_fecha", ["fechaGanado"])
@Index("idx_ganado_por", ["ganadoPorId"])
export class Ganado {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ type: "varchar", length: 100 })
    apellido!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    direccion?: string;

    @Column({ name: "fecha_ganado", type: "date" })
    fechaGanado!: Date;

    @Column({ name: "ganado_por_id", type: "int" })
    ganadoPorId!: number;

    @Column({ name: "celula_id", type: "int", nullable: true })
    celulaId?: number;

    @Column({ name: "servicio_id", type: "int", nullable: true })
    servicioId?: number;

    @Column({
        type: "enum",
        enum: ["celula", "servicio", "personal"],
        default: "personal",
    })
    contexto!: ContextoGanado;

    @Column({ name: "convertido_a_miembro", type: "boolean", default: false })
    convertidoAMiembro!: boolean;

    @Column({ name: "miembro_id", type: "int", nullable: true })
    miembroId?: number;

    @Column({ type: "text", nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne("Miembro", "ganadosPor", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "ganado_por_id" })
    ganadoPor!: Miembro;

    @ManyToOne("Celula", "ganados", { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "celula_id" })
    celula?: Celula;

    @ManyToOne("Servicio", "ganados", { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "servicio_id" })
    servicio?: Servicio;

    @ManyToOne("Miembro", undefined, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "miembro_id" })
    miembro?: Miembro;
}