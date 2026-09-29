import mongoose from "mongoose";

// Connects to MongoDB once, when the server starts. Call this from
// server.ts before the server starts accepting requests.
export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and fill it in.",
    );
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
