/**
 * Created by yann on 27/01/2015.
 *
 * Store permettant la gestion de toutes les actions liés à une carte.
 */
var store = Reflux.createStore({
    listenables: Actions.map,
    getInitialState: function () {
        return {};
    },
    // INITIAL SETUP
    init: function () {
    },
    onMap_initialized: function (data) {
        console.log(data);
    },
    onDraw_created: function (data) {
        console.log(data);
    },
    onDraw_deleted: function (data) {
        console.log(data);
    },
    onDraw_drawstart: function (data) {
        console.log(data);
    },
    onDraw_drawstop: function (data) {
        console.log(data);
    },
    onDraw_editstart: function (data) {
        console.log(data);
    },
    onDraw_editstop: function (data) {
        console.log(data);
    },
    onDraw_deletestart: function (data) {
        console.log(data);
    },
    onDraw_deletestop: function (data) {
        console.log(data);
    },
    onMode_place: function (data) {
        console.log(data);
    },
    onMode_allee: function (data) {
        console.log(data);
    },
    onMode_zone: function (data) {
        console.log(data);
    },
    onMode_afficheur: function (data) {
        console.log(data);
    }
});

module.exports = store;