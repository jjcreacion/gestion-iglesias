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
import { Rol } from "./Rol";
import { Territorio } from "./Territorio";
import { Celula } from "./Celula";

@Entity("miembro_roles")
@Unique("uk_miembro_rol_contexto", ["miembroId", "rolId", "territorioId", "celulaId"])
export class MiembroRol {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "miembro_id", type: "char", length: 36 })
    miembroId!: string;

    @Column({ name: "rol_id", type: "char", length: 36 })
    rolId!: string;

    @Column({ name: "territorio_id", type: "char", length: 36, nullable: true })
    territorioId?: string;

    @Column({ name: "celula_id", type: "char", length: 36, nullable: true })
    celulaId?: string;

    @Column({ name: "fecha_asignacion", type: "date" })
    fechaAsignacion!: Date;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @ManyToOne(() => Miembro, (miembro) => miembro.roles, { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne(() => Rol, (rol) => rol.miembroRoles, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "rol_id" })
    rol!: Rol;

    @ManyToOne(() => Territorio, (territorio) => territorio.miembroRoles, {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "territorio_id" })
    territorio?: Territorio;

    @ManyToOne(() => Celula, (celula) => celula.miembroRoles, {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "celula_id" })
    celula?: Celula;
}
