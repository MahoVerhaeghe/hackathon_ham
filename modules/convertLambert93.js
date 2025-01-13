// convertLambert93.js

// Fonction de conversion de Lambert93 vers WGS84
function convertLambert93ToWGS84(x, y) {
    // Paramètres de l'ellipsoïde GRS80/WGS84
    const a = 6378137.0;                // Demi-grand axe (en mètres)
    const e = 0.0818191910428158;       // Première excentricité

    // Paramètres de la projection Lambert 93
    const n = 0.7256077650532670;
    const C = 11754255.426096;          // Constante de projection
    const Xs = 700000.0;
    const Ys = 12655612.0499;
    const lonMeridienOrigine = 3 * Math.PI / 180;  // Longitude d'origine en radians

    // Calcul intermédiaire
    const dx = x - Xs;
    const dy = Ys - y;
    const R = Math.sqrt(dx * dx + dy * dy);
    const gamma = Math.atan(dx / dy);
    const latiso = -1 / n * Math.log(R / C);

    // Calcul de la latitude via itérations
    let lat = 2 * Math.atan(Math.exp(latiso)) - Math.PI / 2;
    let lat_prev;
    do {
        lat_prev = lat;
        lat = 2 * Math.atan(Math.pow((1 + e * Math.sin(lat_prev)) / (1 - e * Math.sin(lat_prev)), e / 2) * Math.exp(latiso)) - Math.PI / 2;
    } while (Math.abs(lat - lat_prev) > 1e-11);

    // Calcul de la longitude
    const lon = lonMeridienOrigine + gamma / n;

    // Conversion de radians en degrés
    const latDeg = lat * 180 / Math.PI;
    const lonDeg = lon * 180 / Math.PI;

    return [latDeg, lonDeg];  // Retourne [latitude, longitude] en degrés
}

// Exporte la fonction pour la rendre accessible dans d'autres fichiers
export { convertLambert93ToWGS84 };
