import { NextResponse } from "next/server";
import { getTerritorios, deleteTerritorio } from "@/lib/actions/territorios.actions";
import { getCelulas } from "@/lib/actions/celulas.actions";
import { getMiembros } from "@/lib/actions/miembros.actions";

export async function GET() {
    try {
        const [territorios, celulas, miembros] = await Promise.all([
            getTerritorios(),
            getCelulas(),
            getMiembros(),
        ]);

        const territoriosConStats = territorios.map((t) => ({
            ...t,
            _celulas: celulas.filter((c) => c.territorioId === t.id).length,
            _miembros: miembros.filter((m) => {
                const celula = celulas.find((c) => c.id === m.celulaId);
                return celula?.territorioId === t.id;
            }).length,
        }));

        return NextResponse.json({ territorios: territoriosConStats });
    } catch (error) {
        console.error("[API/territorios] Error:", error);
        return NextResponse.json({ error: "Error al cargar territorios" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const idParam = url.searchParams.get("id");
        const id = idParam ? Number(idParam) : NaN;

        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ error: "ID de territorio inválido" }, { status: 400 });
        }

        await deleteTerritorio(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[API/territorios] DELETE Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Error al eliminar el territorio" }, { status: 500 });
    }
}
