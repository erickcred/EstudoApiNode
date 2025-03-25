# Aplicação de teste para o curso de Node.js

- Utilizando o Micro-Framework Fastify para fazer o gerenciamento para lidar com (rotas, parametros, plugins externos, cabeçalhos, resposta em json, entender requisições em json)

- Utilizando Banco de dados Sqlite, por ser um banco de dados SQL(Relacional)

- Utilizando Querybuilder [Knexjs](https://knexjs.org) - [Doc Nodejs](https://knexjs.org/guide/#node-js)
## Knexjs
  Foi desenvolvido para ser utilizado com o Javascript e não com o Typescript. **Quando instalamos o Knexjs** dentro da pasta **node_modules** dentro de **bin** nos temos uma **CLI** do **Knex** para podermos executar, no terminal usamos o comando **npx knex -h** ele apresenta varios commando que temos disponiveis no **knex** para rodar.

  #### Para podermos criar nosso primeira migração
  - Vamos criar um arquivo na raiz do nosso projeto com o nome **knexfile.ts** e rodamos o comando **npx knex migrate:make create-document** para criar nossa primeira migração

  Mas para isso temos que fazer uma pequena alteração no arquivo **src/database.ts** e vamos install o 
  ```js
  De
  export const knex = setupKnex({
    client: 'sqlite',
    connection: {
      filename: './temp/app.db',
    },
    useNullAsDefault: true,
  });

  Para
  export const config = {
    client: 'sqlite',
    connection: {
      filename: './temp/app.db',
    },
    useNullAsDefault: true,
  };

  export const knex = setupKnex(config);
  ```
## Trabalhando com Cookies no Fastify
  - Para trabalhar com cookies no Fastify temos que instalar o pacote **fastify-cookie** 
  <span style="color: white; background-color:#424242; padding:0px 4px;">npm install @fastify/cookie</span>


<hr />

# Requisitos Funcionais

- - 
- [X] O usuário de poder criar uma nova transação;
- [X] O usuário de poder obter um resumo da sua conta;
- [X] O usuário de pode listar todas as transações que já ocorreram;
- [X] O usuário de poder visualizar uma transação única;
- - 

# Regras de Negócio

- - 
- [X] A transação pode ser do tipo crédito que somará ao valor total, ou débito que subtrairá;
- [X] Deve ser possível identificarmos o usuário entre as requisições;
- [X] O usuário só pode visualizar transações o qual ele criou;
- - 

# Requisitos não Funcionais

- - 
- - 


# Testes

### Unitários: unidade da sua aplicação

### Integração: comunicação entre duas ou mais unidades

### E2E - ponta a ponta: simula um usuário operando nossa aplicação 

# Teste Unitários
- Gralmente utilizamos uma ferramente terceira para escrever os testes, para isso temos:
  - JestJs Framework - [JestJS](https://jestjs.io/pt-BR)
  - Vitest Framework - [Vitest](https://vitest.dev)

## Vamos utilizar o Vitest
  - Para isso vamos instalar o vitest **npm install -D vitest**
  - Criamos uma pasta **test** na raiz do projeto e dentro dela criamos um arquivo **example.test.ts**
    ```ts
    import { expect, test } from 'vitest';

    test('O usuário consegue criar uma nova transação', () => {

      const responseStatusCode = 202;
      expect(responseStatusCode).toEqual(201);
    });
    ```
  - Para executar os testes criamos um script no package.json (**"test": "vitest"**) e rodamos o comando **npm run test**
  - Vamos instalar o **supertest** para fazer o teste de integração com o comando (**npm install -D supertest @types/supertest**)
  ```ts
  import { expect, test, beforeAll, afterAll } from 'vitest';
  import request from 'supertest';

  import { app } from '../src/app';

  beforeAll(async () => { // espera a aplicação iniciar estár em execução
    await app.ready();
  });

  afterAll(async () => { // depois da execução de todos os testes, a aplicação é finalizada
    await app.close();
  })


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
  ```

## Build da aplicação
  - Vamos instalar o package **npm install -D tsup**
  - No package.json vamos criar um script para fazer o build da aplicação **"build": "tsup src --out-dir build"**
