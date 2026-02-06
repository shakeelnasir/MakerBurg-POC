import type { Express } from "express";
import { createServer, type Server } from "node:http";
import bcrypt from "bcrypt";
import { storage } from "./storage";

const SALT_ROUNDS = 12;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      const existing = await storage.getUserByEmail(email.toLowerCase().trim());
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await storage.createUser({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      });
      req.session.userId = user.id;
      res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      const user = await storage.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

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
