/**
 * Created by vivian on 30/04/2015.
 */
var React = require('react/addons');
var Bandeau = require('./react_bandeau');
var AuthentMixins = require('../../mixins/component_access');
/** *
 * Bandeau correspondant à une page de liste (Bouton créer uniquement)
 *
 * @param string titre : Titre du bandeau
 * @param string sousTitre : sous titre du bandeau (En gris en petit à coté du titre)
 * @param func onCreer : Action à exécuter
 */
var BandeauCalendrierVisu = React.createClass({
    mixins: [AuthentMixins],

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        sousTitre: React.PropTypes.string,
        onEditer: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            sousTitre: "",
            onEditer: Actions.bandeau.editer
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

        var btnList = [];
        // MODE DROITS DE MODIFICATION
        if (this.state.canModif) {
            btnList = [{
                libelle: Lang.get('global.edit'),
                style: "default", // VOIR DOC REACT-BOTSTRAP
                icon: "edit",  // VOIR DOC BOOTSTRAP ET NE PAS METTRE GLYPHICON DEVANT
                attrs: {},
                evts: {onClick: this.props.onEditer}
            }];
        }

        return (
            <Bandeau
                titre={this.props.titre}
                btnList={btnList}
                sousTitre={this.props.sousTitre} />
        );
    }
});

module.exports = BandeauCalendrierVisu;