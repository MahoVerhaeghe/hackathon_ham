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
    html: '<div style="background-color: teal; width: 8px; height: 8px; border-radius: 50%;"></div>',
    iconSize: [8, 10],
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

async function importDataFromApi(path) {
    try {
        const response = await fetch('http://localhost:8080/'+ path)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erreur:', error);
        return {}
    }
}


let parkings = [];

// import DATA Implantation des arceaux vélos à Roubaix
importDataFromApi('getHoops')
    .then(response => {
        response.forEach((place) => {
            var coords = [place['geometry']['coordinates'][1], place['geometry']['coordinates'][0]];
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);
            parkings.push({
                lat: lat,
                lon: lon
            })
            addMarker(lat, lon, place['properties']['localisation'], iconArceaux);
        })
    })
    .catch(error => console.error('Erreur lors de l\'import des données :', error));

// // import DATA Box à vélos à Lille, Lomme et Hellemmes
importDataFromApi('getBoxBike')
    .then(response => {
        response.forEach((place) => {
            var coords = [place['geometry']['coordinates'][0][1], place['geometry']['coordinates'][0][0]];
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);
            parkings.push({
                lat: lat,
                lon: lon
            })
            addMarker(lat, lon, place['properties']['localisati'], iconBox);
        });
    })
    .catch(error => console.error('Erreur lors de l\'import des données :', error));

// // import DATA Stations de réparations de vélo à Lille
importDataFromApi('getRepairBike')
    .then(response => {
        response['features'].forEach((place) => {
            var coords = [place['geometry']['coordinates'][1], place['geometry']['coordinates'][0]];
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);

            addMarker(lat, lon, place['properties']['adresse'], iconStation);
        });
    })
    .catch(error => console.error('Erreur lors de l\'import des données :', error));

// //import DATA ilévia - Abris à vélos
importDataFromApi('getBikeShelters')
    .then(response => {
        response.forEach((place) => {
            var coords = [place['geometry']['coordinates'][1], place['geometry']['coordinates'][0]];
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);
            parkings.push({
                lat: lat,
                lon: lon
            });
            addMarker(lat, lon, place['properties']['adresse'], iconAbriVelo);
        });
    })
    .catch(error => console.error('Erreur lors de l\'import des données :', error));

// import DATA Espaces de stationnement (TE et VAE en libre service)
importDataFromApi('getedpm_va_self_service')
    .then(response => {
        response.forEach((place) => {
            var coords = convertLambert93ToWGS84(place['geometry']['coordinates'][0], place['geometry']['coordinates'][1]);
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);
            parkings.push({
                lat: lat,
                lon: lon
            })
            // TODO Filter as Unchecked
            // addMarker(lat, lon, place['properties']['nom_voie'], iconParkingLS);
        })
    })
    .catch(error => console.error('Erreur lors de l\'import des données :', error));

// import DATA V'Lille - Disponibilité en temps réel
importDataFromApi('getVlille')
    .then(response => {
        response.forEach((place) => {
            var coords = [place['y'], place['x']];
            const lat = parseFloat(coords[0]);
            const lon = parseFloat(coords[1]);
            var txt = place['adresse'];
            if (place['etat'] == 'EN SERVICE') {
                txt += "<br>Vélos disponibles: " + place['nb_velos_dispo'] + "<br>Places disponibles: " + place['nb_places_dispo'];

                addMarker(lat, lon, txt, iconVLilleOn);
            } else {
                txt += "<br>Station hors service";
                addMarker(lat, lon, txt, iconVLilleOff);
            }
        });
    })
    .catch(error => console.error("Erreur lors de l'import des données :", error));



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
        function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Set the map view to the user's location
            map.setView([lat, lon], 14);

            // Add a marker at the user's location
            L.marker([lat, lon], { icon: iconUserPosition, interactive: false }).addTo(map);

            // Update the routing waypoints
            addRouteToNearestParking(lat, lon);
        },
        function () {
            console.warn("Localisation refusée ou indisponible.");
            askForAddress();
        }
    );
} else {
    console.warn("La géolocalisation n'est pas supportée par ce navigateur.");
    askForAddress();
}

function askForAddress() {
    // Prompt the user to enter their address
    var userAddress = prompt("Veuillez entrer votre adresse :");

    if (userAddress) {
        // Fetch the latitude and longitude using the Nominatim API
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userAddress)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = parseFloat(data[0].lat);
                    var lon = parseFloat(data[0].lon);

                    // Set the map view to the entered address location
                    map.setView([lat, lon], 14);

                    // Add a marker at the entered address location
                    L.marker([lat, lon], { icon: iconUserPosition, interactive: false }).addTo(map);

                    // Update the routing waypoints
                    addRouteToNearestParking(lat, lon);
                } else {
                    alert("Adresse introuvable. Veuillez réessayer.");
                    askForAddress();
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des coordonnées :", error);
                alert("Une erreur s'est produite lors de la récupération des coordonnées. Veuillez réessayer.");
                askForAddress();
            });
    } else {
        alert("Adresse non saisie. La géolocalisation est nécessaire pour continuer.");
    }
}

