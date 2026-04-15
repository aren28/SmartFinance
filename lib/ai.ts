import Anthropic from "@anthropic-ai/sdk";
import { ParsedExpense } from "@/types";

const client = new Anthropic();

/**
 * 自然言語テキストから支出情報を解析する
 * 例: "スタバで500円" → { amount: 500, description: "スタバ", categoryName: "食費", date: "..." }
 */
export async function parseExpenseText(
  rawText: string
): Promise<ParsedExpense> {
  const today = new Date().toISOString().split("T")[0];

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `以下の支出テキストを解析してJSON形式で返してください。

テキスト: "${rawText}"
今日の日付: ${today}

返却フォーマット（JSONのみ、説明不要）:
{
  "amount": <金額（整数、円単位）>,
  "description": <支出の説明>,
  "categoryName": <カテゴリ名（食費/交通費/娯楽費/日用品/医療費/その他 のいずれか）>,
  "date": <日付 YYYY-MM-DD形式>
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // JSONブロックを抽出
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as ParsedExpense;

  if (
    typeof parsed.amount !== "number" ||
    !parsed.description ||
    !parsed.categoryName ||
    !parsed.date
  ) {
    throw new Error("AI response missing required fields");
  }

  return parsed;
}

/**
 * 直近の支出一覧からアドバイスを生成する
 */
export async function generateAdvice(
  expenses: { amount: number; description: string; categoryName: string }[],
  period: string = "今月"
): Promise<string> {
  if (expenses.length === 0) {
    return "まだ支出データがありません。支出を記録してアドバイスを受け取りましょう！";
  }

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const summary = expenses
    .map((e) => `${e.categoryName}: ${e.amount}円 (${e.description})`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `${period}の支出データです。家計改善のアドバイスを日本語で100〜150文字で返してください。

合計: ${totalAmount}円
内訳:
${summary}

アドバイスのみ返してください（箇条書き・見出し不要）。`,
      },
    ],
  });

  return message.content[0].type === "text"
    ? message.content[0].text
    : "アドバイスを生成できませんでした。";
}
