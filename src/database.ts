import 'dotenv/config';
import { knex as setupKnex, Knex } from 'knex';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found.');
}

export const config = {
  client: process.env.DATABASE_CLIENT,
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: process.env.DATABASE_EXTENSION,
    directory: process.env.DATABASE_MIGRATIONS_DIR,
  }
};

export const knex = setupKnex(config);