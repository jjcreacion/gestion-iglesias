import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Unique,
} from "typeorm";
import type { Servicio } from "./Servicio";
import type { Celula } from "./Celula";
import type { Miembro } from "./Miembro";
import type { AsistenciaDetalle } from "./AsistenciaDetalle";

@Entity("asistencia_servicio")
@Unique("uk_asistencia_servicio_celula", ["servicioId", "celulaId"])
export class AsistenciaServicio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "servicio_id", type: "int" })
    servicioId!: number;

    @Column({ name: "celula_id", type: "int" })
    celulaId!: number;

    @Column({ name: "registrado_por_id", type: "int" })
    registradoPorId!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    ofrendas!: number;

    @Column({ type: "text", nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne("Servicio", "asistencias", { onDelete: "CASCADE" })
    @JoinColumn({ name: "servicio_id" })
    servicio!: Servicio;

    @ManyToOne("Celula", "asistenciasServicio", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "celula_id" })
    celula!: Celula;

    @ManyToOne("Miembro", "asistenciasRegistradas", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "registrado_por_id" })
    registradoPor!: Miembro;

    @OneToMany("AsistenciaDetalle", "asistenciaServicio")
    detalles?: AsistenciaDetalle[];
}