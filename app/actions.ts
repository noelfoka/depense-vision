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
    
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une tranction", error)
    throw error
  }
}
