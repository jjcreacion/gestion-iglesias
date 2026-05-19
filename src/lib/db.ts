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

const databaseName = process.env.DB_NAME || "proyecto-ccc";

function createDataSource() {
  return new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: databaseName,
    charset: "utf8mb4",
    synchronize: true, // true para desarrollo, crea tablas automáticamente
    logging: false,
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
}

declare global {
  var __APP_DATA_SOURCE__: DataSource | undefined;
}

const isDevelopment = process.env.NODE_ENV !== "production";
const AppDataSource = isDevelopment ? createDataSource() : globalThis.__APP_DATA_SOURCE__ ?? createDataSource();
if (!isDevelopment && !globalThis.__APP_DATA_SOURCE__) {
  globalThis.__APP_DATA_SOURCE__ = AppDataSource;
}

async function ensureDatabaseExists() {
  const tempDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });

  await tempDataSource.initialize();
  await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await tempDataSource.destroy();
}

/**
 * Inicializa y devuelve el DataSource de TypeORM.
 * Crea la base de datos si no existe.
 */
export async function getDataSource(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await ensureDatabaseExists();

    try {
      await AppDataSource.initialize();
    } catch (error) {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }

      const freshDataSource = createDataSource();
      globalThis.__APP_DATA_SOURCE__ = freshDataSource;
      await freshDataSource.initialize();
      return freshDataSource;
    }
  }

  return AppDataSource;
}

export default AppDataSource;
