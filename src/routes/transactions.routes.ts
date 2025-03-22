import { FastifyInstance } from "fastify";
import crypto from 'node:crypto';
import { z } from 'zod';

import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {

  app.get('/', {
    preHandler: [ checkSessionIdExists ],
  }, async (req, res) => {
    const { sessionId } = req.cookies;

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select();

    return {
      total: transactions.length,
      transactions,
    }
  });

  app.get('/:id', {
    preHandler: [ checkSessionIdExists ],
  }, async (req, res) => {
    const { sessionId } = req.cookies;

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getTransactionParamsSchema.parse(req.params);

    const transaction = await knex('transactions')
      .where({
        id: id,
        session_id: sessionId,
      })
      .first();

    if (transaction)
      return res.status(200).send({
        transaction
      });

    return res.status(404).send({
      message: 'Transaction not found!'
    });
  });

  app.get('/summary', {
    preHandler: [ checkSessionIdExists ],
  }, async (req, res) => {
    const { sessionId } = req.cookies;

    const summary = await knex('transactions')
      .sum('amount', { as: 'amount'})
      .where('session_id', sessionId)
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

    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 10 // 10 dias
      });
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      type,
      session_id: sessionId,
    });

    return res.status(201).send();
  });

  app.put('/:id', {
    preHandler: [ checkSessionIdExists ],
  }, async (req, res) => {
    const { sessionId } = req.cookies;

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const getTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    const { title, amount } = getTransactionBodySchema.parse(req.body);
    const { id } = getTransactionParamsSchema.parse(req.params);

    await knex('transactions')
      .update({
        title,
        amount,
      })
      .where('id', id)
      .andWhere('session_id', sessionId);
    return res.status(204).send();
  });
  
  app.delete('/:id', {
    preHandler: [ checkSessionIdExists ],
  }, async (req, res) => {
    const { sessionId } = req.cookies;

    const { id } = req.params as { id: string };
  
    const transaction = await knex('transactions').select('*').where('id', id).first();

    console.log(transaction);
    if (transaction) {
      const t = await knex('transactions')
        .delete()
        .where({
          id: id,
          session_id: sessionId,
        });
      return res.status(204).send(t);
    }
    
    return res.status(404).send({
      message: 'Transaction not found!',
      transaction: transaction
    });
  });
}
