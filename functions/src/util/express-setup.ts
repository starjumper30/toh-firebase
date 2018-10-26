import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import {validateFirebaseIdToken} from './auth';

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

export function initExpressApp(secure: boolean) {
  const app = express();
  const corsMiddleware = cors({
    origin: ['http://localhost:4200', `https://${firebaseConfig.projectId}.firebaseapp.com`]
  });
  app.use(corsMiddleware);
  app.use(cookieParser());

  if (secure) {
    app.use(validateFirebaseIdToken);
  }
  return app;
}
