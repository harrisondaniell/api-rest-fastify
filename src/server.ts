import fastify from 'fastify'
import cookie from '@fastify/cookie'
// import crypto from 'node:crypto'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
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
