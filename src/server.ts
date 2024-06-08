import fastify from 'fastify'
// import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions').select('*')
  return transaction
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('http server running')
  })

// async function removeCorruptMigrations() {
//   try {
//     await knex('knex_migrations')
//       .delete()
//       .whereIn('name', ['20240608114729_create-transactions.ts'])
//     console.log('Migrações corrompidas removidas com sucesso.')
//   } catch (error) {
//     console.error('Erro ao remover migrações corrompidas:', error)
//   } finally {
//     await knex.destroy()
//   }
// }
