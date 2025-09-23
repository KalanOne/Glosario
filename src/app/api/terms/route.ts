import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: lista todos los términos
export async function GET() {
  const terms = await prisma.term.findMany({
    include: { tags: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(terms);
}

// POST: crea un nuevo término
export async function POST(req: Request) {
  const { title, content, tags } = await req.json();

  const term = await prisma.term.create({
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
}
