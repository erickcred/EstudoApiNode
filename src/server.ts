import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
})

app.post('/transactions', async (req, res) => {
  const { title, amount } = req.body as { title: string, amount: number };
  await knex('transactions').insert({
    title,
    amount,
  });
  return res.status(201).send();
});

app.get('/transactions', async (req, res) => {
  const transactions = await knex('transactions').select('*');
  return transactions;
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running on port 3333');
  });
