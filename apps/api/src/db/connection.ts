import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  await mongoose.connect(uri, { dbName: "vedaai" });
  isConnected = true;
  console.log("[db] MongoDB connected");

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("[db] MongoDB disconnected — will reconnect on next call");
  });
}
