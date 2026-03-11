import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    Unique,
} from "typeorm";
import { AsistenciaServicio } from "./AsistenciaServicio";
import { Ganado } from "./Ganado";

export type TipoServicio = "domingo" | "especial" | "entre_semana";

@Entity("servicios")
@Unique("uk_servicio_fecha_tipo", ["fecha", "tipo"])
export class Servicio {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "date" })
    fecha!: Date;

    @Column({
        type: "enum",
        enum: ["domingo", "especial", "entre_semana"],
        default: "domingo",
    })
    tipo!: TipoServicio;

    @Column({ type: "varchar", length: 255, nullable: true })
    descripcion?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @OneToMany(() => AsistenciaServicio, (as) => as.servicio)
    asistencias?: AsistenciaServicio[];

    @OneToMany(() => Ganado, (g) => g.servicio)
    ganados?: Ganado[];
}
