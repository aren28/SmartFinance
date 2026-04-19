import { ParsedExpense } from "@/types";

// ── 本番AIコード（全作業完了後に有効化）─────────────────────────────
// import Anthropic from "@anthropic-ai/sdk";
//
// const client = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });
//
// export async function parseExpenseText(
//   rawText: string,
//   categoryNames: string[] = []
// ): Promise<ParsedExpense> {
//   const today = new Date().toISOString().split("T")[0];
//   const categoryList =
//     categoryNames.length > 0
//       ? categoryNames.join("/")
//       : "食費/交通費/娯楽費/日用品/医療費/その他";
//   const message = await client.messages.create({
//     model: "claude-haiku-4-5-20251001",
//     max_tokens: 1000,
//     system: "あなたは家計簿アシスタントです。ユーザーの支出テキストを解析し、JSONのみを返してください。",
//     messages: [{ role: "user", content: `テキスト: "${rawText}"\n今日: ${today}\nカテゴリ: ${categoryList}` }],
//   });
//   const text = message.content[0].type === "text" ? message.content[0].text : "";
//   const jsonMatch = text.match(/\{[\s\S]*\}/);
//   if (!jsonMatch) throw new Error("AI response did not contain valid JSON");
//   return JSON.parse(jsonMatch[0]) as ParsedExpense;
// }
//
// export async function generateAdvice(
//   expenses: { amount: number; description: string; categoryName: string }[],
//   period: string = "今月"
// ): Promise<string> {
//   if (expenses.length === 0) return "まだ支出データがありません。";
//   const total = expenses.reduce((sum, e) => sum + e.amount, 0);
//   const summary = expenses.map((e) => `${e.categoryName}: ${e.amount}円`).join("\n");
//   const message = await client.messages.create({
//     model: "claude-haiku-4-5-20251001",
//     max_tokens: 512,
//     messages: [{ role: "user", content: `${period}の支出: 合計${total}円\n${summary}\n100〜150文字でアドバイスをください。` }],
//   });
//   return message.content[0].type === "text" ? message.content[0].text : "アドバイスを生成できませんでした。";
// }
// ────────────────────────────────────────────────────────────────────

// ── モック実装（開発・テスト用）──────────────────────────────────────

export async function parseExpenseText(
  rawText: string,
  categoryNames: string[] = []
): Promise<ParsedExpense> {
  const amountMatch = rawText.match(/(\d[\d,]*)/);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 500;

  const today = new Date().toISOString().split("T")[0];

  const defaultCategory =
    categoryNames.length > 0 ? categoryNames[0] : "その他";

  return {
    amount,
    description: rawText.replace(/\d[\d,]*円?/, "").trim() || rawText,
    categoryName: defaultCategory,
    date: today,
  };
}

export async function generateAdvice(
  expenses: { amount: number; description: string; categoryName: string }[],
  _period: string = "今月"
): Promise<string> {
  if (expenses.length === 0) {
    return "まだ支出データがありません。支出を記録してアドバイスを受け取りましょう！";
  }
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return `今月の支出合計は${total.toLocaleString()}円です。引き続き記録を続けて、支出の傾向を把握しましょう。（※これはモックアドバイスです）`;
}
