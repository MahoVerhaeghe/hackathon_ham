import axios from 'axios';
import { Vponse } from '..';


export async function getBikeShelters(req, res)
{
   try {
    const config = {
             headers: {
               'Content-Type': 'application/json',
             },
          };
        const response = await axios.get('https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dsp_ilevia%3Ailevia_abrisvelos&OUTPUTFORMAT=application%2Fjson', config);
        console.log(response.data.features);
        res.status(200).json(response.data.features);
        } catch(error) {
            res.status(400).json({err: "Une erreur s'est produite. Reessayez"});
        }
}

export async function getVlille(req, res)
{
   try {
     const config = {
      headers: {
        'Content-Type': 'application/json',
      },
  };
    let Vponse = await axios.get('https://data.lillemetropole.fr/data/ogcapi/collections/ilevia:vlille_temps_reel/items?f=json&limit=-1',  config);
    console.log('Requête GET effectuée:', Vponse.data);
        res.status(200).json(Vponse.data.records);
        } catch(error) {
            res.status(400).json({err: "Une erreur s'est produite. Reessayez"});
        }
}

