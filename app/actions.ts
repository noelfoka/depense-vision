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
    }
      
  } catch (error) {
    console.error("Erreur lors de la vérification et ajout de l'utilisateur", error)
  }
}
