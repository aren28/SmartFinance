import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseExpenseText } from "@/lib/ai";
import { handleApiError } from "@/lib/errorHandler";

// GET /api/expenses - 支出一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const where: {
      date?: {
        gte?: Date;
        lt?: Date;
      };
    } = {};

    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month);
      where.date = {
        gte: new Date(y, m - 1, 1),
        lt: new Date(y, m, 1),
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/expenses - 自然言語から支出を登録
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawText } = body as { rawText: string };

    if (!rawText || typeof rawText !== "string" || rawText.trim() === "") {
      return NextResponse.json(
        { error: "rawText は必須の文字列パラメータです" },
        { status: 400 }
      );
    }

    // AI解析
    const parsed = await parseExpenseText(rawText.trim());

    // カテゴリをupsert（存在しなければ作成）
    const category = await prisma.category.upsert({
      where: { name: parsed.categoryName },
      update: {},
      create: { name: parsed.categoryName },
    });

    const expense = await prisma.expense.create({
      data: {
        amount: parsed.amount,
        description: parsed.description,
        rawText: rawText.trim(),
        date: new Date(parsed.date),
        categoryId: category.id,
      },
      include: { category: true },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
