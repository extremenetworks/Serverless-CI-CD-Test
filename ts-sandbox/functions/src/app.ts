import { Request, Response } from 'firebase-functions';
import router from './routes';
import cors = require("cors");
import express = require("express");
import methodOverride = require("method-override");

const app = express()
app.use(cors({ origin: true }));
app.use(express.json());
app.use('/', router);
app.use(methodOverride())
app.use((err: Error, _req: Request, res: Response, _next: Function) => {
    res.status(400).json({
        error: err.message });
});

export default app;
