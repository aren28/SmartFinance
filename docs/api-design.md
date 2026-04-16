# API設計

## エンドポイント一覧

### POST /api/expenses

- リクエスト: `{ rawText: string, categoryId?: string }`
- レスポンス: `Expense`
- AI自動カテゴリ判定: categoryId未指定時

### GET /api/expenses

- クエリ: `month(YYYY-MM)`, `limit(default:20)`, `offset(default:0)`
- レスポンス: `{ expenses: Expense[], total: number }`

### DELETE /api/expenses/:id

- レスポンス: `{ success: true }`

### GET /api/categories

- レスポンス: `{ categories: Category[] }`

### POST /api/categories

- リクエスト: `{ name: string, color: string }`
- レスポンス: `Category`

### PUT /api/categories/:id

- リクエスト: `{ name?: string, color?: string }`
- レスポンス: `Category`

### DELETE /api/categories/:id

- レスポンス: `{ success: true }`
- 制約: 支出が紐づく場合は400エラー

### GET /api/advice

- クエリ: `month(YYYY-MM)`
- レスポンス: `{ advice: string, generatedAt: Date }`
- キャッシュ: 同月は1時間キャッシュ
