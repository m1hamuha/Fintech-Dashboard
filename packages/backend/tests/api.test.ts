import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { initDb } from '../src/db'

beforeAll(async () => {
  // Ensure DB is initialized before tests run
  await initDb()
})

describe('Backend API - /accounts', () => {
  it('GET /accounts returns 200 and an array', async () => {
    const res = await request(app).get('/accounts')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
  it('GET /accounts/:id returns 200 for existing account', async () => {
    const res = await request(app).get('/accounts/A-001')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', 'A-001')
  })
  it('GET /accounts/:id returns 404 for missing', async () => {
    const res = await request(app).get('/accounts/UNKNOWN')
    expect(res.status).toBe(404)
  })
})

describe('Backend API - /transactions', () => {
  it('GET /transactions returns 200 and an array', async () => {
    const res = await request(app).get('/transactions')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
  it('GET /transactions with invalid startDate returns 400', async () => {
    const res = await request(app).get('/transactions?startDate=not-a-date')
    expect(res.status).toBe(400)
  })
})
