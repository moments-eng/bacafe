import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  console.log("Delete user info deletion request received", body);
  return NextResponse.json({
    message: "User information is scheduled to delete",
  });
};
