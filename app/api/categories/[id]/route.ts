import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/errorHandler";
import { UpdateCategoryInput } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "有効なIDを指定してください" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "指定されたカテゴリが見つかりません" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, color, icon } = body as UpdateCategoryInput;

    const category = await prisma.category.update({
      where: { id: categoryId },
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "有効なIDを指定してください" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { expenses: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "指定されたカテゴリが見つかりません" },
        { status: 404 }
      );
    }

    if (existing._count.expenses > 0) {
      return NextResponse.json(
        { error: "このカテゴリには支出が紐づいているため削除できません" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: categoryId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
