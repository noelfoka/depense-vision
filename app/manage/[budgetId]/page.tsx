"use client"

import { getTransactionsByBudgetId } from '@/app/actions'
import BudgetItem from '@/app/components/BudgetItem'
import Wrapper from '@/app/components/Wrapper'
import { Budget } from '@/type'
import React, { useEffect, useState } from 'react'

const Page = ({params}: {params: Promise<{budgetId: string}>}) => {

  const [budgetId, setBudgetId] = useState<string>("")
  const [budget, setBudget] = useState<Budget>()

  const fetBudgetData = async (budgetId: string) => {
    try {
      
      // Vérifier si l'id du budget existe
      if (budgetId) {
        const budgetData = await getTransactionsByBudgetId(budgetId)
        setBudget(budgetData as Budget);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du budget et des transactions", error)
    }
  }

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId);
      fetBudgetData(resolvedParams.budgetId)

    }
    getId();
  }, [params])

  return (
    <Wrapper>
      {budget && (
        <BudgetItem budget={budget} enableHover={0} />
      )}
    </Wrapper>
  )
}

export default Page