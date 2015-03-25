/**
 * Converti un angle exprimé en radians vers les degrés
 * @param angle float : angle en Radians
 * @returns {number} l'angle en degrés
 */
function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

/**
 * Converti un angle exprimé en degrés vers les radians
 * @param angle float : angle en degrés
 * @returns {number} l'angle en radians
 */
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

module.exports = {
    toDegrees: toDegrees,
    toRadians: toRadians
};