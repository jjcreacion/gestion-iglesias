import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { MiembroRol } from "./MiembroRol";

@Entity("roles")
export class Rol {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 50, unique: true })
    nombre!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    descripcion?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @OneToMany(() => MiembroRol, (mr) => mr.rol)
    miembroRoles?: MiembroRol[];
}
