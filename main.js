import { convertLambert93ToWGS84 } from './modules/convertLambert93.js';

// == Initialisation ==
var map = L.map('map').setView([50.62925, 3.057256], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// == End of Initialisation ==



// == START Icon and Marker ==

// Icon pour la position de l'utilisation
var iconUserPosition = L.divIcon({
    html: '<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// Icon: Implantation des arceaux vélos à Roubaix
var iconArceaux = L.divIcon({
    html: '<div style="background-color: purple; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// Icon: Box à vélos à Lille, Lomme et Hellemmes
var iconBox = L.divIcon({
    html: '<div style="background-color: brown; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// Icon: Stations de réparations de vélo à Lille
var iconStation = L.divIcon({
    html: '<div style="background-color: green; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// Icon: ilévia - Abris à vélos
var iconAbriVelo = L.divIcon({
    html: '<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// Icon: Espaces de stationnement (TE et VAE en libre service)
var iconParkingLS = L.divIcon({
    html: '<div style="background-color: teal; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// Icon: V'Lille - Disponibilité en temps réel
var iconVLilleOn = L.divIcon({
    html: '<div style="background-color: grey; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});
var iconVLilleOff = L.divIcon({
    html: '<div style="background-color: lightgrey; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// == END Icon and Marker ==





// == START API Import ==

/**
 * METHODE TEMPORAIRE POUR POUVOIR IMPORTER DES DONNEES, RETOURNE DES DONNEES SOUS FORME D'OBJET
 * @param {*} path chemin vers l'api
 */
async function importCSV(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Erreur de chargement : ${response.status}`);
        }
        const data = await response.text();

        // Découpage des lignes du CSV
        const lignes = data.trim().split('\n');
        const enTete = lignes[0].split(',');

        // Transformation en tableau d'objets
        const objets = lignes.slice(1).map(ligne => {
            const valeurs = ligne.split(',');
            const objet = {};
            enTete.forEach((cle, index) => {
                objet[cle.trim()] = valeurs[index]?.trim();
            });
            return objet;
        });

        return objets;

    } catch (error) {
        console.error('Erreur lors de l\'import du CSV:', error);
        return [];
    }
}

// import DATA Implantation des arceaux vélos à Roubaix
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_roubaix%3Aimplantation_des_arceaux_velos_a_roubaix&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')){
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);

                addMarker(lat, lon, place['localisation'], iconArceaux);
            }
            
        })
    })

// import DATA Box à vélos à Lille, Lomme et Hellemmes
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_lille%3Abox_a_velos_a_lille_lomme_et_hellemmes&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['FID'].includes('box')) {
                var lat = parseFloat(place['x_l93']);
                var lon = parseFloat(place['y_l93']);

                var coords = convertLambert93ToWGS84(lat, lon);

                addMarker(coords[0], coords[1], place['champ_calc'].split(': ')[1], iconBox);

            }
        })
    })

// import DATA Stations de réparations de vélo à Lille
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_lille%3Abornes_dateliers_velos_a_lille&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')){
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);

                addMarker(lat, lon, place['adresse'], iconStation);
            }
            
        })
    })

//import DATA ilévia - Abris à vélos
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dsp_ilevia%3Ailevia_abrisvelos&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')){
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);

                addMarker(lat, lon, place['adresse'], iconAbriVelo);
            }
            
        })
    })

// import DATA Espaces de stationnement (TE et VAE en libre service)
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=mel_mobilite_et_transport%3Aedpm_vae_libreservice&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')){
                const lat = parseFloat(place['y_lat']);
                const lon = parseFloat(place['x_long']);

                // TODO Filtre et à désactiver par défaut (il y en a trop à afficher !!!)
                // addMarker(lat, lon, place['nom_voie'], iconParkingLS);
            }
            
        })
    })

// import DATA V'Lille - Disponibilité en temps réel
importCSV("https://data.lillemetropole.fr/geoserver/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dsp_ilevia%3Avlille_temps_reel&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')){
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);

                var txt = place['adresse']
                if (place['etat'] == 'EN SERVICE') {
                    txt += "<br>Vélos disponibles: " + place['nb_velos_dispo'] + "<br>Places disponibles: " + place['nb_places_dispo']

                    addMarker(lat, lon, txt, iconVLilleOn);
                } else {
                    txt += "<br>Station hors service"
                    addMarker(lat, lon, txt, iconVLilleOff);
                }
            }
            
        })
    })

// == END API Import ==





// == START Method initialisaiton ==

/**
 * addMarker ajoute un marqueur sur la carte leaflet
 * @param {*} lat latitude
 * @param {*} lon longitude
 * @param {*} texte texte indicatif sur le lieu
 * @param {*} icone type d'icône
 */
function addMarker(lat, lon, texte, icone) {
    L.marker([lat, lon], { icon: icone }).addTo(map)
        .bindPopup(texte);
}


// == Method calling ==

/**
 * Get the position from the user and add a marker
 */
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Centrer la carte sur la position de l'utilisateur
            map.setView([lat, lon], 14);

            // Ajouter un petit point bleu pour indiquer la position
            L.marker([lat, lon], { icon: iconUserPosition, interactive: false }).addTo(map);
        },
        function() {
            console.warn("Localisation refusée ou indisponible.");
        }
    );
}

