import React, { useEffect, useState } from 'react'
import { BalanceCard } from '../components/BalanceCard'
import { BarChart } from '../components/BarChart'

type Account = { id: string; name: string; balance: number; currency: string; type: string }

export const DashboardView: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/accounts')
      .then(r => r.json())
      .then((data) => setAccounts(data ?? []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }, [])

  const total = accounts.reduce((sum, a) => sum + (a.balance ?? 0), 0)
  const data = accounts.map(a => ({ label: a.name, value: a.balance }))

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div>
      <BalanceCard total={total} currency="USD" />
      <div style={{ marginTop: 20 }}>
        <BarChart data={data} height={180} />
      </div>
    </div>
  )
}
