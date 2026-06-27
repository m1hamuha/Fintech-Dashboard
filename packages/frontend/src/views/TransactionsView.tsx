import React, { useEffect, useState, useCallback } from 'react'
import api, { Transaction, Account, TransactionFilters, PaginationInfo } from '../services/api'

// Render the API's ISO date (YYYY-MM-DD) as a human-readable date.
// Locale pinned to en-US and timeZone to UTC so a date-only string never
// shifts a day in negative-offset timezones and stays deterministic.
const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export const TransactionsView: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>(({
    accountId: '',
    startDate: '',
    endDate: '',
    category: '',
    minAmount: '',
    maxAmount: '',
    page: 1,
    limit: 50
  }))

  const loadData = useCallback(async () => {
    try {
      const [txResponse, accountsData] = await Promise.all([
        api.transactions.getAll(filters),
        api.accounts.getAll()
      ])
      setTransactions(txResponse.data)
      setPagination(txResponse.pagination)
      setAccounts(accountsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const applyFilters = async () => {
    setLoading(true)
    try {
      const response = await api.transactions.getAll(filters)
      setTransactions(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (newPage: number) => {
    const updatedFilters = { ...filters, page: newPage }
    setFilters(updatedFilters)
    setLoading(true)
    try {
      const response = await api.transactions.getAll(updatedFilters)
      setTransactions(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div role="status" aria-live="polite">Loading transactions...</div>
  if (error) return <div role="alert" style={{ color: 'red' }}>Error: {error}</div>
  return (
    <div>
      <h2>Transactions</h2>
      <div className="filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <select aria-label="Filter by account" value={filters.accountId} onChange={e => setFilters({ ...filters, accountId: e.target.value })}>
          <option value="">All accounts</option>
          {accounts.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
        </select>
        <input aria-label="Start date" type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
        <input aria-label="End date" type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
        <input aria-label="Category" placeholder="Category" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} />
        <input aria-label="Min amount" placeholder="Min amount" value={filters.minAmount} onChange={e => setFilters({ ...filters, minAmount: e.target.value })} />
        <input aria-label="Max amount" placeholder="Max amount" value={filters.maxAmount} onChange={e => setFilters({ ...filters, maxAmount: e.target.value })} />
        <button onClick={applyFilters}>Apply</button>
      </div>
      {pagination && (
        <div style={{ marginBottom: 10, padding: 8, background: '#f5f5f5', color: '#1a2540', borderRadius: 4 }}>
          Showing {transactions.length} of {pagination.total} transactions | Page {pagination.page} of {pagination.totalPages}
        </div>
      )}

      <div role="region" aria-label="Transactions table" tabIndex={0} style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Description</th><th>Amount</th><th>Account</th><th>Category</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td className="empty" colSpan={5}>No transactions match your filters.</td>
              </tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id}>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.description}</td>
                  <td>{t.currency} {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{accounts.find(a => a.id === t.accountId)?.name ?? t.accountId}</td>
                  <td>{t.category}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
