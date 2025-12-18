import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, refreshTokens, users } from "../schema.js";
import { ref } from "node:process";

export async function storeRefreshToken(
  refreshToken: string,
  userID: string,
  expiresInSeconds: number,
) {
  const [result] = await db
    .insert(refreshTokens)
    .values({
      token: refreshToken,
      expires_at: new Date(Date.now() + expiresInSeconds * 1000),
      user_id: userID,
    })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllRefreshTokens() {
  const result = await db.delete(refreshTokens);
}

export async function getRefreshTokenByToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return result;
}

export async function markTokenAsRevoked(token: string) {
  const [result] = await db
    .update(refreshTokens)
    .set({ revoked_at: new Date(Date.now()) })
    .where(eq(refreshTokens.token, token))
    .returning();
  return result;
}
