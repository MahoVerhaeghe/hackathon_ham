import { convertLambert93ToWGS84 } from './modules/convertLambert93.js';

// == Initialisation ==
var map = L.map('map').setView([50.62925, 3.057256], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// == End of Initialisation ==

// == START Icon and Marker ==

// Define the various icons as you have already done
var iconUserPosition = L.divIcon({
    html: '<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

var iconArceaux = L.divIcon({
    html: '<div style="background-color: purple; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});
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

// Function to import CSV data from API (same as you have already)

async function importCSV(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Erreur de chargement : ${response.status}`);
        }
        const data = await response.text();

        const lignes = data.trim().split('\n');
        const enTete = lignes[0].split(',');

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
let parkings = [];
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_roubaix%3Aimplantation_des_arceaux_velos_a_roubaix&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')) {
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);
                parkings.push({
                    lat: lat,
                    lon: lon
                })
                addMarker(lat, lon, place['localisation'], iconArceaux);
            }
        });
    });

// import DATA Box à vélos à Lille, Lomme et Hellemmes
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_lille%3Abox_a_velos_a_lille_lomme_et_hellemmes&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['FID'].includes('box')) {
                var lat = parseFloat(place['x_l93']);
                var lon = parseFloat(place['y_l93']);

                var coords = convertLambert93ToWGS84(lat, lon);
                parkings.push({
                    lat: lat,
                    lon: lon
                })
                addMarker(coords[0], coords[1], place['champ_calc'].split(': ')[1], iconBox);
            }
        });
    });

// import DATA Stations de réparations de vélo à Lille
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ville_lille%3Abornes_dateliers_velos_a_lille&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')) {
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);

                addMarker(lat, lon, place['adresse'], iconStation);
            }
        });
    });

//import DATA ilévia - Abris à vélos
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dsp_ilevia%3Ailevia_abrisvelos&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')) {
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);
                parkings.push({
                    lat: lat,
                    lon: lon
                });
                addMarker(lat, lon, place['adresse'], iconAbriVelo);
            }
        });
    });

// import DATA Espaces de stationnement (TE et VAE en libre service)
importCSV("https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=mel_mobilite_et_transport%3Aedpm_vae_libreservice&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')) {
                const lat = parseFloat(place['y_lat']);
                const lon = parseFloat(place['x_long']);
               /* parkings.push({
                    lat: lat,
                    lon: lon
                })*/
                // TODO Filtre et à désactiver par défaut (il y en a trop à afficher !!!)
                // addMarker(lat, lon, place['nom_voie'], iconParkingLS);
            }
        });
    });


// import DATA V'Lille - Disponibilité en temps réel
importCSV("https://data.lillemetropole.fr/geoserver/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dsp_ilevia%3Avlille_temps_reel&OUTPUTFORMAT=csv")
    .then((response) => {
        response.forEach((place) => {
            if (place['geom'].includes('POINT')) {
                var coords = place['geom'].replace('(', '').replace(')', '').split(' ');
                const lat = parseFloat(coords[1]);
                const lon = parseFloat(coords[2]);
                boxes.push({
                    lat: lat,
                    lon: lon
                });
                var txt = place['adresse'];
                if (place['etat'] == 'EN SERVICE') {
                    txt += "<br>Vélos disponibles: " + place['nb_velos_dispo'] + "<br>Places disponibles: " + place['nb_places_dispo'];

                    addMarker(lat, lon, txt, iconVLilleOn);
                } else {
                    txt += "<br>Station hors service";
                    addMarker(lat, lon, txt, iconVLilleOff);
                }
            }
        });
    });



// == END API Import ==

// == START Method initialisation ==

function addMarker(lat, lon, texte, icone) {
    L.marker([lat, lon], { icon: icone }).addTo(map)
        .bindPopup(texte);
}

// == Add Routing Functionality ==

// Initialize the routing control
let routingControl = L.Routing.control({
    waypoints: [
        L.latLng(50.62925, 3.057256),  // Starting point (can be dynamic)
        L.latLng(50.62950, 3.05750)    // End point (can be dynamic)
    ],
    routeWhileDragging: true,   // Allow route to update while dragging
    geocoder: L.Control.Geocoder.nominatim() // Geocoding for address lookup
}).addTo(map);

function addRouteToNearestParking(userLat, userLon) {
    let nearestParking = parkings[0];
    let minDistance = Infinity;

    parkings.forEach(parking => {
        const distance = getDistance(userLat, userLon, parking.lat, parking.lon);
        if (distance < minDistance) {
            nearestParking = parking;
            minDistance = distance;
        }
    });

    L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLon),
            L.latLng(nearestParking.lat, nearestParking.lon)
        ]
    }).addTo(map);
}

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Earth radius in meters
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2 - lat1) * Math.PI / 180;
    var Δλ = (lon2 - lon1) * Math.PI / 180;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Return distance in meters
}
// == Method calling ==

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Set the map view to the user's location
            map.setView([lat, lon], 14);

            // Add a marker at the user's location
            L.marker([lat, lon], { icon: iconUserPosition, interactive: false }).addTo(map);

            // Update the routing waypoints 
            addRouteToNearestParking(lat, lon);

        },
        function() {
            console.warn("Localisation refusée ou indisponible.");
        }
    );
}

