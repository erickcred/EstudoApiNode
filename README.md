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
- [ ] Deve ser possível identificarmos o usuário entre as requisições;
- [ ] O usuário só pode visualizar transações o qual ele criou;
- - 

# Requisitos não Funcionais

- - 
- - 