import { NextRequest, NextResponse } from "next/server";
import Logger from "../../../logger/logger";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  Logger.getInstance().info("Delete user info deletion request received", {
    body,
  });
  return NextResponse.json({
    message: "User information is scheduled to delete",
  });
};
