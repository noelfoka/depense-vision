"use server"

import prisma from "@/lib/prisma"

// Vérifier si un utilisateur existe dans la base de données sinon l'ajouter
export const checkAndAddUser = async (email: string | undefined) => {
  if(!email) return

  try {
    // Récupérer l'utilisateur dans la base de données
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    // Si l'utilisateur n'existe pas
    if(!existingUser) {
      // Ajouter l'utilisateur dans la base de données
      await prisma.user.create({
        data: {
          email: email
        }
      })
      console.log("Nouvel utilisateur ajouté dans la base de données")
    } else {
      console.log("Utilisateur déjà existant dans la base de données")
    }
      
  } catch (error) {
    console.error("Erreur lors de la vérification et ajout de l'utilisateur", error)
  }
}

// Action pour ajouter des budgets dans la base de données
export const addBudget = async (email: string, name: string, amount: number, selectedEmoji: string) => {
  try {
    // recupere l'utilisateur dans la base de données en fonction de l'email
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    // Si l'utilisateur n'existe pas
    if(!user) {
      throw new Error("Utilisateur non trouvé")
    }
    
  } catch (error) {
    console.error("Erreur lors de l'ajout du budget", error)
    throw error
  }
}