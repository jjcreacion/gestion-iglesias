import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
} from "typeorm";
import { Miembro } from "./Miembro";
import { Auditoria } from "./Auditoria";

@Entity("usuarios")
export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ name: "password_hash", type: "varchar", length: 255 })
    passwordHash!: string;

    @Column({ type: "boolean", default: true })
    activo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @OneToOne(() => Miembro, (miembro) => miembro.usuario)
    miembro?: Miembro;

    @OneToMany(() => Auditoria, (auditoria) => auditoria.usuario)
    auditorias?: Auditoria[];
}
