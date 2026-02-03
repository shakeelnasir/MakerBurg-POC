import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  stories,
  opportunities,
  videos,
  cultureEntries,
  savedItems,
  users,
  type Story,
  type Opportunity,
  type Video,
  type CultureEntry,
  type SavedItem,
  type User,
  type InsertUser,
} from "@shared/schema";

export interface IStorage {
  getStories(): Promise<Story[]>;
  getStoryById(id: string): Promise<Story | undefined>;
  getOpportunities(): Promise<Opportunity[]>;
  getOpportunityById(id: string): Promise<Opportunity | undefined>;
  getVideos(): Promise<Video[]>;
  getVideoById(id: string): Promise<Video | undefined>;
  getCultureEntries(): Promise<CultureEntry[]>;
  getCultureEntryById(id: string): Promise<CultureEntry | undefined>;
  getSavedItemsByUser(userId: string): Promise<SavedItem[]>;
  addSavedItem(userId: string, itemKind: string, itemId: string): Promise<SavedItem>;
  removeSavedItem(userId: string, itemKind: string, itemId: string): Promise<void>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getStories(): Promise<Story[]> {
    return db.select().from(stories);
  }

  async getStoryById(id: string): Promise<Story | undefined> {
    const result = await db.select().from(stories).where(eq(stories.id, id));
    return result[0];
  }

  async getOpportunities(): Promise<Opportunity[]> {
    return db.select().from(opportunities);
  }

  async getOpportunityById(id: string): Promise<Opportunity | undefined> {
    const result = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return result[0];
  }

  async getVideos(): Promise<Video[]> {
    return db.select().from(videos);
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    const result = await db.select().from(videos).where(eq(videos.id, id));
    return result[0];
  }

  async getCultureEntries(): Promise<CultureEntry[]> {
    return db.select().from(cultureEntries);
  }

  async getCultureEntryById(id: string): Promise<CultureEntry | undefined> {
    const result = await db.select().from(cultureEntries).where(eq(cultureEntries.id, id));
    return result[0];
  }

  async getSavedItemsByUser(userId: string): Promise<SavedItem[]> {
    return db.select().from(savedItems).where(eq(savedItems.userId, userId));
  }

  async addSavedItem(userId: string, itemKind: string, itemId: string): Promise<SavedItem> {
    const result = await db
      .insert(savedItems)
      .values({ userId, itemKind, itemId })
      .returning();
    return result[0];
  }

  async removeSavedItem(userId: string, itemKind: string, itemId: string): Promise<void> {
    await db
      .delete(savedItems)
      .where(
        and(
          eq(savedItems.userId, userId),
          eq(savedItems.itemKind, itemKind),
          eq(savedItems.itemId, itemId)
        )
      );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
