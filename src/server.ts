import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { env } from './env';
import { transactionsRoutes } from './routes/transactions.routes';

const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: 'transactions'
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}`);
  });
