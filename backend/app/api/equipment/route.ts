import { EquipmentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { equipmentStatusSchema, listEquipment } from "../../../lib/equipment";
import { prisma } from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/auth";

const createEquipmentSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).nullable().optional(),
  status: z.enum(equipmentStatusSchema).optional().default(EquipmentStatus.AVAILABLE),
});

export async function GET(request: NextRequest) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const rawStatus = request.nextUrl.searchParams.get("status");
  const status = rawStatus
    ? z.enum(equipmentStatusSchema).safeParse(rawStatus)
    : { success: true as const, data: undefined };

  if (!status.success) {
    return NextResponse.json({ error: "Invalid equipment status" }, { status: 400 });
  }

  const equipment = await listEquipment(status.data);
  return NextResponse.json({ equipment });
}

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = createEquipmentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid equipment data" }, { status: 400 });
  }

  const equipment = await prisma.equipment.create({
    data: result.data,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ equipment }, { status: 201 });
}