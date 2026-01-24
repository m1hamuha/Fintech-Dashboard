import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { DashboardView } from './views/DashboardView'
import { AccountsView } from './views/AccountsView'
import { TransactionsView } from './views/TransactionsView'



function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="dashboard">
        <header className="header">Fintech Dashboard</header>
        <nav style={{ display: 'flex', gap: 8, padding: 12, justifyContent: 'center' }}>
          <Link to="/">Dashboard</Link>
          <Link to="/accounts">Accounts</Link>
          <Link to="/transactions">Transactions</Link>
        </nav>
        <main className="content" style={{ paddingTop: 0 }}>
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/accounts" element={<AccountsView />} />
            <Route path="/transactions" element={<TransactionsView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
