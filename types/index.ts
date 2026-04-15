export type Category = {
  id: number;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: number;
  amount: number;
  description: string;
  rawText: string;
  date: string;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type CreateExpenseInput = {
  rawText: string;
};

export type CreateCategoryInput = {
  name: string;
  color?: string;
  icon?: string;
};

export type UpdateCategoryInput = {
  name?: string;
  color?: string;
  icon?: string;
};

export type ParsedExpense = {
  amount: number;
  description: string;
  categoryName: string;
  date: string;
};

export type AdviceResponse = {
  advice: string;
  totalAmount: number;
  topCategory: string;
};

export type ApiError = {
  error: string;
  details?: string;
};
