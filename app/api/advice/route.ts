import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAdvice } from "@/lib/ai";
import { handleApiError } from "@/lib/errorHandler";

export const revalidate = 3600;

// GET /api/advice?month=YYYY-MM - 支出分析アドバイスを返す
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const month = searchParams.get("month") ?? defaultMonth;

    const parts = month.split("-");
    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]);

    if (parts.length !== 2 || isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      return NextResponse.json(
        { error: "month は YYYY-MM 形式で指定してください" },
        { status: 400 }
      );
    }

    const rows = await prisma.expense.findMany({
      where: {
        date: {
          gte: new Date(y, m - 1, 1),
          lt: new Date(y, m, 1),
        },
      },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    const expenses = rows.map((e) => ({
      ...e,
      date: e.date.toISOString().split("T")[0],
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      category: {
        ...e.category,
        createdAt: e.category.createdAt.toISOString(),
        updatedAt: e.category.updatedAt.toISOString(),
      },
    }));

    const advice = await generateAdvice(expenses, month);

    return NextResponse.json({
      advice,
      generatedAt: new Date().toISOString(),
      month,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
