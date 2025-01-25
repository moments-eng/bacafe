import { NextRequest, NextResponse } from "next/server";
import { backendApi } from "@/lib/http-clients/backend/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  try {
    const { data, error } = await backendApi.POST("/articles/query", {
      body: {
        filter: {
          title: query,
        },
        page: 1,
        limit: 10,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch articles" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.items);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
