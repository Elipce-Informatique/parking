/**
 * Retourne le dernier point du polyline tracé.
 * Ce point servira à placer le marker de l'afficheur.
 * @param poly : polyline obtenu par le plugin draw
 * @returns {*} : la dernière coordonnée de la ligne
 */
function getCoordAfficheurFromPolyline(poly) {
    var latlngs = poly._latlngs;

    return _.last(latlngs);
}

module.exports = {
    getCoordAfficheurFromPolyline: getCoordAfficheurFromPolyline
};