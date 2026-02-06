import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdOn: timestamp("created_on").defaultNow(),
});

export const stories = pgTable("stories", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  readTime: text("read_time").notNull(),
  region: text("region").notNull(),
  craft: text("craft").notNull(),
  hero: text("hero").notNull(),
  body: json("body").$type<string[]>().notNull(),
  inlineImage: text("inline_image"),
  cultureLinks: json("culture_links").$type<{ label: string; value: string }[]>(),
  source: text("source"),
  srcFavIcon: text("src_fav_icon"),
  srcLink: text("src_link"),
  author: text("author"),
  isPublished: boolean("is_published").default(true),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
});

export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  forLine: text("for_line").notNull(),
  deadline: text("deadline").notNull(),
  region: text("region").notNull(),
  category: text("category").notNull(),
  about: text("about").notNull(),
  who: json("who").$type<string[]>().notNull(),
  offer: json("offer").$type<string[]>().notNull(),
  linkLabel: text("link_label").notNull(),
  source: text("source"),
  srcFavIcon: text("src_fav_icon"),
  srcLink: text("src_link"),
  author: text("author"),
  isPublished: boolean("is_published").default(true),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  duration: text("duration").notNull(),
  region: text("region").notNull(),
  craft: text("craft").notNull(),
  thumb: text("thumb").notNull(),
  description: text("description").notNull(),
  source: text("source"),
  srcFavIcon: text("src_fav_icon"),
  srcLink: text("src_link"),
  author: text("author"),
  isPublished: boolean("is_published").default(true),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
});

export const cultureEntries = pgTable("culture_entries", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  region: text("region").notNull(),
  craft: text("craft").notNull(),
  hero: text("hero").notNull(),
  intro: text("intro").notNull(),
  sections: json("sections").$type<{ h: string; p: string }[]>().notNull(),
  author: text("author"),
  isPublished: boolean("is_published").default(true),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
});

export const savedItems = pgTable("saved_items", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemKind: text("item_kind").notNull(),
  itemId: varchar("item_id").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertStorySchema = createInsertSchema(stories);
export const insertOpportunitySchema = createInsertSchema(opportunities);
export const insertVideoSchema = createInsertSchema(videos);
export const insertCultureEntrySchema = createInsertSchema(cultureEntries);
export const insertSavedItemSchema = createInsertSchema(savedItems).pick({
  userId: true,
  itemKind: true,
  itemId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Story = typeof stories.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type CultureEntry = typeof cultureEntries.$inferSelect;
export type SavedItem = typeof savedItems.$inferSelect;
