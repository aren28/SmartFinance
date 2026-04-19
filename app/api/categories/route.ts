import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/errorHandler";
import { CreateCategoryInput, UpdateCategoryInput } from "@/types";

// GET /api/categories - カテゴリ一覧取得
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { expenses: true } } },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories - カテゴリ作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon } = body as CreateCategoryInput;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "name は必須の文字列パラメータです" },
        { status: 400 }
      );
    }

    const duplicate = await prisma.category.findUnique({
      where: { name: name.trim() },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "同じ名前のカテゴリが既に存在します" },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        ...(color && { color }),
        ...(icon && { icon }),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/categories?id=<id> - カテゴリ更新
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "クエリパラメータ id が必要です" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, color, icon } = body as UpdateCategoryInput;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name: name.trim() }),
        ...(color && { color }),
        ...(icon && { icon }),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/categories?id=<id> - カテゴリ削除（支出がある場合は Restrict）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "クエリパラメータ id が必要です" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
