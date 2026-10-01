import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";

import { prisma } from "./prisma";
import {
  createSession,
  deleteSession,
  getSession,
  REMEMBERED_SESSION_TTL_SECONDS,
  SESSION_TTL_SECONDS,
} from "./session";

export const SESSION_COOKIE = "red_booking_session";

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
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

export async function setSession(userId: string, rememberMe = false) {
  const token = await createSession(userId, rememberMe);
  const cookieStore = await cookies();
  const maxAge = rememberMe
    ? REMEMBERED_SESSION_TTL_SECONDS
    : SESSION_TTL_SECONDS;

  cookieStore.set(SESSION_COOKIE, token, { ...baseCookieOptions, maxAge });
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
  cookieStore.set(SESSION_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
}