import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, date } = body;

    if (!name || !phone || !service || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slot is already taken
    const existing = await prisma.appointment.findFirst({
      where: {
        date: new Date(date)
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        service,
        date: new Date(date)
      }
    });

    // TODO: Enviar email de notificación aquí

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
