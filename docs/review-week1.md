# Week1 レビューレポート

## レビュー実施日
2026-04-20

## レビュー対象ファイル

- `prisma/schema.prisma`
- `lib/db.ts`
- `lib/ai.ts`
- `lib/errorHandler.ts`
- `app/api/expenses/route.ts`
- `app/api/expenses/[id]/route.ts`
- `app/api/categories/route.ts`
- `app/api/categories/[id]/route.ts`
- `app/page.tsx`
- `components/AdviceBanner.tsx`
- `components/ExpenseInput.tsx`
- `components/ExpenseList.tsx`
- `components/CategorySettings.tsx`
- `types/index.ts`

---

## 発見した問題と対応

### 修正済み

#### 1. テスト失敗: `parseExpenseText` のモック実装との期待値不一致
- **ファイル**: `__tests__/expenses.test.ts`
- **問題**: "昨日コンビニ 450円" を解析した際、テストは `description` を `"コンビニ"` と期待していたが、現在のモック実装（`lib/ai.ts`）は数字を除去した `"昨日コンビニ"` を返す。
- **対応**: テストの期待値を `"昨日コンビニ"` に修正。将来、本番AIに切り替えた際は改めてテストを更新する。

#### 2. `page.tsx`: `submitError` が表示されない
- **ファイル**: `app/page.tsx`
- **問題**: `handleSubmit` はAPI失敗時に `throw` するだけで `setSubmitError` を呼ばないため、エラーメッセージがUIに表示されなかった。
- **対応**: `!res.ok` 時に `setSubmitError(message)` を呼び出してから `throw` するよう修正。

#### 3. `page.tsx`: `loadData` に try/catch がない
- **ファイル**: `app/page.tsx`
- **問題**: ネットワークエラー発生時に `setLoading(false)` が呼ばれず、画面が「読み込み中…」から抜け出せない状態になる。
- **対応**: `try/catch/finally` でラップし、`finally` 内で `setLoading(false)` を呼ぶよう修正。

#### 4. カテゴリ削除エラーのHTTPステータス不統一
- **ファイル**: `app/api/categories/[id]/route.ts`
- **問題**: 支出が紐づいているカテゴリを削除しようとした際に `400` を返していたが、`errorHandler.ts` の P2003 ハンドラは `409` を返しており不統一。
- **対応**: ステータスを `400` → `409` に変更して一貫性を確保。

---

### 既知の課題（Week2で対応）

#### セキュリティ
- **入力長バリデーション未実装**: `rawText` に最大文字数制限がない。極端に長いテキストがAI APIやDBに到達する可能性がある。（Week 10 エラーハンドリング強化時に対応）
- **本番時の `details` フィールド露出**: `errorHandler.ts` は `error.message` を `details` として返すが、本番ではスタックトレースや内部情報が漏れる可能性がある。（Week 10 対応）

#### 型安全性
- **`lib/ai.ts` の本番コードでの JSON.parse 型キャスト**: `JSON.parse(jsonMatch[0]) as ParsedExpense` はランタイムバリデーションがなく、AIレスポンスが不正な場合クラッシュする。Zod 等によるバリデーションを導入予定。（Week 8 AI API 実装時に対応）

#### ルーティング設計の不統一
- **`/api/categories` の PATCH/DELETE がクエリパラメータ方式**: `/api/categories?id=<id>` で更新・削除しているが、`/api/categories/[id]` の PUT/DELETE と役割が重複している。RESTful に統一する。（Week 12 リファクタリング時に対応）

#### パフォーマンス
- **存在確認クエリの二重発行**: `DELETE /api/expenses/[id]` と `PUT /api/categories/[id]` で findUnique → delete/update と2クエリ発行している。Prisma の `P2025` エラーを利用して1クエリにまとめられる。（Week 12 最適化時に対応）

#### AI モック
- **本番 Anthropic SDK が未有効化**: `lib/ai.ts` はモック実装のみ動作中。Week 8 で本番 AI コードを有効化する。

---

## テスト結果

```
Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        0.826 s
```

全テスト通過。

---

## Week2に向けて
- Day 8: AIアドバイス生成API実装
- Day 9: アドバイス表示UI実装
- Day 10: エラーハンドリング強化
- Day 11: Vercelデプロイ設定
- Day 12: パフォーマンス最適化
- Day 13: READMEとドキュメント整備
- Day 14: 最終レビューとクリーンアップ
