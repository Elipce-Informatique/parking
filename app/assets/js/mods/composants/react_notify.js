var React = require('react/addons');

var StoreNotif = Reflux.createStore({
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        this.listenTo(Actions.notif.success, this.notifSuccess);
        this.listenTo(Actions.notif.warning, this.notifWarning);
        this.listenTo(Actions.notif.error, this.notifError);
        this.listenTo(Actions.notif.default, this.notifDefault);
        this.listenTo(Actions.notif.custom, this.notifCustom);
    },
    notifSuccess: function (message) {
        var data = {
            message: (typeof(message) == 'string') ? message : Lang.get('global.notif_success'),
            options: {
                className: 'success'
            }
        };
        this.trigger(data);
    },
    notifWarning: function (message) {
        var data = {
            message: (typeof(message) == 'string') ? message : Lang.get('global.notif_warning'),
            options: {
                stclassNameyle: 'warn'
            }
        };
        this.trigger(data);
    },
    notifError: function (message) {
        var data = {
            message: (typeof(message) == 'string') ? message : Lang.get('global.notif_erreur'),
            options: {
                className: 'error'
            }
        };
        this.trigger(data);
    },
    notifDefault: function (message) {
        var data = {
            message: (typeof(message) == 'string') ? message : Lang.get('global.notif_default'),
            options: {
                className: 'info'
            }
        };
        this.trigger(data);
    },
    notifCustom: function(message, options){
        var data = {
            message: (typeof(message) == 'string') ? message : Lang.get('global.notif_default'),
            options: options
        };
        this.trigger(data);
    }
});

/**
 * Created by yann on 19/12/2014.
 *
 * @param name : nom a afficher dans le composant
 */
var Notify = React.createClass({

    mixins: [Reflux.ListenerMixin],

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        $.notify.defaults({
            // WHETHER TO HIDE THE NOTIFICATION ON CLICK
            clickToHide: true,
            // WHETHER TO AUTO-HIDE THE NOTIFICATION
            autoHide: true,
            // IF AUTOHIDE, HIDE AFTER MILLISECONDS
            autoHideDelay: 6370,
            // SHOW THE ARROW POINTING AT THE ELEMENT
            arrowShow: true,
            // ARROW SIZE IN PIXELS
            arrowSize: 5,
            // DEFAULT POSITIONS
            elementPosition: 'bottom right',
            globalPosition: 'top right',
            // DEFAULT STYLE
            style: 'bootstrap',
            // DEFAULT CLASS (STRING OR [STRING])
            className: 'info',
            // SHOW ANIMATION
            showAnimation: 'slideDown',
            // SHOW ANIMATION DURATION
            showDuration: 400,
            // HIDE ANIMATION
            hideAnimation: 'slideUp',
            // HIDE ANIMATION DURATION
            hideDuration: 200,
            // PADDING BETWEEN ELEMENT AND NOTIFICATION
            gap: 2
        });
        this.listenTo(StoreNotif, this.displayNotif);
    },

    render: function () {
        return <span key="uniquespankey"></span>;
    },
    displayNotif: function (data) {
        $.notify(data.message, data.options);
    }
});

module.exports = Notify;
