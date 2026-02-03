import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stories
  app.get("/api/stories", async (_req, res) => {
    try {
      const data = await storage.getStories();
      res.json(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await storage.getStoryById(req.params.id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });

  // Opportunities
  app.get("/api/opportunities", async (_req, res) => {
    try {
      const data = await storage.getOpportunities();
      res.json(data);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  app.get("/api/opportunities/:id", async (req, res) => {
    try {
      const opp = await storage.getOpportunityById(req.params.id);
      if (!opp) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.json(opp);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
      res.status(500).json({ error: "Failed to fetch opportunity" });
    }
  });

  // Videos
  app.get("/api/videos", async (_req, res) => {
    try {
      const data = await storage.getVideos();
      res.json(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideoById(req.params.id);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Culture entries
  app.get("/api/culture", async (_req, res) => {
    try {
      const data = await storage.getCultureEntries();
      res.json(data);
    } catch (error) {
      console.error("Error fetching culture entries:", error);
      res.status(500).json({ error: "Failed to fetch culture entries" });
    }
  });

  app.get("/api/culture/:id", async (req, res) => {
    try {
      const entry = await storage.getCultureEntryById(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Culture entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching culture entry:", error);
      res.status(500).json({ error: "Failed to fetch culture entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
