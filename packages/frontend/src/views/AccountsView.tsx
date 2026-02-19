import React, { useEffect, useState } from 'react'
import api, { Account } from '../services/api'

export const AccountsView: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.accounts.getAll()
      .then((data) => setAccounts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading accounts...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
  return (
    <div>
      <h2>Accounts</h2>
      <ul>
        {accounts.map(a => (
          <li key={a.id}>{a.name} — {a.currency} {a.balance.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  )
}
