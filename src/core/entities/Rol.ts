import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import type { MiembroRol } from "./MiembroRol";

@Entity("roles")
export class Rol {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 50, unique: true })
    nombre!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    descripcion?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @OneToMany("MiembroRol", "rol")
    miembroRoles?: MiembroRol[];
}