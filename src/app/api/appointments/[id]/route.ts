import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Extraer el 'id' esperando la promesa (Requisito de Next.js 15+)
    const { id } = await context.params;

    // 2. Extraer el 'status' del cuerpo de la petición
    const { status } = await request.json();
    
    // 3. Validar que el estado sea correcto
    if (!['PENDING', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 4. Actualizar en la base de datos de Supabase usando Prisma
    const updated = await prisma.appointment.update({
      where: { id: id },
      data: { status }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: 'Error updating appointment' }, { status: 500 });
  }
}
