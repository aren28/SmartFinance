import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/errorHandler";

// DELETE /api/expenses/[id] - 指定IDの支出を削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenseId = parseInt(id);

    if (isNaN(expenseId)) {
      return NextResponse.json(
        { error: "有効なIDを指定してください" },
        { status: 400 }
      );
    }

    const existing = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "指定された支出が見つかりません" },
        { status: 404 }
      );
    }

    await prisma.expense.delete({ where: { id: expenseId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
