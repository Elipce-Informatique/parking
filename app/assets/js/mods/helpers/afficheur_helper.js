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

function createAfficheursMapFromAfficheursBDD(afficheursBDD, afficheursStyle){

}

module.exports = {
    getCoordAfficheurFromPolyline: getCoordAfficheurFromPolyline,
    createAfficheursMapFromAfficheursBDD: createAfficheursMapFromAfficheursBDD,
    style: {
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        fillColor: '#000000'
    }
};