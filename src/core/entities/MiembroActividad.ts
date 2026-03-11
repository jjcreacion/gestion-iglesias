import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import { Miembro } from "./Miembro";
import { Actividad } from "./Actividad";

@Entity("miembro_actividades")
@Unique("uk_miembro_actividad", ["miembroId", "actividadId"])
export class MiembroActividad {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "miembro_id", type: "char", length: 36 })
    miembroId!: string;

    @Column({ name: "actividad_id", type: "char", length: 36 })
    actividadId!: string;

    @Column({ type: "boolean", default: false })
    asistio!: boolean;

    @Column({ name: "fecha_registro", type: "date", nullable: true })
    fechaRegistro?: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne(() => Miembro, (miembro) => miembro.actividades, { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne(() => Actividad, (actividad) => actividad.miembroActividades, { onDelete: "CASCADE" })
    @JoinColumn({ name: "actividad_id" })
    actividad!: Actividad;
}
