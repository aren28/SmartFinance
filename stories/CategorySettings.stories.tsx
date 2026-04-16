import type { Meta, StoryObj } from '@storybook/react'

// CategorySettingsはAPIに依存しているため、表示専用の静的バージョンを作成
type Category = {
  id: number
  name: string
  color: string
  icon: string
  expenseCount: number
}

const CategorySettingsDisplay = ({
  categories,
  loading,
  error,
}: {
  categories: Category[]
  loading?: boolean
  error?: string | null
}) => {
  if (loading) {
    return <p className="text-sm text-gray-400">読み込み中…</p>
  }

  return (
    <div className="space-y-4">
      <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="新しいカテゴリ名"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          追加
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <ul className="divide-y divide-gray-100">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span>
              {cat.icon} {cat.name}{' '}
              <span className="text-gray-400">({cat.expenseCount}件)</span>
            </span>
            <button
              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
              disabled={cat.expenseCount > 0}
              title={cat.expenseCount > 0 ? '支出があるため削除不可' : '削除'}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const meta: Meta<typeof CategorySettingsDisplay> = {
  title: 'Components/CategorySettings',
  component: CategorySettingsDisplay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CategorySettingsDisplay>

const sampleCategories: Category[] = [
  { id: 1, name: '食費', color: '#4F46E5', icon: '🍜', expenseCount: 12 },
  { id: 2, name: '交通費', color: '#059669', icon: '🚃', expenseCount: 5 },
  { id: 3, name: '書籍・教育', color: '#7C3AED', icon: '📚', expenseCount: 0 },
  { id: 4, name: '娯楽', color: '#D97706', icon: '🎮', expenseCount: 3 },
]

export const WithCategories: Story = {
  args: {
    categories: sampleCategories,
    loading: false,
    error: null,
  },
}

export const Loading: Story = {
  args: {
    categories: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    categories: [],
    loading: false,
    error: null,
  },
}

export const WithError: Story = {
  args: {
    categories: sampleCategories,
    loading: false,
    error: 'このカテゴリには3件の支出があるため削除できません',
  },
}

export const AllDeletable: Story = {
  args: {
    categories: sampleCategories.map((cat) => ({ ...cat, expenseCount: 0 })),
    loading: false,
    error: null,
  },
}
