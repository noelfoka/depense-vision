"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
  getBudgetUserData,
  getLastBudgets,
  getLastTransactions,
  getReachedBudgets,
  getTotalTransactionAmount,
  getTotalTransactionCount,
} from "../actions";
import Wrapper from "../components/Wrapper";
import { CircleDollarSign, Landmark, PiggyBank } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Budget, Transaction } from "@/type";
import Link from "next/link";
import BudgetItem from "../components/BudgetItem";
import TransactionItem from "../components/TransactionItem";

const Page = () => {
  const { user } = useUser();
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [reachedBudget, setReachedBudget] = useState<string | null>(null);
  const [budgetData, setBudgetData] = useState<unknown[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress;

      if (email) {
        const amount = await getTotalTransactionAmount(email as string);
        const count = await getTotalTransactionCount(email);
        const reachedBudgets = await getReachedBudgets(email);
        const budgetsData = await getBudgetUserData(email);
        const lastTransactions = await getLastTransactions(email);
        const lastBudget = await getLastBudgets(email);

        setTotalAmount(amount);
        setTotalCount(count);
        setReachedBudget(reachedBudgets);
        setBudgetData(budgetsData);
        setTransactions(lastTransactions);
        setBudgets(lastBudget);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la recuperation des données", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <Wrapper>
      {isLoading ? (
        <div className="flex w-full flex-col gap-4 justify-center items-center">
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-96"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-96"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-96"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      ) : (
        <div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Total des transactions
                </span>
                <span className="text-2xl font-bold text-accent">
                  {totalAmount !== null ? `${totalAmount} FCFA` : "N/A"}
                </span>
              </div>

              <CircleDollarSign className="bg-accent w-9 h-9 rounded-full p-1 text-white" />
            </div>

            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Nombre des transactions
                </span>
                <span className="text-2xl font-bold text-accent">
                  {totalCount !== null ? `${totalCount}` : "N/A"}
                </span>
              </div>

              <PiggyBank className="bg-accent w-9 h-9 rounded-full p-1 text-white" />
            </div>

            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Budgets atteints</span>
                <span className="text-2xl font-bold text-accent">
                  {reachedBudget || "N/A"}
                </span>
              </div>

              <Landmark className="bg-accent w-9 h-9 rounded-full p-1 text-white" />
            </div>
          </div>

          <div className="w-full md:flex mt-4">
            <div className="rounded-xl md:w-2/3">
              <div className="border border-base-200 p-5 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">
                  Statistiques en (FCFA)
                </h3>

                <ResponsiveContainer height={250} width="100%">
                  <BarChart width={730} height={250} data={budgetData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="budgetName" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      name="Budget"
                      dataKey="totalBudgetAmount"
                      fill="#EF9FBC"
                      radius={[10, 10, 0, 0]}
                    />
                    <Bar
                      name="Dépensé"
                      dataKey="totalTrasactionAmount"
                      fill="#EEAF3A"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 border-2 border-base-300 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">
                    Dernieres transactions
                  </h3>

                  <ul className="divide-y divide-base-300">
                    {transactions.map((transaction) => (
                      <TransactionItem
                        transaction={transaction}
                        key={transaction.id}
                      />
                    ))}
                  </ul>
                </div>
            </div>

            <div className="md:w-1/3 ml-4 ">
              <h3 className="text-lg font-semibold my-4 md:mb-4 md:mt-0">
                Derniers budgets
              </h3>

              <ul className="grid md:grid-cols-1 gap-1">
                {budgets.map((budget) => (
                  <Link href={`/manage/${budget.id}`} key={budget.id}>
                    <BudgetItem budget={budget} enableHover={1} />
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default Page;
