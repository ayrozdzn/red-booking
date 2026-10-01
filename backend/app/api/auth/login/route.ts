import { NextResponse } from "next/server";
import { z } from "zod";

import { authenticateUser, setSession } from "../../../../lib/auth";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const user = await authenticateUser(result.data.email, result.data.password);

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setSession(user.id, result.data.rememberMe);
  return NextResponse.json({ user });
}