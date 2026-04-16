# アーキテクチャ設計

## 概要

AI家計簿アプリ。自然言語テキストをClaudeで解析し、支出を自動カテゴライズする。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 16.2.3 (App Router) + TypeScript |
| スタイリング | Tailwind CSS |
| データベース | PostgreSQL (Prisma ORM) |
| AI | Claude Haiku (Anthropic SDK) |
| ランタイム | Node.js 18 |

## ディレクトリ構成

```
ai-kakeibo/
├── app/
│   ├── page.tsx               # ルートページ（クライアントコンポーネント）
│   └── api/
│       ├── expenses/route.ts  # 支出CRUD
│       ├── categories/route.ts# カテゴリCRUD
│       └── advice/route.ts    # AIアドバイス生成
├── components/
│   ├── AdviceBanner.tsx       # アドバイス表示バナー
│   ├── ExpenseInput.tsx       # 自然言語入力フォーム
│   ├── ExpenseList.tsx        # 支出一覧
│   └── CategorySettings.tsx  # カテゴリ管理UI
├── lib/
│   ├── db.ts                  # Prismaシングルトン
│   ├── ai.ts                  # Claude API呼び出し
│   └── errorHandler.ts        # 統一エラーハンドリング
├── hooks/
│   └── useAdvice.ts           # アドバイス取得カスタムフック
├── types/
│   └── index.ts               # 共有型定義
└── prisma/
    └── schema.prisma          # DBスキーマ
```

## データフロー

```
ユーザー入力テキスト
    ↓
POST /api/expenses
    ↓
lib/ai.ts → parseExpenseText() → Claude Haiku
    ↓
ParsedExpense { amount, description, categoryName, date }
    ↓
Prisma: Category.upsert + Expense.create
    ↓
レスポンス (Expense with Category)
    ↓
フロントエンド state 更新
```

## 設計方針

- **amount は Int（円単位）**: 小数点なし。¥150.5 などは四捨五入
- **rawText 保持**: AI解析失敗時に再解析・デバッグに使用
- **カテゴリ削除 Restrict**: 支出が紐づく場合は削除不可（データ整合性）
- **カテゴリ自動生成**: 未知カテゴリは upsert で自動作成
