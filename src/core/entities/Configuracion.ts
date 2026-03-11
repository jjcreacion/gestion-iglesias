import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
} from "typeorm";

@Entity("configuracion")
export class Configuracion {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    clave!: string;

    @Column({ type: "text" })
    valor!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    descripcion?: string;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
}
