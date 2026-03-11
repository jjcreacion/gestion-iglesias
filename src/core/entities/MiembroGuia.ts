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
import { Miembro } from "./Miembro";
import { Guia } from "./Guia";

@Entity("miembro_guias")
@Unique("uk_miembro_guia", ["miembroId", "guiaId"])
export class MiembroGuia {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "miembro_id", type: "char", length: 36 })
    miembroId!: string;

    @Column({ name: "guia_id", type: "char", length: 36 })
    guiaId!: string;

    @Column({ type: "boolean", default: false })
    completada!: boolean;

    @Column({ name: "fecha_completada", type: "date", nullable: true })
    fechaCompletada?: Date;

    @Column({ name: "marcada_por_id", type: "char", length: 36, nullable: true })
    marcadaPorId?: string;

    @Column({ type: "text", nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne(() => Miembro, (miembro) => miembro.guias, { onDelete: "CASCADE" })
    @JoinColumn({ name: "miembro_id" })
    miembro!: Miembro;

    @ManyToOne(() => Guia, (guia) => guia.miembroGuias, { onDelete: "CASCADE" })
    @JoinColumn({ name: "guia_id" })
    guia!: Guia;

    @ManyToOne(() => Miembro, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "marcada_por_id" })
    marcadaPor?: Miembro;
}
