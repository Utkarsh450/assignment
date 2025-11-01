import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Budgets from '../pages/Budgets'
import BudgetExpenses from '../pages/BudgetExpenses'
import Expenses from '../pages/Expenses'

const MainRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/budgets" element={<Budgets/>}/>
        <Route path="/budgets/:expenseId" element={<BudgetExpenses/>}/>
        <Route path="/expenses" element={<Expenses/>}/>


    </Routes>
  )
}

export default MainRoutes