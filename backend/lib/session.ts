import { randomBytes } from "node:crypto";

import { getRedis } from "./redis";

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const REMEMBERED_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const SESSION_PREFIX = "session:";

type Session = {
  userId: string;
};

export async function createSession(userId: string, rememberMe = false) {
  const token = randomBytes(32).toString("hex");
  const client = await getRedis();
  const ttl = rememberMe
    ? REMEMBERED_SESSION_TTL_SECONDS
    : SESSION_TTL_SECONDS;

  await client.set(`${SESSION_PREFIX}${token}`, JSON.stringify({ userId }), {
    EX: ttl,
  });

  return token;
}

export async function getSession(token: string | undefined) {
  if (!token) {
    return null;
  }

  const client = await getRedis();
  const value = await client.get(`${SESSION_PREFIX}${token}`);

  return value ? (JSON.parse(value) as Session) : null;
}

export async function deleteSession(token: string | undefined) {
  if (!token) {
    return;
  }

  const client = await getRedis();
  await client.del(`${SESSION_PREFIX}${token}`);
}