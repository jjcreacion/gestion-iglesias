import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "@/core/entities/Usuario";
import { Territorio } from "@/core/entities/Territorio";
import { Celula } from "@/core/entities/Celula";
import { Miembro } from "@/core/entities/Miembro";
import { Rol } from "@/core/entities/Rol";
import { MiembroRol } from "@/core/entities/MiembroRol";
import { Guia } from "@/core/entities/Guia";
import { MiembroGuia } from "@/core/entities/MiembroGuia";
import { Servicio } from "@/core/entities/Servicio";
import { AsistenciaServicio } from "@/core/entities/AsistenciaServicio";
import { AsistenciaDetalle } from "@/core/entities/AsistenciaDetalle";
import { Ganado } from "@/core/entities/Ganado";
import { Actividad } from "@/core/entities/Actividad";
import { MiembroActividad } from "@/core/entities/MiembroActividad";
import { Traslado } from "@/core/entities/Traslado";
import { Configuracion } from "@/core/entities/Configuracion";
import { Auditoria } from "@/core/entities/Auditoria";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "congregados",
  charset: "utf8mb4",
  synchronize: false, // nunca true en producción
  logging: process.env.NODE_ENV === "development",
  entities: [
    Usuario,
    Territorio,
    Celula,
    Miembro,
    Rol,
    MiembroRol,
    Guia,
    MiembroGuia,
    Servicio,
    AsistenciaServicio,
    AsistenciaDetalle,
    Ganado,
    Actividad,
    MiembroActividad,
    Traslado,
    Configuracion,
    Auditoria,
  ],
});

/**
 * Inicializa y devuelve el DataSource de TypeORM.
 * Reutiliza la conexión si ya está inicializada (singleton seguro para Next.js).
 */
export async function getDataSource(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

export default AppDataSource;
