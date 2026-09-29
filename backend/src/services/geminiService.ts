import { GoogleGenerativeAI } from "@google/generative-ai";
import { Product } from "../models/Product.js";

// Lazily created so a missing API key only fails when the chatbot is
// actually used, not when the server starts.
let genAI: GoogleGenerativeAI | null = null;

function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Copy .env.example to .env and add a free key from https://aistudio.google.com/apikey",
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// This is the "grounding" step: instead of letting the model guess at
// what's on the menu, we pull the real, current product list from the
// database and hand it to the model as context. This is a simple form
// of RAG — retrieval (the database query) feeding generation (Gemini).
async function buildMenuContext(): Promise<string> {
  const products = await Product.find({ isAvailable: true });

  if (products.length === 0) {
    return "There are currently no products listed.";
  }

  return products
    .map((p) => {
      const stockNote = p.stock > 0 ? `${p.stock} in stock` : "out of stock";
      const minNote = p.minQuantity > 1 ? `, minimum order ${p.minQuantity}` : "";
      return `- ${p.name}: Rs. ${p.price} — ${p.description || "No description yet"} (${stockNote}${minNote})`;
    })
    .join("\n");
}

const SYSTEM_INSTRUCTIONS = `You are the friendly customer assistant for Taza Cup, a fresh fruit cup business.
Customers will often write in Roman Urdu (Urdu written using English letters, e.g. "aap ka menu kya hai"). 
Reply in the same style the customer used — if they write in Roman Urdu, reply in Roman Urdu; 
if they write in English, reply in English.

Only answer using the menu information provided below. If asked about something not on the 
menu, say it's not currently available rather than guessing. Keep replies short and 
conversational, like a real chat message, not a formal document.

Every order is home delivery, and every order needs at least 3 cups total combined across 
whatever the customer picks. Some items (marked "minimum order" below) also have their own 
higher per-item minimum on top of that.

Current menu:
{{MENU}}`;

export async function getChatReply(userMessage: string): Promise<string> {
  const client = getClient();
  const menu = await buildMenuContext();

  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_INSTRUCTIONS.replace("{{MENU}}", menu),
  });

  const result = await model.generateContent(userMessage);
  return result.response.text();
}
