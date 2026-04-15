import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function handleApiError(error: unknown): NextResponse {
  console.error("[API Error]", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // 外部キー制約違反（カテゴリ削除時に支出が残っている）
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "このカテゴリには支出が紐づいているため削除できません" },
        { status: 409 }
      );
    }
    // ユニーク制約違反
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "同じ名前のカテゴリが既に存在します" },
        { status: 409 }
      );
    }
    // レコード未発見
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "指定されたリソースが見つかりません" },
        { status: 404 }
      );
    }
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "リクエストボディのJSON形式が不正です" },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: "内部エラーが発生しました", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "予期しないエラーが発生しました" }, { status: 500 });
}
