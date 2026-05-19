import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    Unique,
} from "typeorm";
import type { MiembroGuia } from "./MiembroGuia";

@Entity("guias")
@Unique("uk_guia_numero", ["numero"])
export class Guia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    numero!: number;

    @Column({ type: "varchar", length: 100 })
    titulo!: string;

    @Column({ type: "text", nullable: true })
    descripcion?: string;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relaciones
    @OneToMany("MiembroGuia", "guia")
    miembroGuias?: MiembroGuia[];
}