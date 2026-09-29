import type { Request, Response } from "express";
import { getChatReply } from "../services/geminiService.js";

// POST /api/chat — the endpoint your "Chat with Us" button on the
// homepage will eventually call. Body: { message: "aap ka menu kya hai" }
export async function chat(req: Request, res: Response) {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const reply = await getChatReply(message);
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Something went wrong generating a reply. Check your GEMINI_API_KEY.",
    });
  }
}
