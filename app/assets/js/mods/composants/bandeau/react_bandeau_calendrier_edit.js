/**
 * Created by vivian on 30/04/2015.
 */
var React = require('react/addons');
var Bandeau = require('./react_bandeau');
var AuthentMixins = require('../../mixins/component_access');
/** *
 * Bandeau d'édition du calendrier
 *
 * @param string titre : Titre du bandeau
 * @param string sousTitre : sous titre du bandeau (En gris en petit à coté du titre)
 * @param func onCreer : Action à exécuter
 */
var BandeauCalendrierEdit = React.createClass({
    mixins: [AuthentMixins],

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        sousTitre: React.PropTypes.string,
        jours: React.PropTypes.element,
        onRetour: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            sousTitre: ""
        };
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {

        return (
            <Bandeau
                titre={this.props.titre}
                sousTitre={this.props.sousTitre}
                rightElements={this.props.jours}
                onRetour={this.props.onRetour} />
        );
    }
});

module.exports = BandeauCalendrierEdit;