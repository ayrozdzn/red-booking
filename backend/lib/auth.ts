import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";

import { prisma } from "./prisma";
import { createSession, deleteSession, getSession } from "./session";

export const SESSION_COOKIE = "red_booking_session";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function registerUser(email: string, password: string) {
  const passwordHash = await hash(password, 12);

  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.passwordHash))) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function setSession(userId: string) {
  const token = await createSession(userId);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, cookieOptions);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await getSession(token);

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  await deleteSession(token);
  cookieStore.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}