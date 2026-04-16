import type { Meta, StoryObj } from '@storybook/react'

// AdviceBannerの表示専用バージョン（Storybook用）
const AdviceBannerDisplay = ({
  advice,
  totalAmount,
  topCategory,
  state,
}: {
  advice?: string
  totalAmount?: number
  topCategory?: string
  state: 'loading' | 'error' | 'success'
}) => {
  if (state === 'loading') {
    return (
      <div className="rounded-lg bg-indigo-50 p-4 animate-pulse">
        <div className="h-4 bg-indigo-200 rounded w-3/4" />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
        AIアドバイスの取得に失敗しました
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 space-y-1">
      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
        今月のアドバイス
      </p>
      <p className="text-sm text-indigo-900">{advice}</p>
      <div className="flex gap-4 pt-1 text-xs text-indigo-600">
        <span>合計: {totalAmount?.toLocaleString()}円</span>
        <span>最多カテゴリ: {topCategory}</span>
      </div>
    </div>
  )
}

const meta: Meta<typeof AdviceBannerDisplay> = {
  title: 'Components/AdviceBanner',
  component: AdviceBannerDisplay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'radio',
      options: ['loading', 'error', 'success'],
    },
  },
}

export default meta
type Story = StoryObj<typeof AdviceBannerDisplay>

export const Default: Story = {
  args: {
    state: 'success',
    advice: '今月は食費が先月より15%増加しています。外食を週2回に減らすと約3,000円節約できます。',
    totalAmount: 42500,
    topCategory: '食費',
  },
}

export const Loading: Story = {
  args: {
    state: 'loading',
  },
}

export const Error: Story = {
  args: {
    state: 'error',
  },
}

export const LongAdvice: Story = {
  args: {
    state: 'success',
    advice: '今月の支出を分析しました。交通費と食費が全体の65%を占めています。定期券の購入や自炊を増やすことで、来月は10,000円以上の節約が期待できます。まずは週に3回自炊することを目標にしてみましょう。',
    totalAmount: 85200,
    topCategory: '交通費',
  },
}
