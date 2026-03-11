import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { MiembroActividad } from "./MiembroActividad";

export type TipoActividad = "encuentro" | "retiro" | "taller" | "capacitacion" | "otro";

@Entity("actividades")
export class Actividad {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ type: "text", nullable: true })
    descripcion?: string;

    @Column({ type: "date", nullable: true })
    fecha?: Date;

    @Column({
        type: "enum",
        enum: ["encuentro", "retiro", "taller", "capacitacion", "otro"],
        default: "otro",
    })
    tipo!: TipoActividad;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @OneToMany(() => MiembroActividad, (ma) => ma.actividad)
    miembroActividades?: MiembroActividad[];
}
