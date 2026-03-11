import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Territorio } from "./Territorio";
import { Miembro } from "./Miembro";
import { MiembroRol } from "./MiembroRol";
import { AsistenciaServicio } from "./AsistenciaServicio";
import { Ganado } from "./Ganado";
import { Traslado } from "./Traslado";

export type DiaReunion =
    | "lunes"
    | "martes"
    | "miercoles"
    | "jueves"
    | "viernes"
    | "sabado"
    | "domingo";

@Entity("celulas")
export class Celula {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 20, unique: true })
    codigo!: string;

    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ name: "territorio_id", type: "char", length: 36 })
    territorioId!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    direccion?: string;

    @Column({
        name: "dia_reunion",
        type: "enum",
        enum: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"],
        nullable: true,
        default: "miercoles",
    })
    diaReunion?: DiaReunion;

    @Column({ name: "hora_reunion", type: "time", nullable: true })
    horaReunion?: string;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne(() => Territorio, (territorio) => territorio.celulas, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "territorio_id" })
    territorio!: Territorio;

    @OneToMany(() => Miembro, (miembro) => miembro.celula)
    miembros?: Miembro[];

    @OneToMany(() => MiembroRol, (mr) => mr.celula)
    miembroRoles?: MiembroRol[];

    @OneToMany(() => AsistenciaServicio, (as) => as.celula)
    asistenciasServicio?: AsistenciaServicio[];

    @OneToMany(() => Ganado, (ganado) => ganado.celula)
    ganados?: Ganado[];

    @OneToMany(() => Traslado, (t) => t.celulaOrigen)
    trasladosOrigen?: Traslado[];

    @OneToMany(() => Traslado, (t) => t.celulaDestino)
    trasladosDestino?: Traslado[];
}
