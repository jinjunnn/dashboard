import { NextRequest, NextResponse } from "next/server";
import { universalSearch } from "@/lib/services/search-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "搜索关键词不能为空" }, { status: 400 });
    }

    const results = await universalSearch(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error("搜索API错误:", error);
    return NextResponse.json(
      {
        error: "搜索失败",
        details: error instanceof Error ? error.message : "未知错误",
        stocks: [],
        signals: [],
      },
      { status: 500 },
    );
  }
}
