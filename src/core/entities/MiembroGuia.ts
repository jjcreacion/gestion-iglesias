import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import type { Miembro } from "./Miembro";
import type { Guia } from "./Guia";

@Entity("miembro_guias")
@Unique("uk_miembro_guia", ["miembroId", "guiaId"])
export class MiembroGuia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "miembro_id", type: "int" })
    miembroId!: number;

    @Column({ name: "guia_id", type: "int" })
    guiaId!: number;

    @Column({ type: "boolean", default: false })
    completada!: boolean;

    @Column({ name: "fecha_completada", type: "date", nullable: true })
    fechaCompletada?: Date;

    @Column({ name: "marcada_por_id", type: "int", nullable: true })
    marcadaPorId?: number;

    @Column({ type: "text", nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne("Miembro", "guias", { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne("Guia", "miembroGuias", { onDelete: "CASCADE" })
    @JoinColumn({ name: "guia_id" })
    guia!: Guia;

    @ManyToOne("Miembro", undefined, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "marcada_por_id" })
    marcadaPor?: Miembro;
}