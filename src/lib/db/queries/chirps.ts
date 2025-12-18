import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";

export async function createChirp(body: string, user_id: string) {
  const [result] = await db
    .insert(chirps)
    .values({ user_id: user_id, body: body })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps() {
  const result = await db.select().from(chirps);
  return result;
}

export async function getChirpByID(chirp_id: string) {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirp_id));
  return result;
}

export async function deleteChirpByID(chirp_id: string) {
  const [result] = await db
    .delete(chirps)
    .where(eq(chirps.id, chirp_id))
    .returning();
}
