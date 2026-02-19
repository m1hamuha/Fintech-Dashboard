import React, { useEffect, useState } from 'react'
import { BalanceCard } from '../components/BalanceCard'
import { BarChart } from '../components/BarChart'
import api, { Account } from '../services/api'

export const DashboardView: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.accounts.getAll()
      .then((data) => setAccounts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const total = accounts.reduce((sum, a) => sum + (a.balance ?? 0), 0)
  const data = accounts.map(a => ({ label: a.name, value: a.balance }))

  if (loading) return <div>Loading dashboard...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div>
      <BalanceCard total={total} currency="USD" />
      <div style={{ marginTop: 20 }}>
        <BarChart data={data} height={180} />
      </div>
    </div>
  )
}
