import {Pool, PoolConfig} from 'pg';
import * as functions from 'firebase-functions';

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const connectionName = `${firebaseConfig.projectId}:us-central1:toh-db`;
const dbUser = functions.config().sql.user;
const dbPassword = functions.config().sql.password;
const dbName = functions.config().sql.name;

const pgConfig: PoolConfig = {
  max: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  host: `/cloudsql/${connectionName}`
};

// Connection pools reuse connections between invocations,
// and handle dropped or expired connections automatically.
export function initPgPool(pgPool: Pool): Pool {
  // Initialize the pool lazily, in case SQL access isn't needed for this
  // GCF instance. Doing so minimizes the number of active SQL connections,
  // which helps keep your GCF instances under SQL connection limits.
  console.log(pgConfig);
  return !pgPool ? new Pool(pgConfig) : pgPool;
}
