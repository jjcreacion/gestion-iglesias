import "reflect-metadata";
import {
    Entity,
    Index,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    RelationId,
} from "typeorm";
import type { Celula } from "./Celula";
import type { Miembro } from "./Miembro";
import type { MiembroRol } from "./MiembroRol";

@Index(["codigo", "activo"], { unique: true })
@Entity("territorios")
export class Territorio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 20 })
    codigo!: string;

    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ type: "varchar", length: 7, default: "#1a365d" })
    color!: string;

    @Column({ type: "text", nullable: true })
    descripcion?: string;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @OneToMany("Celula", "territorio")
    celulas?: Celula[];

    @ManyToOne("Miembro", { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "lider_id" })
    lider?: Miembro;

    @RelationId((territorio: Territorio) => territorio.lider)
    liderId?: number;

    @ManyToOne("Miembro", { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "colider_id" })
    colider?: Miembro;

    @RelationId((territorio: Territorio) => territorio.colider)
    coliderId?: number;

    @OneToMany("MiembroRol", "territorio")
    miembroRoles?: MiembroRol[];
}