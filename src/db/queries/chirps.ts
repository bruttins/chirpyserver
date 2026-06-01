import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc, desc, eq } from "drizzle-orm";

export async function createChirp(body: string, userId: string) {
    const [chirp] = await db.insert(chirps).values({
        userId,
        body
    }).returning();
    return chirp;
}

export async function getChirps(authorId?: string, sort: "asc" | "desc" = "asc") {
    let chirpsList = await db.select().
        from(chirps)
        .where(authorId ? eq(chirps.userId, authorId) : undefined)
        .orderBy(sort === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt));
    return chirpsList;
}

export async function getChirpById(id: string) {
    const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id));
    return chirp;
}

export async function deleteChirpById(id: string) {
    const [chirp] = await db.delete(chirps).where(eq(chirps.id, id)).returning();
    return chirp;
}