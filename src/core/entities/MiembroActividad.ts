import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import type { Miembro } from "./Miembro";
import type { Actividad } from "./Actividad";

@Entity("miembro_actividades")
@Unique("uk_miembro_actividad", ["miembroId", "actividadId"])
export class MiembroActividad {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "miembro_id", type: "int" })
    miembroId!: number;

    @Column({ name: "actividad_id", type: "int" })
    actividadId!: number;

    @Column({ type: "boolean", default: false })
    asistio!: boolean;

    @Column({ name: "fecha_registro", type: "date", nullable: true })
    fechaRegistro?: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne("Miembro", "actividades", { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne("Actividad", "miembroActividades", { onDelete: "CASCADE" })
    @JoinColumn({ name: "actividad_id" })
    actividad!: Actividad;
}