import mongoose from "mongoose";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached = global.mongooseCache = {
      conn: null,
      promise: mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose),
    };
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached = global.mongooseCache = { conn: null, promise: null };
    throw e;
  }

  return cached.conn as typeof mongoose;
}

export default connectDB;
