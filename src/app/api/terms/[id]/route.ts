import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// PUT: actualiza un término existente
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, content, tags } = await req.json();
  const termId = parseInt(params.id);

  try {
    // Primero desconectamos todas las etiquetas existentes
    await prisma.term.update({
      where: { id: termId },
      data: {
        tags: {
          set: []
        }
      }
    });

    // Luego actualizamos el término con las nuevas etiquetas
    const term = await prisma.term.update({
      where: { id: termId },
      data: {
        title,
        content,
        tags: {
          connectOrCreate: tags.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: { tags: true }
    });

    return NextResponse.json(term);
  } catch (error) {
    return NextResponse.json({ error: "Error updating term" }, { status: 500 });
  }
}

// DELETE: elimina un término
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const termId = parseInt(params.id);

  try {
    await prisma.term.delete({
      where: { id: termId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting term" }, { status: 500 });
  }
}