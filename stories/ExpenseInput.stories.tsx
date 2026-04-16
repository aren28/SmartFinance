import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import ExpenseInput from '../components/ExpenseInput'

const meta: Meta<typeof ExpenseInput> = {
  title: 'Components/ExpenseInput',
  component: ExpenseInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onExpenseAdded: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ExpenseInput>

export const Default: Story = {}

export const WithLongPlaceholder: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
}
