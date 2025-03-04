"use server"

// Vérifier si un utilisateur existe dans la base de données sinon l'ajouter

export const checkAndAddUser = async (email: string | undefined) => {
  if(!email) return

  try {
    
  } catch (error) {
    console.error("Erreur lors de la vérification et ajout de l'utilisateur", error)
  }
}
