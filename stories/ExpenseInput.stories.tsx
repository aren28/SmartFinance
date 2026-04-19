import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import ExpenseInput from '../components/ExpenseInput'

const sampleCategories = [
  { id: 1, name: '食費', color: '#4F46E5', icon: '🍜', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: '交通費', color: '#059669', icon: '🚃', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 3, name: '書籍・教育', color: '#7C3AED', icon: '📚', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

const meta: Meta<typeof ExpenseInput> = {
  title: 'Components/ExpenseInput',
  component: ExpenseInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    categories: sampleCategories,
    onSubmit: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ExpenseInput>

export const Default: Story = {}

export const NoCategories: Story = {
  args: {
    categories: [],
  },
}

export const ManyCategories: Story = {
  args: {
    categories: [
      ...sampleCategories,
      { id: 4, name: '娯楽', color: '#D97706', icon: '🎮', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      { id: 5, name: '医療', color: '#DC2626', icon: '🏥', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    ],
  },
}
