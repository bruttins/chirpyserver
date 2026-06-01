import { db } from "../index.js";
import { eq, and, isNull, gt } from "drizzle-orm";
import { refresh_tokens } from "../schema.js";

export async function saveRefreshToken(token: string, userId: string, expiresAt: Date) {
    const [newToken] = await
        db.insert(refresh_tokens).values({
            token,
            user_id: userId,
            expires_at: expiresAt,
        }).onConflictDoNothing().returning();
    return newToken;
}

export async function getRefreshToken(token: string) {
    const [refreshToken] = await
    db.select().from(refresh_tokens).where(and(
        eq(refresh_tokens.token, token),
        isNull(refresh_tokens.revoked_at),
        gt(refresh_tokens.expires_at, new Date())
    )).limit(1);
    return refreshToken;
}

export async function revokeRefreshToken(token: string) {
    const now = new Date();
    const [revokedToken] = await
        db.update(refresh_tokens).set({ revoked_at: now }).where(eq(refresh_tokens.token, token)).returning();
    return revokedToken;
}