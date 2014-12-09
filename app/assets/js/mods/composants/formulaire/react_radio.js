/**
 * Created by Pierre on 08/12/2014.
 */

/**
 *  Composant React correspondant à un radio bouton avec style bootstrap
 */
var ReactRadioBtsp = React.createClass({

    /**
     *  Propriétés
     */
    propTypes: {
        name:    React.PropTypes.string.isRequired,          /* Name du radio bouton */
        libelle: React.PropTypes.string.isRequired,          /* libelle à afficher   */
        uniqueIdentifier: React.PropTypes.string.isRequired, /* identifiant unique afin de ne pas avoir de warning react */
                                                             /* il lui sera ajouter le name du radioBouton               */
        attributes: React.PropTypes.object
    },

    render: function() {
        var classBtn         = 'btn btn-default';
        var uniqueIdentifier = '' + this.props.name + this.props.uniqueIdentifier;
        var uniqueIdentifier2 = '' + this.props.name + this.props.uniqueIdentifier + '2';

        /* Code HTML */
        return (
            <label className={classBtn} key={uniqueIdentifier}>
                <input type="radio" key={uniqueIdentifier2} name={this.props.name} {...this.props.attributes} /> {this.props.libelle}
            </label>
        );
    }
});

module.exports = ReactRadioBtsp;