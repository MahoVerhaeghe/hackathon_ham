// == Initialisation ==
var map = L.map('map').setView([50.62925, 3.057256], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// == End of Initialisation ==

// == START Icon and Marker ==

var iconUserPosition = L.divIcon({
    html: '<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

var iconBikeBox = L.divIcon({
    html: '<div style="background-color: green; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    className: '',
    iconAnchor: [5, 5]
});

// == API Import ==

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

            if (objet.geom) {
                const geomMatch = objet.geom.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
                if (geomMatch) {
                    objet.lat = parseFloat(geomMatch[1]);
                    objet.lon = parseFloat(geomMatch[2]);
                }
            }

            return objet;
        });

        return objets;

    } catch (error) {
        console.error('Erreur lors de l\'import du CSV:', error);
        return [];
    }
}

// == Method to Add Marker ==
function addMarker(lat, lon, texte, icone) {
    L.marker([lat, lon], { icon: icone }).addTo(map)
        .bindPopup(texte);
}

// == User Position Handling ==

function handleUserPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Center the map on the user's position
    map.setView([lat, lon], 14);

    // Add a small blue marker for the user's position
    L.marker([lat, lon], { icon: iconUserPosition, interactive: false }).addTo(map);

    // Fetch the bicycle boxes and add them to the map
    importCSV('https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dsp_ilevia%3Ailevia_abrisvelos&OUTPUTFORMAT=csv').then(bicycleBoxes => {
        console.log(bicycleBoxes);
        bicycleBoxes.forEach(box => {
            addMarker(box.lat, box.lon, `Box ${box.id} - Available: ${box.available}`, iconBikeBox);
        });

        // After markers are added, route to the nearest box
        addRouteToNearestBox(lat, lon, bicycleBoxes);
    });
}

function handleLocationError() {
    // Fallback: Ask the user for location manually if geolocation fails
    const manualLat = prompt("Geolocation failed. Please enter your latitude:");
    const manualLon = prompt("Please enter your longitude:");

    if (manualLat && manualLon) {
        // Convert inputs to float and use them to set the user's position
        const lat = parseFloat(manualLat);
        const lon = parseFloat(manualLon);

        if (!isNaN(lat) && !isNaN(lon)) {
            // Center the map on the user's manual position
            map.setView([lat, lon], 14);

            // Add a small blue marker for the user's position
            L.marker([lat, lon], { icon: iconUserPosition, interactive: false }).addTo(map);

            // Fetch the bicycle boxes and add them to the map
            importCSV('https://data.lillemetropole.fr/geoserver/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=dsp_ilevia%3Ailevia_abrisvelos&OUTPUTFORMAT=csv').then(bicycleBoxes => {
                console.log(bicycleBoxes);
                bicycleBoxes.forEach(box => {
                    addMarker(box.lat, box.lon, `Box ${box.id} - Available: ${box.available}`, iconBikeBox);
                });

                // After markers are added, route to the nearest box
                addRouteToNearestBox(lat, lon, bicycleBoxes);
            });
        } else {
            alert("Invalid coordinates. Please try again.");
        }
    }
}

// == Check for Geolocation ==

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleUserPosition, handleLocationError);
} else {
    alert("Geolocation is not supported by this browser.");
    handleLocationError(); // Ask for manual input if geolocation is unavailable
}

// == Button to Refresh Location ==
function refreshLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleUserPosition, handleLocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// == Routing to the Nearest Bicycle Box ==

function addRouteToNearestBox(userLat, userLon, boxes) {
    let nearestBox = boxes[0];
    let minDistance = Infinity;

    boxes.forEach(box => {
        const distance = getDistance(userLat, userLon, box.lat, box.lon);
        if (distance < minDistance) {
            nearestBox = box;
            minDistance = distance;
        }
    });

    L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLon),
            L.latLng(nearestBox.lat, nearestBox.lon)
        ]
    }).addTo(map);
}

// == Function to Calculate Distance Between Two Coordinates (in meters) ==
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
