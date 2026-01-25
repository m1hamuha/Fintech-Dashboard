import React, { useEffect, useState } from 'react'

type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category: string
  accountId: string
}

type Account = { id: string; name: string }

export const TransactionsView: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ accountId: '', startDate: '', endDate: '', category: '', minAmount: '', maxAmount: '' })

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3002/transactions').then(r => r.json()),
      fetch('http://localhost:3002/accounts').then(r => r.json()),
    ]).then(([t, a]) => {
      setTransactions(t ?? [])
      setAccounts(a ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const applyFilters = () => {
    const q = new URLSearchParams()
    if (filters.accountId) q.append('accountId', filters.accountId)
    if (filters.startDate) q.append('startDate', filters.startDate)
    if (filters.endDate) q.append('endDate', filters.endDate)
    if (filters.category) q.append('category', filters.category)
    if (filters.minAmount) q.append('minAmount', String(filters.minAmount))
    if (filters.maxAmount) q.append('maxAmount', String(filters.maxAmount))
    fetch(`http://localhost:3002/transactions?${q.toString()}`)
      .then(res => res.json())
      .then(data => setTransactions(data ?? []))
  }

  if (loading) return <div>Loading transactions...</div>
  return (
    <div>
      <h2>Transactions</h2>
      <div className="filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <select value={filters.accountId} onChange={e => setFilters({ ...filters, accountId: e.target.value })}>
          <option value="">All accounts</option>
          {accounts.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
        </select>
        <input type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
        <input placeholder="Category" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} />
        <input placeholder="Min amount" value={filters.minAmount} onChange={e => setFilters({ ...filters, minAmount: e.target.value })} />
        <input placeholder="Max amount" value={filters.maxAmount} onChange={e => setFilters({ ...filters, maxAmount: e.target.value })} />
        <button onClick={applyFilters}>Apply</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Description</th><th>Amount</th><th>Account</th><th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.currency} {t.amount.toFixed(2)}</td>
              <td>{accounts.find(a => a.id === t.accountId)?.name ?? t.accountId}</td>
              <td>{t.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
