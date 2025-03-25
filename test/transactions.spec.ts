import { expect, test, beforeAll, afterAll, describe, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';

import { app } from '../src/app';
import { send } from 'node:process';


describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  beforeEach(() => { // rodando a migração antes de cada um dos testes
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest')
  });
  
  test('O usuário consegue criar uma nova transação', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        "title": "new Transaction",
        "amount": 5000.10,
        "type": "credit"
      });
  
    expect(response.statusCode).toEqual(201);
  });

  test('Deve ser possível listar todas as transações', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        'title': 'new Transaction',
        'amount': 5000.10,
        'type': 'credit'
      });

    const cookies = createTransactionResponse.get('Set-Cookie');
    if (!cookies)
      throw new Error('No cookies returned from response');
    
    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);
      
    console.log(listTransactionResponse.body);
      
    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'new Transaction',
        amount: 5000.10,
      }),
    ]);
  });

  test('Deve ser possível obter uma transação específica', async() =>  {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        'title': 'new Transaction 2',
        'amount': 5000.10,
        'type': 'debit'
      });

    const cookies = createTransactionResponse.get('Set-Cookie');
    if (!cookies)
      throw new Error('No cookies returned from response');

    const listaTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);
    const transactionId = listaTransactionResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies);

    console.log(getTransactionResponse.body);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'new Transaction 2',
        amount: -5000.10,
        type: 'debit'
      }),
    );
  });

  test('Deve ser possível obter o resumo da conta', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        'title': 'new Transaction 3',
        'amount': 6000.10,
        'type': 'credit'
      })
      
    const cookies = createTransactionResponse.get('Set-Cookie')!;
    if (!cookies)
      throw new Error('No cookies returned from response');

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        'title': 'new Transaction Debit',
        'amount': 5000.10,
        'type': 'debit'
      });

    const getTransactionSummaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies);

    console.log(getTransactionSummaryResponse.body);

    expect(getTransactionSummaryResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 1000
      }),
    );
  });

});
