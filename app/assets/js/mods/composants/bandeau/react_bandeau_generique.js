/**
 * Created by yann on 16/01/2015.
 */

/**
 * Created by yann on 16/12/2014.
 */
var React = require('react/addons');
var Bandeau = require('./react_bandeau');
var BandeauListe = require('./react_bandeau_liste');
var BandeauVisu = require('./react_bandeau_visu');
var BandeauEdition = require('./react_bandeau_edition');
var BandeauProfilVisu = require('./react_bandeau_profil_visu');
var BandeauProfilVisuRetour = require('./react_bandeau_profil_visu_retour');

var AuthentMixins = require('../../mixins/component_access');

// HELPERS
var pageState = require('../../helpers/page_helper').pageState;
/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau générique à utiliser à chaque fois avec en paramètre le type de bandeau qu'on veut
 *
 * @param string bandeauType : Type du bandeau à afficher edition|creation|visu|liste
 * @param string module_url : pour les droits d'accès au bandeau
 */
var BandeauGenerique = React.createClass({
    mixins: [AuthentMixins],

    propTypes: {
        bandeauType: React.PropTypes.number.isRequired,
        module_url: React.PropTypes.string.isRequired,
        form_id: React.PropTypes.string,
        avecRetour: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            avecRetour: false,
            form_id: ''
        };
    },
    getInitialState: function () {
        return {};
    },
    componentWillMount: function () {
    },

    componentDidMount: function () {
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var bandeau = {};
        //console.log('form id depuis le bandeau généraique' + this.props.form_id);

        // MODE DROITS DE MODIFICATION
        if (this.state.canModif) {
            switch (this.props.bandeauType) {
                case pageState.edition:
                case pageState.creation:
                    bandeau = <BandeauEdition key="bandeauGenCrea" {...this.props} />;
                    break;
                case pageState.visu:
                    bandeau = <BandeauVisu key="bandeauGenVisu" {...this.props} />;
                    break;
                case pageState.liste:
                    bandeau = <BandeauListe key="bandeauGenListe" {...this.props} />;
                    break;
                default:
                    bandeau = <BandeauListe key="bandeauGenListe" {...this.props} />;
                    break;
            }
        }
        // MODE LECTURE SEULE
        else {
            switch (this.props.bandeauType) {
                case pageState.liste:
                    bandeau = <BandeauProfilVisu key="bandeauGenListeVisu" {...this.props} />;
                    break;
                default:
                    bandeau = <BandeauProfilVisuRetour key="bandeauGenListeVisuRetour" {...this.props} />;
                    break;
            }
        }
        return bandeau;
    }

});

module.exports = BandeauGenerique;