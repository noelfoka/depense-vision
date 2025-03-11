export type Budget = {
  id: string;
  name: string;
  amount: number;
  createdAt: Date;
  emoji: string | null;
  transactions: Transaction[];
}

export type Transaction = {
  id?: string;
  amount: number;
  emoji: string | null;
  description: string;
  budgetName?: string;
  budgetId?: string | null;
  createdAt: Date;
}

