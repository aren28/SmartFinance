import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseExpenseText } from "@/lib/ai";
import { handleApiError } from "@/lib/errorHandler";

// GET /api/expenses - 支出一覧取得
// クエリ: month(YYYY-MM), limit(default:20), offset(default:0)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const where: {
      date?: {
        gte?: Date;
        lt?: Date;
      };
    } = {};

    if (month) {
      const [y, m] = month.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        where.date = {
          gte: new Date(y, m - 1, 1),
          lt: new Date(y, m, 1),
        };
      }
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      expenses,
      total: total._sum.amount ?? 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/expenses - 自然言語から支出を登録
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawText, categoryId } = body as {
      rawText: string;
      categoryId?: string;
    };

    if (!rawText || typeof rawText !== "string" || rawText.trim() === "") {
      return NextResponse.json(
        { error: "rawText は必須の文字列パラメータです" },
        { status: 400 }
      );
    }

    // カテゴリ一覧を取得してAIに渡す
    const existingCategories = await prisma.category.findMany({
      select: { id: true, name: true },
    });
    const categoryNames = existingCategories.map((c) => c.name);

    // AI解析
    const parsed = await parseExpenseText(rawText.trim(), categoryNames);

    let category;
    if (categoryId) {
      // categoryIdが指定されている場合はそのカテゴリを使用
      const catId = parseInt(categoryId);
      category = await prisma.category.findUnique({ where: { id: catId } });
      if (!category) {
        return NextResponse.json(
          { error: "指定されたカテゴリが見つかりません" },
          { status: 404 }
        );
      }
    } else {
      // AIが解析したcategoryNameでupsert
      category = await prisma.category.upsert({
        where: { name: parsed.categoryName },
        update: {},
        create: { name: parsed.categoryName },
      });
    }

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

    return NextResponse.json({ expense, category }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
