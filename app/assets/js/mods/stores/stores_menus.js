/**
 * Created by yann on 08/12/2014.
 */

var actionMenuDidMount = Actions.menu.menu_top_did_mount;
/**
 * Gère les données à afficher dans la lsite des items de menu top
 */
module.exports.menu_top_items = Reflux.createStore({
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(actionMenuDidMount, this.fetchMenuData);
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
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(actionMenuDidMount, this.fetchUserData);
    },
    fetchUserData: function () {
        var data = Auth.menu_top.user;
        this.trigger(data);
    }
});

