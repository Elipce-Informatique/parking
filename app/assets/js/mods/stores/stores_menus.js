/**
 * Created by yann on 08/12/2014.
 */

var actionMenuTopDidMount = Actions.menu.menu_top_did_mount;
var actionMenuLeftDidMount = Actions.menu.menu_left_did_mount;
/**
 * Gère les données à afficher dans la lsite des items de menu top
 */
module.exports.menu_top_items = Reflux.createStore({
    getInitialState: function() {
        var data = Auth.menu_top.items;
        data.forEach(function (item, i) {
            item.active = false;
            item.accessible = (item.accessible ? true : false);

            data[i] = item;
        });
        return data;
    },
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(actionMenuTopDidMount, this.fetchMenuData);
    },
    fetchMenuData: function () {
        var data = Auth.menu_top.items;
        data.forEach(function (item, i) {
            item.active = false;
            item.accessible = (item.accessible ? true : false);

            data[i] = item;
        });
        this.trigger(data);
    }
});


/**
 * Gère les données à afficher dans le menu utilisateur (menu top)
 */
module.exports.menu_top_user = Reflux.createStore({

    getInitialState: function() {
        return Auth.menu_top.user;
    },
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(actionMenuTopDidMount, this.fetchUserData);
    },
    fetchUserData: function () {
        this.trigger(Auth.menu_top.user);
    }
});

/**
 * Gère les données à afficher dans la lsite des items de menu left
 */
module.exports.menu_left = Reflux.createStore({
    getInitialState: function() {
        return {data: Auth.menu_left};
    },
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(actionMenuLeftDidMount, this.fetchData);
    },
    fetchData: function () {
        this.trigger(Auth.menu_left);
    }
});

