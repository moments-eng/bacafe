import connectDB from "@/lib/db/mongoose";

export function withDb<T extends (...args: any[]) => Promise<any>>(
  action: T
): T {
  return (async (...args: Parameters<T>) => {
    await connectDB();
    return action(...args);
  }) as T;
}
