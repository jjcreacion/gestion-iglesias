import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { Celula } from "./Celula";
import { MiembroRol } from "./MiembroRol";

@Entity("territorios")
export class Territorio {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 20, unique: true })
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
    @OneToMany(() => Celula, (celula) => celula.territorio)
    celulas?: Celula[];

    @OneToMany(() => MiembroRol, (mr) => mr.territorio)
    miembroRoles?: MiembroRol[];
}
