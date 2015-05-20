/**
 * Created by yann on 19/05/2015.
 */

/**
 * Retourne la valeur de la clé key dans l'objet. La recherche se fait récursivement
 * @param obj
 * @param key
 * @returns {Array}
 */
function findByKey(obj, key) {
    if (_.has(obj, key)) // or just (key in obj)
        return obj[key];

    var res = [];
    _.forEach(obj, function (v) {
        if (typeof v == "object" && (v = findByKey(v, key)).length)
            res.push.apply(res, v);
    });
    return res;
}

module.exports = {
    findByKey: findByKey
};