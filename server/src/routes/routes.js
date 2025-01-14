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
        console.log('Requête GET effectuée:', Vponse.data);
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

export async function getBoxBike(req, res)
{
   try {
     const config = {
      headers: {
        'Content-Type': 'application/json',
      },
  };
    let Vponse = await axios.get('https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_lille%3Abox_a_velos_a_lille_lomme_et_hellemmes&OUTPUTFORMAT=application%2Fjson',  config);
    console.log('Requête GET effectuée:', Vponse.data);
        res.status(200).json(Vponse.data.features);
        } catch(error) {
            res.status(400).json({err: "Une erreur s'est produite. Reessayez"});
        }
}


export async function getRepairBike(req, res)
{
   try {
     const config = {
      headers: {
        'Content-Type': 'application/json',
      },
  };
    const Vponse = await axios.get('https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_lille%3Abornes_dateliers_velos_a_lille&OUTPUTFORMAT=application%2Fjson',  config);
    console.log('Requête GET effectuée:', Vponse.data);
        res.status(200).json(Vponse.data);
        } catch(error) {
            res.status(400).json({err: "Une erreur s'est produite. Reessayez"});
        }
}

export async function getHoops(req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const Vponse = await axios.get('https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_roubaix%3Aimplantation_des_arceaux_velos_a_roubaix&OUTPUTFORMAT=application%2Fjson', config);
        res.status(200).json(Vponse.data.features);

    }    catch(error) {
        res.status(400).json({err: "Une erreur s'est produite"});
    }
}

export async function getedpm_va(req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const Vponse = await axios.get('https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=mel_mobilite_et_transport%3Aedpm_vae_libreservice&OUTPUTFORMAT=application%2Fjson', config);
        res.status(200).json(Vponse.data.features);

    }    catch(error) {
        res.status(400).json({err: "Une erreur s'est produite"});
    }
}

