import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { DashboardView } from './views/DashboardView'
import { AccountsView } from './views/AccountsView'
import { TransactionsView } from './views/TransactionsView'



function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="dashboard">
        <header className="header">Fintech Dashboard</header>
        <nav aria-label="Primary" style={{ display: 'flex', gap: 8, padding: 12, justifyContent: 'center' }}>
          {[
            { to: '/', label: 'Dashboard', end: true },
            { to: '/accounts', label: 'Accounts', end: false },
            { to: '/transactions', label: 'Transactions', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                fontWeight: isActive ? 700 : 400,
                textDecoration: isActive ? 'underline' : 'none',
              })}
            >
              {label}
            </NavLink>
          ))}
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
