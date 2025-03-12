"use server";

import prisma from "@/lib/prisma";

// Vérifier si un utilisateur existe dans la base de données sinon l'ajouter
export const checkAndAddUser = async (email: string | undefined) => {
  if (!email) return;

  try {
    // Récupérer l'utilisateur dans la base de données
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Si l'utilisateur n'existe pas
    if (!existingUser) {
      // Ajouter l'utilisateur dans la base de données
      await prisma.user.create({
        data: {
          email: email,
        },
      });
      console.log("Nouvel utilisateur ajouté dans la base de données");
    } else {
      console.log("Utilisateur déjà existant dans la base de données");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification et ajout de l'utilisateur",
      error
    );
  }
};

// Action pour ajouter des budgets dans la base de données
export const addBudget = async (
  email: string,
  name: string,
  amount: number,
  selectedEmoji: string
) => {
  try {
    // recupere l'utilisateur dans la base de données en fonction de l'email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Si l'utilisateur n'existe pas
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Ajouter le budget dans la base de données
    await prisma.budget.create({
      data: {
        name,
        amount,
        emoji: selectedEmoji,
        userId: user.id,
      },
    });

    console.log("Budget ajouté avec succès");
  } catch (error) {
    console.error("Erreur lors de l'ajout du budget", error);
    throw error;
  }
};

// Action pour récupérer les budgets d'un utilisateur
export async function getBudgetsByUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budgets: {
          include: {
            transactions: true,
          },
        },
      },
    });

    // Vérifier si l'utilisateur existe
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return user.budgets;
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets", error);
    throw error;
  }
}

// Action pour récupérer les transactions d'un budget
export async function getTransactionsByBudgetId(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });

    // Vérifier si budget exist
    if (!budget) {
      throw new Error("Budget non trouvé...");
    }

    return budget;
  } catch (error) {
    console.error("Erreur lors de la recupération des transactions", error);
    throw error;
  }
}

// Action qui permet d'ajouter une nouvelle transaction à un budget
export async function addTransactionToBudget(
  budgetId: string,
  amount: number,
  description: string
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });

    if (!budget) {
      throw new Error("Budget non trouvé");
    }

    // Calculer le total des transactions existantes pour ce budget
    const totalTransactions = budget.transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);

    const totalWhithNewTransaction = totalTransactions + amount;

    if (totalWhithNewTransaction > budget.amount) {
      throw new Error(
        "Le montant total des transaction dépassent le montant du budget"
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        emoji: budget.emoji,
        budget: {
          connect: {
            id: budget.id,
          },
        },
      },
    });

    return newTransaction;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une tranction", error);
    throw error;
  }
}

// Action pour suprimer un budget
export async function deleteBudget(budgetId: string) {
  try {
    await prisma.transaction.deleteMany({
      where: {
        budgetId,
      },
    });

    await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la supression de budget et de ses transactions",
      error
    );
    throw error;
  }
}

// Action pour suprimer des transactions

export async function deleteTransaction(transactionId: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      throw new Error("Transaction non trouvée!");
    }

    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la supression de la transaction", error);
    throw error;
  }
}

// Action pour récupérer la liste des transaction selon une période
export async function getTransactionsByEmailAndPeriod(
  email: string,
  period: string
) {
  try {
    const now = new Date();

    let dateLimit;

    switch (period) {
      case "last30":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 30);
        break;
      case "last90":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 90);
        break;
      case "last7":
        dateLimit = new Date(now);
        dateLimit.setDate(now.getDate() - 7);
        break;
      case "last365":
        dateLimit = new Date(now);
        dateLimit.setFullYear(now.getFullYear() - 1);
        break;
      default:
        throw new Error("Période invalide");
    }

    // Récupérer l'utilisateur par l'email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budgets: {
          include: {
            transactions: {
              where: {
                createdAt: {
                  gte: dateLimit,
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const transactions = user.budgets.flatMap((budget) =>
      budget.transactions.map((transaction) => ({
        ...transaction,
        budgetName: budget.name,
        budgetId: budget.id,
      }))
    );

    return transactions;
  } catch (error) {
    console.error("Erreur lors de la recuperation des transactions", error);
    throw error;
  }
}

// Dashboard
export async function getTotalTransactionAmount(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budgets: {
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const totalAmount = user.budgets.reduce((sum, budget) => {
      return (
        sum +
        budget.transactions.reduce((budgetSum, transaction) => {
          return budgetSum + transaction.amount;
        }, 0)
      );
    }, 0);

    return totalAmount;
  } catch (error) {
    console.error("Erreur lors du calcul total des transactions", error);
    throw error;
  }
}

// Nombre total des transactions d'un utilisateurs
export async function getTotalTransactionCount(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budgets: {
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const totalCount = user.budgets.reduce((count, budget) => {
      return count + budget.transactions.length;
    }, 0);

    return totalCount;
  } catch (error) {
    console.error("Erreur lors du comptage des transactions", error);
    throw error;
  }
}

// Calculer le nombre de budgets atteints
export async function getReachedBudgets(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budgets: {
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const totalBudgets = user.budgets.length;
    const reachedBudget = user.budgets.filter((budget) => {
      const totalTransactionAmount = budget.transactions.reduce(
        (sum, transaction) => {
          return sum + transaction.amount;
        },
        0
      );

      return totalTransactionAmount >= budget.amount;
    }).length;

    return `${reachedBudget}/${totalBudgets}`;
  } catch (error) {
    console.error(
      "Erreur lors de la recuperation du nombre de budgets atteint",
      error
    );
    throw error;
  }
}

export async function getBudgetUserData(email: string) {
  try {
    
    const user = await prisma.user.findUnique({
      where: {email},
      include: {
        budgets: {
          include: {
            transactions: true
          }
        }
      }
    })

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Construire le tableau des données
    const data = user.budgets.map((budget) => {
      const totalTrasactionAmount = budget.transactions.reduce((sum, transaction) => {
        return sum + transaction.amount
      }, 0)

      return {
        budgetName: budget.name,
        totalBudgetAmount: budget.amount,
        totalTrasactionAmount
      }
    });

    return data;

  } catch (error) {
    console.error("Erreur lors de la recuperation des données budgetaires", error);
    throw error;
  }
}

// Action pour obtenir les 10 dernières transactions
export async function getLastTransactions (email: string) {
  try {
    
    const transactions = await prisma.transaction.findMany({
      where: {
        budget: {
          user: {
            email: email
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      include: {
        budget: {
          select: {
            name: true
          }
        }
      }
    });

    const transactionWithBudgetName = transactions.map(transaction => ({
      ...transaction,
      budgetName: transaction.budget?.name || "N/A"
    }));

    return transactionWithBudgetName;

  } catch (error) {
    console.error("Erreur lors de la recuperation des 10 dernieres transactions", error);
    throw error;
  }
}

// Action pour obtenir les 3 derniers budgets
export async function getLastBudgets (email: string) {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        user: {email}
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3,
      include: {
        transactions: true
      }
    })

    return budgets;

  } catch (error) {
    console.error("Erreur lors de la recuperation des derniers budgets", error);
    throw error;
  }
}
