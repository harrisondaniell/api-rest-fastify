import { test, beforeAll, afterAll, describe, expect } from 'vitest'
import { execSync } from 'node:child_process'
import resquest from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeAll(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('User can create a new transaction', async () => {
    await resquest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    // expect(response.statusCode).toEqual(201)
  })

  test('should be able to list all transactions', async () => {
    const createTransactionResponse = await resquest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await resquest(app.server)
      .get('/transactions')
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  test('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await resquest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await resquest(app.server)
      .get('/transactions')
      .set('Cookie', cookies ?? [])
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await resquest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  test('should be able to get the summary', async () => {
    const createTransactionResponse = await resquest(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await resquest(app.server)
      .post('/transactions')
      .set('Cookie', cookies ?? [])
      .send({
        title: 'Debit transaction ',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await resquest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
