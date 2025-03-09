import { Budget } from "@/type";
import React from "react";

interface BudgetItemProps {
  budget: Budget;
  enableHover?: number;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ budget, enableHover }) => {
  // Calculer le nombre de transactions que contient ce budget
  const transactionCount = budget.transactions ? budget.transactions.length : 0;

  // Calculer le montant total des transactions
  const totalTransactionAmount = budget.transactions
    ? budget.transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      )
    : 0;

  // Calculer le pourcentage de dépense
  const progressAmout = totalTransactionAmount > budget.amount ? 100 : (totalTransactionAmount / budget.amount) * 100;

  // Calculer le montant restant des transactions
  const remainingAmount = budget.amount - totalTransactionAmount;

  const hoverClasses = enableHover === 1 ? "hover:shadow-lg hover:border-accent ease-in-out duration-500" : "";

  return (
    <li key={budget.id} className={`p-4 rounded-xl border-2 border-base-300 list-none ${hoverClasses}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-accent/20 text-xl h-10 w-10 rounded-full flex justify-center items-center">{budget.emoji}</div>

          <div className="flex flex-col ml-3">
            <span className="font-bold text-xl">{budget.name}</span>
            <span className="text-gray-500 text-sm">{transactionCount} transactions</span>
          </div>
        </div>

        <div className="text-xl font-bold text-accent">{budget.amount} FCFA</div>
      </div>

      <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
        <span>{totalTransactionAmount} FCFA dépensés</span>
        <span>{remainingAmount} FCFA restant</span>
      </div>

      <div>
      <progress className="progress progress-warning w-full mt-4" value={progressAmout} max="100"></progress>
      </div>
    </li>
  );
};

export default BudgetItem;
