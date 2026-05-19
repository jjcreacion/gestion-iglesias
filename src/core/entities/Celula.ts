import "reflect-metadata";
import {
    Entity,
    Index,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    RelationId,
} from "typeorm";
import type { Territorio } from "./Territorio";
import type { Miembro } from "./Miembro";
import type { MiembroRol } from "./MiembroRol";
import type { AsistenciaServicio } from "./AsistenciaServicio";
import type { Ganado } from "./Ganado";
import type { Traslado } from "./Traslado";

export type DiaReunion =
    | "lunes"
    | "martes"
    | "miercoles"
    | "jueves"
    | "viernes"
    | "sabado"
    | "domingo";

@Index(["codigo", "activo"], { unique: true })
@Entity("celulas")
export class Celula {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 20 })
    codigo!: string;

    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ name: "territorio_id", type: "int" })
    territorioId!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    direccion?: string;

    @Column({ type: "json", nullable: true })
    diasReunion?: DiaReunion[];

    @Column({ type: "json", nullable: true })
    horariosReunion?: Partial<Record<DiaReunion, string>>;

    @Column({ name: "hora_reunion", type: "time", nullable: true })
    horaReunion?: string;

    @ManyToOne("Miembro", { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "lider_id" })
    lider?: Miembro;

    @RelationId((celula: Celula) => celula.lider)
    liderId?: number;

    @ManyToOne("Miembro", { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "colider_id" })
    colider?: Miembro;

    @RelationId((celula: Celula) => celula.colider)
    coliderId?: number;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne("Territorio", "celulas", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "territorio_id" })
    territorio!: Territorio;

    @OneToMany("Miembro", "celula")
    miembros?: Miembro[];

    @OneToMany("MiembroRol", "celula")
    miembroRoles?: MiembroRol[];

    @OneToMany("AsistenciaServicio", "celula")
    asistenciasServicio?: AsistenciaServicio[];

    @OneToMany("Ganado", "celula")
    ganados?: Ganado[];

    @OneToMany("Traslado", "celulaOrigen")
    trasladosOrigen?: Traslado[];

    @OneToMany("Traslado", "celulaDestino")
    trasladosDestino?: Traslado[];
}