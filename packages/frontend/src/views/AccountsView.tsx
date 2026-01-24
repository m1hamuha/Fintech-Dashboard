import React, { useEffect, useState } from 'react'

type Account = { id: string; name: string; balance: number; currency: string; type: string }

export const AccountsView: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/accounts')
      .then(res => res.json())
      .then((data) => setAccounts(data ?? []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading accounts...</div>
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
