var AccessMixin = require('./mixins/component_access');

/**
 * Created by yann on 02/12/2014.
 *
 * Composant React correspondant à un module de la page d'accueil
 * @param titre : Titre du block
 * @param texte : Texte du paragrahpe
 * @param bouton : Texte du bouton
 * @param module_url : Url éventuelle du module correspondant
 */
var BlockAccueil = React.createClass({
    mixins: [AccessMixin],
    propTypes: {
        titre: React.PropTypes.string.isRequired,
        texte: React.PropTypes.string.isRequired,
        bouton: React.PropTypes.string.isRequired,
        bouton_url: React.PropTypes.string,
        module_url: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {bouton_url: "#"};
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        return (
            <div>
                <h2>{this.props.titre}</h2>
                <p>{this.props.texte}</p>
                <p>
                    <a className="btn btn-default" href={this.props.bouton_url} role="button">{this.props.bouton} »</a>
                </p>
            </div>
        );
    }
});

module.exports = BlockAccueil;