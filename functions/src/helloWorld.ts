import * as functions from 'firebase-functions';
import {initExpressApp} from './util/express-setup';

const app = initExpressApp(false);

app.get('/hello', (request, response) => {
  response.json("Hello from Firebase!");
});

export const helloWorld = functions.https.onRequest(app);
