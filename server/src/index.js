import express from 'express';
import { getBikeShelters, getVlille, getBoxBike, getRepairBike, getHoops} from './routes/routes';

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

//Permet de recuperer les espaces de stationement des velos
indexRouter.get('/getBikeShelters', (req, res) => getBikeShelters(req, res));
//Permet de recuperer  les V'lille disponible a Lille, Lomme, Hellemmes
indexRouter.get('/getVlille', (req, res) => getVlille(req, res));
//Permet de recuperer les aires de box des velos
indexRouter.get('/getBoxBike', (req, res) => getBoxBike(req, res));
//Permet de recuperer les espaces de reparations des velos
indexRouter.get('/getRepairBike', (req, res) => getRepairBike(req, res));
//Permet de recuperer les aires d'arceaux
indexRouter.get('/getHoops', (req, res) => getHoops(req, res));
//Permet de recuperer les espaces de stationnement des trottinettes électriques et vélos à assistance électrique en libre-service
indexRouter.get('/getedpm_va_self_service', (req, res) => getedpm_va(req, res))
export default indexRouter;
