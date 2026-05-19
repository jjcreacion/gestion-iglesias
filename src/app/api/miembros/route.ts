import { NextResponse } from "next/server";
import { getMiembros, getMiembrosByCelula, getMiembrosByTerritorio } from "@/lib/actions/miembros.actions";
import { getCelulas } from "@/lib/actions/celulas.actions";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const celulaId = url.searchParams.get("celulaId");
        const territorioId = url.searchParams.get("territorioId");

        if (celulaId) {
            const miembros = await getMiembrosByCelula(Number(celulaId));
            return NextResponse.json({ miembros });
        }

        if (territorioId) {
            const miembros = await getMiembrosByTerritorio(Number(territorioId));
            return NextResponse.json({ miembros });
        }

        const [miembros, celulas] = await Promise.all([
            getMiembros(),
            getCelulas(),
        ]);

        const now = new Date();
        const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

        const stats = {
            total: miembros.length,
            activos: miembros.filter((m) => m.estado === "activo").length,
            conDecadas: miembros.filter((m) => !!m.celulaId).length,
            nuevos: miembros.filter(
                (m) => m.createdAt && new Date(m.createdAt) >= inicioMes
            ).length,
        };

        return NextResponse.json({ miembros, celulas, stats });
    } catch (error) {
        console.error("[API/miembros] Error:", error);
        return NextResponse.json({ error: "Error al cargar miembros" }, { status: 500 });
    }
}
