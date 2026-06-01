import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result;
}

export async function updateUserEmailAndPassword(
    userID: string, 
    email: string, 
    hashed_password: string) {
  const [result] = await db.update(users)
    .set({ email, hashed_password })
    .where(eq(users.id, userID))
    .returning();
  return result;
}

export async function updateUserIsChirpyRed(userID: string) {
  const [updatedUser] = await db.update(users)
    .set({ is_chirpy_red: true })
    .where(eq(users.id, userID))
    .returning();
  return updatedUser;
}