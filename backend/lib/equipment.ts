import { EquipmentStatus, Prisma } from "@prisma/client";

import { prisma } from "./prisma";

export const equipmentStatusSchema = [
  EquipmentStatus.AVAILABLE,
  EquipmentStatus.BORROWED,
  EquipmentStatus.IN_REPAIR,
] as const;

export const equipmentSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EquipmentSelect;

export async function listEquipment(status?: EquipmentStatus) {
  return prisma.equipment.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    select: equipmentSelect,
  });
}

export async function getEquipment(id: string) {
  return prisma.equipment.findUnique({
    where: { id },
    select: equipmentSelect,
  });
}