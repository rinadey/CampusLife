import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini lazily if API key exists
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Natural Language Schedule Parser
app.post("/api/parse-event", async (req, res) => {
  try {
    const { input, referenceDate } = req.body;
    if (!input || typeof input !== "string") {
      res.status(400).json({ error: "Missing 'input' text parameter" });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      // Fallback message so client can run offline heuristic parser
      res.status(503).json({
        error: "GEMINI_API_KEY is not configured",
        fallback: true,
      });
      return;
    }

    const todayStr = referenceDate || "2026-09-12"; // e.g. Saturday Sep 12, 2026

    const prompt = `You are a smart university and lifestyle calendar assistant.
Extract all events, classes, tasks, or social activities from the user's freeform text.
Reference "Today" as: ${todayStr}.
If days like "Monday", "Friday", "Tuesday" are mentioned relative to today, compute the correct YYYY-MM-DD.
For recurring classes (e.g. "every Tuesday and Thursday at 10 AM"), set recurring to true, list recurringDays (e.g. ["Tuesday", "Thursday"]), and set date to the first upcoming date.
Valid categories are:
- "university" (classes, lectures, labs, office hours, study groups)
- "assignments" (homework, project submissions, essays)
- "personal" (gym, reading, self-care, shopping, routines)
- "social" (dinner with friends, coffee, party, club, celebrations)
- "appointments" (dentist, doctor, advising, interviews)
- "urgent" (exams, midterms, high-priority hard deadlines)

User input:
"${input}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Name of the event or class or task" },
                  category: {
                    type: Type.STRING,
                    description: "One of: university, assignments, personal, social, appointments, urgent",
                  },
                  date: { type: Type.STRING, description: "YYYY-MM-DD formatted date" },
                  startTime: { type: Type.STRING, description: "HH:mm format 24h e.g. 08:00, 14:30" },
                  endTime: { type: Type.STRING, description: "HH:mm format 24h e.g. 09:30, 16:00 (optional)" },
                  location: { type: Type.STRING, description: "Location, room, or café if mentioned" },
                  notes: { type: Type.STRING, description: "Additional details or instructor name" },
                  priority: { type: Type.STRING, description: "low, medium, high" },
                  recurring: { type: Type.BOOLEAN, description: "Whether this repeats" },
                  recurringDays: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of day names like ['Monday', 'Wednesday']",
                  },
                  isTask: { type: Type.BOOLEAN, description: "True if it is a task/deadline to complete" },
                  instructor: { type: Type.STRING, description: "Course instructor name if university class" },
                  room: { type: Type.STRING, description: "Classroom number or code" },
                },
                required: ["title", "category", "date", "startTime"],
              },
            },
          },
          required: ["items"],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{"items":[]}');
    res.json(parsedJson);
  } catch (err: unknown) {
    console.error("AI Event parsing error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to parse schedule items",
      fallback: true,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
