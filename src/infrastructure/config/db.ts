import mongoose from "mongoose";

export const mongoConnect = async () => {
  try {
    const MONGO_URL = process.env.MONGODB_URI;
    if (MONGO_URL) {
      const conn = await mongoose.connect(MONGO_URL);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    }
  } catch (error) {
    const err: Error = error as Error;
    console.log(`Error is ${err.message}`);
    process.exit(1);
  }
};
