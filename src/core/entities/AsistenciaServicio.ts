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
import { Servicio } from "./Servicio";
import { Celula } from "./Celula";
import { Miembro } from "./Miembro";
import { AsistenciaDetalle } from "./AsistenciaDetalle";

@Entity("asistencia_servicio")
@Unique("uk_asistencia_servicio_celula", ["servicioId", "celulaId"])
export class AsistenciaServicio {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "servicio_id", type: "char", length: 36 })
    servicioId!: string;

    @Column({ name: "celula_id", type: "char", length: 36 })
    celulaId!: string;

    @Column({ name: "registrado_por_id", type: "char", length: 36 })
    registradoPorId!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    ofrendas!: number;

    @Column({ type: "text", nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne(() => Servicio, (servicio) => servicio.asistencias, { onDelete: "CASCADE" })
    @JoinColumn({ name: "servicio_id" })
    servicio!: Servicio;

    @ManyToOne(() => Celula, (celula) => celula.asistenciasServicio, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "celula_id" })
    celula!: Celula;

    @ManyToOne(() => Miembro, (miembro) => miembro.asistenciasRegistradas, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "registrado_por_id" })
    registradoPor!: Miembro;

    @OneToMany(() => AsistenciaDetalle, (ad) => ad.asistenciaServicio)
    detalles?: AsistenciaDetalle[];
}
