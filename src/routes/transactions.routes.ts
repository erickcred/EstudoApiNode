import { FastifyInstance } from "fastify";
import crypto from 'node:crypto';
import { z } from 'zod';

import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {

  app.get('/', async (req, res) => {
    const transactions = await knex('transactions').select();

    return {
      total: transactions.length,
      transactions,
    }
  });

  app.get('/:id', async (req, res) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getTransactionParamsSchema.parse(req.params);

    const transaction = await knex('transactions').where('id', id).first();

    if (transaction)
      return res.status(200).send({
        transaction
      });

    return res.status(404).send({
      message: 'Transaction not found'
    });

  });

  app.get('/summary', async (req, res) => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount'})
      .first();

    return res.status(200).send({
      summary,
    });
  });

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    });

    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      type,
    });

    return res.status(201).send();
  });

  app.put('/:id', async (req, res) => {
    const { title, amount } = req.body as { title: string, amount: number };
    const { id } = req.params as { id: string };

    await knex('transactions').update({
      title,
      amount,
    }).where('id', id);
    return res.status(204).send();
  });
  
  app.delete('/:id', async (req, res) => {
    const { id } = req.params as { id: string };
  
    const transaction = await knex('transactions').select('*').where('id', id).first();

    console.log(transaction);
    if (transaction) {
      const t = await knex('transactions').delete().where('id', id);
      return res.status(204).send(t);
    }
    
    return res.status(404).send({
      message: 'Transaction not found',
      transaction: transaction
    });
  });
}
