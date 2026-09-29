import type { Request, Response } from "express";
import { sendWhatsAppMessage } from "../services/whatsappService.js";
import { getChatReply } from "../services/geminiService.js";

// GET /api/whatsapp/webhook — Meta calls this once, when you first
// connect your webhook URL in the Meta developer dashboard, to prove
// you control this server. It just echoes back a challenge value.
export function verifyWebhook(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

// POST /api/whatsapp/webhook — Meta calls this every time a customer
// sends your WhatsApp business number a message. This wires the same
// chatbot used on the website into WhatsApp itself.
export async function handleIncomingMessage(req: Request, res: Response) {
  // Respond to Meta immediately — it expects a fast 200 and will retry
  // if you don't acknowledge quickly, which could cause duplicate replies.
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message || message.type !== "text") return;

    const from = message.from; // customer's phone number
    const text = message.text.body;

    const reply = await getChatReply(text);
    await sendWhatsAppMessage(from, reply);
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
  }
}
