import { EquipmentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { equipmentSelect, getEquipment, equipmentStatusSchema } from "../../../../lib/equipment";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";

const updateEquipmentSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    status: z.enum(equipmentStatusSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
  }

  return NextResponse.json({ equipment });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const result = updateEquipmentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid equipment data" }, { status: 400 });
  }

  try {
    const equipment = await prisma.equipment.update({
      where: { id },
      data: result.data,
      select: equipmentSelect,
    });

    return NextResponse.json({ equipment });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    throw error;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.equipment.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    throw error;
  }
}