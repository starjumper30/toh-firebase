import * as functions from 'firebase-functions';
import {initExpressApp} from './util/express-setup';

const app = initExpressApp(true);

app.get('/hello', (request, response) => {
  response.json(`Hello ${request['user'].name}`);
});

export const helloWorldSecure = functions.https.onRequest(app);
