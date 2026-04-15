import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAdvice } from "@/lib/ai";
import { handleApiError } from "@/lib/errorHandler";

// GET /api/advice?year=YYYY&month=M - 支出分析アドバイスを返す
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") ?? new Date().getFullYear().toString();
    const month = searchParams.get("month") ?? (new Date().getMonth() + 1).toString();

    const y = parseInt(year);
    const m = parseInt(month);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      return NextResponse.json(
        { error: "year・month のフォーマットが不正です" },
        { status: 400 }
      );
    }

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: new Date(y, m - 1, 1),
          lt: new Date(y, m, 1),
        },
      },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    // カテゴリ別集計
    const byCategoryMap = new Map<string, number>();
    for (const e of expenses) {
      const prev = byCategoryMap.get(e.category.name) ?? 0;
      byCategoryMap.set(e.category.name, prev + e.amount);
    }
    const topCategory =
      [...byCategoryMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "なし";

    const period = `${y}年${m}月`;
    const adviceInput = expenses.map((e) => ({
      amount: e.amount,
      description: e.description,
      categoryName: e.category.name,
    }));

    const advice = await generateAdvice(adviceInput, period);

    return NextResponse.json({ advice, totalAmount, topCategory });
  } catch (error) {
    return handleApiError(error);
  }
}
