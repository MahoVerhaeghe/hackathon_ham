import express from 'express';
import { getBikeShelters } from './routes/routes';

import cron from 'node-cron'
import axios from 'axios';
const indexRouter = express.Router();


indexRouter.get('/ok', (req, res) => {
    res.status(200).json({ message: "ok" });
});

indexRouter.get('/getBikeShelters', (req, res) => getBikeShelters(req, res));

export default indexRouter;
