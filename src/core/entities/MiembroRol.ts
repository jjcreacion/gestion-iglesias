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
import type { Rol } from "./Rol";
import type { Territorio } from "./Territorio";
import type { Celula } from "./Celula";

@Entity("miembro_roles")
@Unique("uk_miembro_rol_contexto", ["miembroId", "rolId", "territorioId", "celulaId"])
export class MiembroRol {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "miembro_id", type: "int" })
    miembroId!: number;

    @Column({ name: "rol_id", type: "int" })
    rolId!: number;

    @Column({ name: "territorio_id", type: "int", nullable: true })
    territorioId?: number;

    @Column({ name: "celula_id", type: "int", nullable: true })
    celulaId?: number;

    @Column({ name: "fecha_asignacion", type: "date" })
    fechaAsignacion!: Date;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne("Miembro", "roles", { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne("Rol", "miembroRoles", { onDelete: "RESTRICT" })
    @JoinColumn({ name: "rol_id" })
    rol!: Rol;

    @ManyToOne("Territorio", "miembroRoles", {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "territorio_id" })
    territorio?: Territorio;

    @ManyToOne("Celula", "miembroRoles", {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "celula_id" })
    celula?: Celula;
}