/*import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const hellWorld = functions.https.onRequest((request: any, response: any) => {
    response.send("Helloooooo from Firebase!");
});
*/
    
import { https } from 'firebase-functions';

import app from "./app";

export const napi = https.onRequest(app);
