import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side if key is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "KORA - Orchestrated Reasoning Agent",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Server-side Gemini enhancement proxy
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Missing prompt parameter" });
      return;
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      // Return null so the client gracefully uses verified deterministic synthesis
      res.json({ text: null, source: "deterministic_fallback" });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the official KORA (Orchestrated Reasoning Agent). Answer clearly, professionally, and strictly grounded in the provided company policies with explicit citations."
      }
    });

    res.json({ text: response.text, source: "gemini-3.8-flash" });
  } catch (error: any) {
    console.error("Gemini API call failed:", error?.message || error);
    // Return gracefully without crashing
    res.json({ text: null, error: error?.message || "Gemini inference unavailable" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KORA - Orchestrated Reasoning Agent running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
