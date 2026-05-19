import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
    Index,
} from "typeorm";
import type { Usuario } from "./Usuario";
import type { Celula } from "./Celula";
import type { MiembroRol } from "./MiembroRol";
import type { MiembroGuia } from "./MiembroGuia";
import type { MiembroActividad } from "./MiembroActividad";
import type { AsistenciaServicio } from "./AsistenciaServicio";
import type { AsistenciaDetalle } from "./AsistenciaDetalle";
import type { Ganado } from "./Ganado";
import type { Traslado } from "./Traslado";

export type EstadoCivil = "soltero" | "casado" | "divorciado" | "viudo" | "union_libre";
export type Genero = "masculino" | "femenino";
export type ProgresoFormacion = "no_iniciado" | "en_curso" | "completado";
export type EstadoMiembro = "activo" | "inactivo" | "trasladado" | "baja";

@Entity("miembros")
@Index("idx_miembro_celula", ["celulaId"])
@Index("idx_miembro_estado", ["estado"])
@Index("idx_miembro_consolidador", ["consolidadorId"])
export class Miembro {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "usuario_id", type: "int", nullable: true, unique: true })
    usuarioId?: number;

    // Datos básicos
    @Column({ type: "varchar", length: 100 })
    nombre!: string;

    @Column({ type: "varchar", length: 100 })
    apellido!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    direccion?: string;

    // Datos complementarios
    @Column({ type: "varchar", length: 20, nullable: true, unique: true })
    cedula?: string;

    @Column({ name: "fecha_nacimiento", type: "date", nullable: true })
    fechaNacimiento?: Date;

    @Column({
        name: "estado_civil",
        type: "enum",
        enum: ["soltero", "casado", "divorciado", "viudo", "union_libre"],
        nullable: true,
    })
    estadoCivil?: EstadoCivil;

    @Column({
        type: "enum",
        enum: ["masculino", "femenino"],
        nullable: true,
    })
    genero?: Genero;

    // Datos laborales
    @Column({ type: "varchar", length: 100, nullable: true })
    profesion?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    oficio?: string;

    @Column({ name: "lugar_trabajo", type: "varchar", length: 150, nullable: true })
    lugarTrabajo?: string;

    @Column({ type: "text", nullable: true })
    talentos?: string;

    // Datos espirituales
    @Column({ name: "celula_id", type: "int", nullable: true })
    celulaId?: number;

    @Column({ name: "fecha_conversion", type: "date", nullable: true })
    fechaConversion?: Date;

    @Column({ name: "invitado_por_id", type: "int", nullable: true })
    invitadoPorId?: number;

    @Column({ name: "consolidador_id", type: "int", nullable: true })
    consolidadorId?: number;

    // Formación espiritual
    @Column({ type: "boolean", default: false })
    encuentro!: boolean;

    @Column({ name: "fecha_encuentro", type: "date", nullable: true })
    fechaEncuentro?: Date;

    @Column({ type: "boolean", default: false })
    bautismo!: boolean;

    @Column({ name: "fecha_bautismo", type: "date", nullable: true })
    fechaBautismo?: Date;

    // Escuela de Líderes
    @Column({
        name: "escuela_fundamento",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaFundamento!: ProgresoFormacion;

    @Column({
        name: "escuela_familia",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaFamilia!: ProgresoFormacion;

    @Column({
        name: "escuela_vision",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaVision!: ProgresoFormacion;

    @Column({
        name: "escuela_intercesion",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaIntercesion!: ProgresoFormacion;

    @Column({
        name: "escuela_liderazgo",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaLiderazgo!: ProgresoFormacion;

    @Column({
        name: "escuela_consolidacion",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaConsolidacion!: ProgresoFormacion;

    // Otras formaciones
    @Column({
        name: "escuela_profetica",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaProfetica!: ProgresoFormacion;

    @Column({
        name: "universidad_am",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    universidadAm!: ProgresoFormacion;

    @Column({
        name: "escuela_teologica",
        type: "enum",
        enum: ["no_iniciado", "en_curso", "completado"],
        default: "no_iniciado",
    })
    escuelaTeologica!: ProgresoFormacion;

    // Estado del miembro
    @Column({
        type: "enum",
        enum: ["activo", "inactivo", "trasladado", "baja"],
        default: "activo",
    })
    estado!: EstadoMiembro;

    @Column({ name: "foto_url", type: "varchar", length: 500, nullable: true })
    fotoUrl?: string;

    @Column({ type: "text", nullable: true })
    notas?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // ---- Relaciones ----
    @OneToOne("Usuario", "miembro", { onDelete: "SET NULL" })
    @JoinColumn({ name: "usuario_id" })
    usuario?: Usuario;

    @ManyToOne("Celula", "miembros", { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "celula_id" })
    celula?: Celula;

    @ManyToOne("Miembro", "invitados", { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "invitado_por_id" })
    invitadoPor?: Miembro;

    @OneToMany("Miembro", "invitadoPor")
    invitados?: Miembro[];

    @ManyToOne("Miembro", "consolidados", { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "consolidador_id" })
    consolidador?: Miembro;

    @OneToMany("Miembro", "consolidador")
    consolidados?: Miembro[];

    @OneToMany("MiembroRol", "miembro")
    roles?: MiembroRol[];

    @OneToMany("MiembroGuia", "miembro")
    guias?: MiembroGuia[];

    @OneToMany("MiembroActividad", "miembro")
    actividades?: MiembroActividad[];

    @OneToMany("AsistenciaServicio", "registradoPor")
    asistenciasRegistradas?: AsistenciaServicio[];

    @OneToMany("AsistenciaDetalle", "miembro")
    asistenciasDetalle?: AsistenciaDetalle[];

    @OneToMany("Ganado", "ganadoPor")
    ganadosPor?: Ganado[];

    @OneToMany("Traslado", "miembro")
    traslados?: Traslado[];

    @OneToMany("Traslado", "solicitadoPor")
    trasladosSolicitados?: Traslado[];

    @OneToMany("Traslado", "aprobadoPor")
    trasladosAprobados?: Traslado[];
}