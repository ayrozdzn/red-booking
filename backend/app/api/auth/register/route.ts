import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { registerUser, setSession } from "../../../../lib/auth";

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  try {
    const user = await registerUser(result.data.email, result.data.password);
    await setSession(user.id);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    throw error;
  }
}