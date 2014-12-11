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
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {attributes:{}, evts:{}};
    },

    render: function() {
        var classBtn          = 'btn btn-default';

        /*                               Code HTML                          */
        /* On met les attributs et les évènement sur le label car           */
        /* il s'agit d'un composant bootstrap qui cache le input            */
        /* on a donc que le label pour récupérer les évènement et les infos */
        return (
            <label className={classBtn} {...this.props.evts} {...this.props.attributes}>
                <input type="radio" name={this.props.name} />{this.props.libelle}
            </label>
        );
    }
});

module.exports = ReactRadioBtsp;