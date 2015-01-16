/**
 * Created by yann on 16/01/2015.
 */

/**
 * Created by yann on 16/12/2014.
 */
var Bandeau = require('./react_bandeau');
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');

var AuthentMixins = require('../mixins/component_access');
/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau générique à utiliser à chaque fois avec en paramètre le type de bandeau qu'on veut
 *
 * @param string bandeauType : Type du bandeau à afficher
 * @param string module_url : pour les droits d'accès au bandeau
 */
var BandeauVisu = React.createClass({
        mixins: [AuthentMixins],

        propTypes: {
            bandeauType: React.PropTypes.string.isRequired,
            module_url: React.PropTypes.string.isRequired
        },

        getDefaultProps: function () {
            return {};
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
            var bandeau = {};

            // MODE DROITS DE MODIFICATION
            if (this.state.Auth.canModif) {
                switch (this.props.bandeauType) {
                    case 'edition':
                    case 'creation':
                        bandeau = <BandeauEdition {...this.props} />;
                        break;
                    case 'visu':
                        bandeau = <BandeauVisu {...this.props} />;
                        break;
                    case 'liste':
                        bandeau = <BandeauListe {...this.props} />;
                        break;
                    default:
                        break;
                }
            }
            // MODE LECTURE SEULE
            else {

            }
            return bandeau;
        }

    })
    ;

module.exports = BandeauVisu;