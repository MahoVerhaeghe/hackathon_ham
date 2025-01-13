import express from 'express';
import { getBikeShelters, getVlille } from './routes/routes';

import cron from 'node-cron'
import axios from 'axios';
const indexRouter = express.Router();

export let Vponse;

cron.schedule('* * * * *', async () => {
  const config = {
      headers: {
        'Content-Type': 'application/json',
      },
  };
  try {
    Vponse = await axios.get('https://data.lillemetropole.fr/data/ogcapi/collections/ilevia:vlille_temps_reel/items?f=json&limit=-1',  config);
    console.log('Requête GET effectuée:', Vponse.data);
  } catch (error) {
    console.error('Erreur lors de la requête GET:', error);
  }
});

indexRouter.get('/ok', (req, res) => {
    res.status(200).json({ message: "ok" });
});

indexRouter.get('/getBikeShelters', (req, res) => getBikeShelters(req, res));
indexRouter.get('/getVlille', (req, res) => getVlille(req, res));
indexRouter.get('');

export default indexRouter;
