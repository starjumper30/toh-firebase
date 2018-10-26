import * as functions from 'firebase-functions';
import {Pool, QueryResult} from 'pg';

import {initExpressApp} from './util/express-setup';
import {initPgPool} from './util/postgres';

const app = initExpressApp(true);
let pgPool: Pool;

app.get('/', async (request, response) => {
  pgPool = initPgPool(pgPool);

  const name:string = request.query.name;
  const whereClause = name ? ` where name like $1` : '';
  const values = name ? [`%${name}%`] : undefined;

  try {
    const result: QueryResult = await pgPool.query(`select * from Heroes${whereClause} order by id`, values);
    response.json(result.rows);
  } catch (err) {
    response.status(500).send(err);
  }
});

app.put('/', async (request, response) => {
  pgPool = initPgPool(pgPool);
  try {
    await pgPool.query(`update Heroes set name = $1 where id = $2`, [request.body.name, request.body.id]);
    response.status(204).end();
  } catch (err) {
    response.status(500).send(err);
  }
});

app.post('/', async (request, response) => {
  pgPool = initPgPool(pgPool);

  try {
    const result = await pgPool.query(`insert into Heroes (name) values ($1) RETURNING *`, [request.body.name]);
    response.json(result.rows[0]);
  } catch (err) {
    response.status(500).send(err);
  }
});

app.get('/:id', async (request, response) => {
  pgPool = initPgPool(pgPool);

  try {
    const result = await pgPool.query(`select * from Heroes where id = $1`, [request.params.id]);
    if (result.rows.length) {
      response.json(result.rows[0]);
    } else {
      response.status(404).send('Hero not found');
    }
  } catch (err) {
    response.status(500).send(err);
  }
});

app.delete('/:id', async (request, response) => {
  pgPool = initPgPool(pgPool);

  try {
    await pgPool.query(`delete from Heroes where id = $1`, [request.params.id]);
    response.status(204).end();
  } catch (err) {
    response.status(500).send(err);
  }
});

export const heroes = functions.https.onRequest(app);
