import React, { useEffect, useState, useCallback } from 'react'
import api, { Transaction, Account, TransactionFilters, PaginationInfo } from '../services/api'

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

  if (loading) return <div>Loading transactions...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
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
      {pagination && (
        <div style={{ marginBottom: 10, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
          Showing {transactions.length} of {pagination.total} transactions | Page {pagination.page} of {pagination.totalPages}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Date</th><th>Description</th><th>Amount</th><th>Account</th><th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#666' }}>
                No transactions match your filters.
              </td>
            </tr>
          ) : (
            transactions.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>{t.currency} {t.amount.toFixed(2)}</td>
                <td>{accounts.find(a => a.id === t.accountId)?.name ?? t.accountId}</td>
                <td>{t.category}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
