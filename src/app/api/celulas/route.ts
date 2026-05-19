import { NextResponse } from "next/server";
import { getCelulas, deleteCelula } from "@/lib/actions/celulas.actions";
import { getTerritorios } from "@/lib/actions/territorios.actions";
import { getMiembros } from "@/lib/actions/miembros.actions";

export async function GET() {
    try {
        const [celulas, territorios, miembros] = await Promise.all([
            getCelulas(),
            getTerritorios(),
            getMiembros(),
        ]);

        const celulasConStats = celulas.map((c) => {
            const territorio = territorios.find((t) => t.id === c.territorioId);
            const miembrosCelula = miembros.filter((m) => m.celulaId === c.id);
            return {
                ...c,
                territorio: territorio ? { id: territorio.id, nombre: territorio.nombre, codigo: territorio.codigo } : undefined,
                _miembros: miembrosCelula.length,
                _asistencia: 0,
                _ganados: 0,
            };
        });

        const territoriosSimples = territorios.map((t) => ({
            id: t.id,
            nombre: t.nombre,
            codigo: t.codigo,
        }));

        return NextResponse.json({ celulas: celulasConStats, territorios: territoriosSimples });
    } catch (error) {
        console.error("[API/celulas] Error:", error);
        return NextResponse.json({ error: "Error al cargar células" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const idParam = url.searchParams.get("id");
        const id = idParam ? Number(idParam) : NaN;

        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ error: "ID de célula inválido" }, { status: 400 });
        }

        await deleteCelula(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[API/celulas] DELETE Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Error al eliminar la célula" }, { status: 500 });
    }
}
