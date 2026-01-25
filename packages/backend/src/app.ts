import express, { Request, Response, NextFunction } from 'express'
import { initDb, getAccounts, getAccountById, getTransactions } from './db'
import { AppError, errorHandler } from './errors'
import swaggerUi from 'swagger-ui-express'
import openapiSpec from './openapi.json'
// no extra path helpers here

const app = express()

app.use(express.json())

// OpenAPI docs via swagger-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec))
// Inline docs JSON for compatibility
app.get('/docs.json', (_req, res) => {
  res.json(openapiSpec)
})

// Basic CORS for local dev (optional, but handy for frontend dev)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Routes
app.get('/accounts', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await getAccounts()
    res.json(accounts)
  } catch (err) {
    next(err)
  }
})

app.get('/accounts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const acc = await getAccountById(req.params.id)
    if (!acc) {
      throw new AppError('Account not found', 404, { id: req.params.id })
    }
    res.json(acc)
  } catch (err) {
    next(err)
  }
})

  app.get('/transactions', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query as Record<string, string>
    // Basic validation
    if (q.startDate && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(q.startDate)) {
      throw new AppError('Invalid startDate format. Expected YYYY-MM-DD', 400)
    }
    if (q.endDate && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(q.endDate)) {
      throw new AppError('Invalid endDate format. Expected YYYY-MM-DD', 400)
    }
    if (q.minAmount && isNaN(Number(q.minAmount))) {
      throw new AppError('minAmount must be a number', 400)
    }
    if (q.maxAmount && isNaN(Number(q.maxAmount))) {
      throw new AppError('maxAmount must be a number', 400)
    }

    // Optional: verify accountId exists if provided
    if (q.accountId) {
      const acc = await getAccountById(q.accountId)
      if (!acc) {
        throw new AppError('Account not found', 404, { accountId: q.accountId })
      }
    }

    const filters: Record<string, unknown> = {}
    if (q.accountId) filters.accountId = q.accountId
    if (q.startDate) filters.startDate = q.startDate
    if (q.endDate) filters.endDate = q.endDate
    if (q.category) filters.category = q.category
    if (q.minAmount) filters.minAmount = Number(q.minAmount)
    if (q.maxAmount) filters.maxAmount = Number(q.maxAmount)

    const txs = await getTransactions(filters)
    res.json(txs)
  } catch (err) {
    next(err)
  }
})

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Default error handler (must be defined last)
app.use(errorHandler)

// Initialize DB and start server (except in test mode)
// Initialize DB but don't start server here (server starts in index.ts)
initDb().catch((err) => {
  console.error('Failed to initialize DB', err)
})

export { app }
