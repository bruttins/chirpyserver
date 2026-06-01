import { pgTable, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashed_password: varchar("hashed_password").notNull().default("unset"),
    is_chirpy_red: boolean("is_chirpy_red").notNull().default(false),  
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    body: varchar("body", { length: 140 }).notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
})

export const refresh_tokens = pgTable("refresh_tokens", {
    token: varchar("token", { length: 256 }).primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires_at: timestamp("expires_at").notNull(),
    revoked_at: timestamp("revoked_at"),
});