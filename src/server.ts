import fastify from 'fastify';
import crypto from 'node:crypto';
import { knex } from './database';
import { env } from './env';

const app = fastify();

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
})

app.get('/transactions', async (req, res) => {
  const transactions = await knex('transactions').select('*');
  return transactions;
});

app.post('/transactions', async (req, res) => {
  const { title, amount } = req.body as { title: string, amount: number };
  await knex('transactions').insert({
    id: crypto.randomUUID(),
    title,
    amount,
  });
  return res.status(201).send();
});

app.put('/transactions/:id', async (req, res) => {
  const { title, amount } = req.body as { title: string, amount: number };
  const { id } = req.params as { id: string };

  console.log(id)

  await knex('transactions').update({
    title,
    amount,
  }).where('id', id);
  return res.status(204).send();
});

app.delete('/transactions/:id', async (req, res) => {
  const { id } = req.params as { id: string };
  await knex('transactions').delete().where('id', id);
  return res.status(204).send();
});


app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}`);
  });
