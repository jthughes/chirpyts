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
});
