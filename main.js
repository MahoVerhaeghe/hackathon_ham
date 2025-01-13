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



// == END Icon and Marker ==





// == START API Import ==

/**
 * METHODE TEMPORAIRE POUR POUVOIR IMPORTER DES DONNEES, RETOURNE DES DONNEES SOUS FORME D'OBJET
 * @param {*} path chemin vers le fichier
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

