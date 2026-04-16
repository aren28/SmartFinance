import type { Meta, StoryObj } from '@storybook/react'
import ExpenseList from '../components/ExpenseList'
import type { Expense } from '../types'

const sampleCategory = {
  id: 1,
  name: '食費',
  color: '#4F46E5',
  icon: '🍜',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const sampleExpenses: Expense[] = [
  {
    id: 1,
    amount: 850,
    description: 'スターバックス ラテ',
    rawText: 'スタバで850円',
    date: '2024-04-15T10:00:00Z',
    categoryId: 1,
    category: { ...sampleCategory, name: '食費', icon: '☕' },
    createdAt: '2024-04-15T10:00:00Z',
    updatedAt: '2024-04-15T10:00:00Z',
  },
  {
    id: 2,
    amount: 210,
    description: '電車代（渋谷→新宿）',
    rawText: '電車代210円',
    date: '2024-04-15T09:00:00Z',
    categoryId: 2,
    category: {
      id: 2,
      name: '交通費',
      color: '#059669',
      icon: '🚃',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    createdAt: '2024-04-15T09:00:00Z',
    updatedAt: '2024-04-15T09:00:00Z',
  },
  {
    id: 3,
    amount: 3200,
    description: '居酒屋ランチ',
    rawText: '居酒屋で3200円',
    date: '2024-04-14T12:30:00Z',
    categoryId: 1,
    category: { ...sampleCategory },
    createdAt: '2024-04-14T12:30:00Z',
    updatedAt: '2024-04-14T12:30:00Z',
  },
]

const meta: Meta<typeof ExpenseList> = {
  title: 'Components/ExpenseList',
  component: ExpenseList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ExpenseList>

export const WithExpenses: Story = {
  args: {
    expenses: sampleExpenses,
  },
}

export const Empty: Story = {
  args: {
    expenses: [],
  },
}

export const SingleExpense: Story = {
  args: {
    expenses: [sampleExpenses[0]],
  },
}

export const ManyExpenses: Story = {
  args: {
    expenses: [
      ...sampleExpenses,
      {
        id: 4,
        amount: 500,
        description: 'コンビニ おにぎりとお茶',
        rawText: 'コンビニ500円',
        date: '2024-04-13T13:00:00Z',
        categoryId: 1,
        category: { ...sampleCategory, icon: '🏪' },
        createdAt: '2024-04-13T13:00:00Z',
        updatedAt: '2024-04-13T13:00:00Z',
      },
      {
        id: 5,
        amount: 1500,
        description: '本屋（技術書）',
        rawText: '本屋で1500円',
        date: '2024-04-12T15:00:00Z',
        categoryId: 3,
        category: {
          id: 3,
          name: '書籍・教育',
          color: '#7C3AED',
          icon: '📚',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        createdAt: '2024-04-12T15:00:00Z',
        updatedAt: '2024-04-12T15:00:00Z',
      },
    ],
  },
}
