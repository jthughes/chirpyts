import {
  pgTable,
  timestamp,
  uuid,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).notNull().unique(),
  hashedPassword: varchar("hashed_password").notNull().default("unset"),
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text("body").notNull(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
