import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('http server running')
    console.log(env.PORT)
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
