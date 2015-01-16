/**
 * Created by yann on 16/01/2015.
 */
var Bandeau = require('./react_bandeau');
/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau correspondant à une page de visu de données (ex: fiche utilisateur en mode visu)
 *
 * @param string titre : Titre du bandeau
 * @param string sousTitre : sous titre du bandeau (En gris en petit à coté du titre)
 */
var BandeauProfilVisu = React.createClass({

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        sousTitre: React.PropTypes.string,
        onRetour: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            sousTitre: "",
            onRetour: Actions.bandeau.retour
        };
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    render: function () {
        return (<Bandeau titre={this.props.titre} sousTitre={this.props.sousTitre} onRetour={this.props.onRetour} />);
    }
});

module.exports = BandeauProfilVisu;