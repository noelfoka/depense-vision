"use client";

import {
  addTransactionToBudget,
  getTransactionsByBudgetId,
} from "@/app/actions";
import BudgetItem from "@/app/components/BudgetItem";
import Notification from "@/app/components/Notification";
import Wrapper from "@/app/components/Wrapper";
import { Budget } from "@/type";
import { Send, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ budgetId: string }> }) => {
  const [budgetId, setBudgetId] = useState<string>("");
  const [budget, setBudget] = useState<Budget>();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [notification, setNotification] = useState("");

  const closeNotification = () => {
    setNotification("");
  };

  const fetBudgetData = async (budgetId: string) => {
    try {
      // Vérifier si l'id du budget existe
      if (budgetId) {
        const budgetData = await getTransactionsByBudgetId(budgetId);
        setBudget(budgetData as Budget);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du budget et des transactions",
        error
      );
    }
  };

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId);
      fetBudgetData(resolvedParams.budgetId);
    };
    getId();
  }, [params]);

  const handleAddTransaction = async () => {
    if (!description || !amount) {
      setNotification("Veuillez remplir tous les champs");
      return;
    }

    try {
      const amountNumber = parseFloat(amount);

      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("Le montant doit être positif");
      }

      const newTransaction = await addTransactionToBudget(
        budgetId,
        amountNumber,
        description
      );
      setNotification("Transaction ajoutée avec succès!");
      fetBudgetData(budgetId);
      setAmount("");
      setDescription("");

      return newTransaction;
    } catch (error) {
      setNotification("Vous avez dépassé le budget");
      throw error;
    }
  };

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onClose={closeNotification}
        ></Notification>
      )}

      {budget && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <BudgetItem budget={budget} enableHover={0} />
            <button className="btn mt-4">Suprimer le budget</button>
            <div className="space-y-4 flex flex-col mt-4">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Desciption"
                required
                className="input input-bordered"
              />

              <input
                type="number"
                value={amount}
                id="amount"
                placeholder="Montant"
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input input-bordered"
              />

              <button
                type="submit"
                onClick={handleAddTransaction}
                className="btn"
              >
                Ajouter une dépense
              </button>
            </div>
          </div>

          {budget.transactions && budget.transactions.length > 0 ? (
            <div className="overflow-x-auto mt-4 md:mt-0 md:w-2/3 ml-4">
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Montant</th>
                    <th>Desciption</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="text-lg md:text-3xl">{transaction.emoji}</td>
                      <td><div className="badge badge-accent md:badge-sm badge-xs">- {transaction.amount} FCFA</div></td>
                      <td>{transaction.description}</td>
                      <td>{transaction.createdAt.toLocaleDateString("fr-FR")}</td>
                      <td>{transaction.createdAt.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}</td>
                      <td>
                        <button className="btn btn-sm">
                          <Trash className="w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="md:w-2/3 mt-10 md:ml-4 flex items-center justify-center">
              <Send className="w-8 h-8 text-accent" strokeWidth={1.5} />
              <span className="text-gray-500 ml-2">
                Aucune transaction éffectuée
              </span>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default Page;
