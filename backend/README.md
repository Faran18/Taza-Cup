# Taza Cup Backend

Express + MongoDB + Gemini backend: inventory (products & orders),
a Roman-Urdu-capable chatbot, and WhatsApp integration.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```
   (On Windows PowerShell: `copy .env.example .env`)

   You need:
   - **MONGODB_URI** — create a free MongoDB Atlas account, make an
     M0 (free) cluster, and copy its connection string.
   - **GEMINI_API_KEY** — free at https://aistudio.google.com/apikey,
     no credit card required.
   - **WHATSAPP_TOKEN**, **WHATSAPP_PHONE_NUMBER_ID** — from
     developers.facebook.com once you set up a WhatsApp Business app.
     You can skip these until you're ready to wire up WhatsApp; the
     rest of the backend works without them.
   - **WHATSAPP_VERIFY_TOKEN** — you make this up yourself, any random
     string. Meta will send it back to you during webhook setup to
     confirm you control this server.

3. Populate the database with your two current products:
   ```
   npm run seed
   ```

4. Run the server:
   ```
   npm run dev
   ```
   You should see `Server running on http://localhost:4000`.

## What each folder does

- `src/models/` — the shape of your data (Product, Order)
- `src/controllers/` — the actual logic for each action (create a
  product, place an order, chat, etc.)
- `src/routes/` — maps URLs to controllers (e.g. `POST /api/orders`
  calls `createOrder`)
- `src/services/` — talks to external things: Gemini (the chatbot),
  WhatsApp's API
- `src/server.ts` — starts everything up
- `src/seed.ts` — one-time script to add starter data

## API endpoints

| Method | Path | What it does |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | One product |
| POST | `/api/products` | Add a product |
| PATCH | `/api/products/:id` | Update a product (e.g. change stock) |
| DELETE | `/api/products/:id` | Remove a product |
| POST | `/api/orders` | Place an order (reduces stock automatically) |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | One order |
| PATCH | `/api/orders/:id/status` | Update order status |
| POST | `/api/chat` | Send a message, get a chatbot reply |
| GET/POST | `/api/whatsapp/webhook` | WhatsApp Cloud API webhook |

## Testing without a frontend yet

You can test any endpoint right now with `curl` or a tool like
Postman/Insomnia. Example — chat with the bot in Roman Urdu:

```
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"aap ka menu kya hai\"}"
```

Example — place an order (replace the productId with a real one from
`GET /api/products`):

```
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"customerName\": \"Ali\", \"customerPhone\": \"03001234567\", \"items\": [{\"productId\": \"<paste id here>\", \"quantity\": 2}]}"
```

## Important before going live

- **The product/order endpoints have no authentication yet.** Right
  now, anyone who finds your API URL could add/delete products or
  place fake orders. Before deploying publicly, these admin actions
  (POST/PATCH/DELETE on products) need to be protected — e.g. a
  simple admin password check, or a proper auth system. Ask me to add
  this when you're ready; it's a deliberate gap for now, not an
  oversight.
- **WhatsApp Cloud API setup** (getting your token and phone number
  ID) happens on Meta's developer site and involves a few manual
  steps outside this codebase — happy to walk through that separately
  once you're at that stage.
- **CORS**: `FRONTEND_URL` in `.env` controls which website is allowed
  to call this backend. Keep it as `http://localhost:3000` while
  developing; update it to your real deployed frontend URL later.

## Deployment

This backend needs to run as a **persistent process** (not a
serverless function), because of the WhatsApp webhook and the
long-running Express server pattern. Render or Railway (free tiers)
both work — deploy this `backend/` folder as its own service, set the
same environment variables from `.env` in their dashboard, and point
your `FRONTEND_URL` at your deployed Next.js site.
