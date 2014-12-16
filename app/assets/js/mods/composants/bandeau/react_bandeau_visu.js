/**
 * Created by yann on 16/12/2014.
 */
var Bandeau = require('./react_bandeau');
/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau correspondant à une page de visu de données (ex: fiche utilisateur en mode visu)
 *
 * @param string titre : Titre du bandeau
 * @param func onRetour : Fonction de retour facultative (Sinon Actions.bandeau.retour)
 * @param func onCreer : Fonction de création facultative (Sinon Actions.bandeau.creer)
 * @param func onEditer : Fonction d'édition facultative (Sinon Actions.bandeau.editer)
 * @param func onSupprimer : Fonction de suppression facultative (Sinon Actions.bandeau.supprimer)
 */
var BandeauVisu = React.createClass({

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        onRetour: React.PropTypes.func,
        onCreer: React.PropTypes.func,
        onEditer: React.PropTypes.func,
        onSupprimer: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            onRetour: Actions.bandeau.retour,
            onCreer: Actions.bandeau.creer,
            onEditer: Actions.bandeau.editer,
            onSupprimer: Actions.bandeau.supprimer
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

        var btnList = [{
            libelle: Lang.get('global.create'),
            style: "default", // VOIR DOC REACT-BOTSTRAP
            icon: "plus-sign",  // VOIR DOC BOOTSTRAP ET NE PAS METTRE GLYPHICON DEVANT
            attrs: {},
            evts: {onClick: this.props.onCreer}
        }, {
            libelle: Lang.get('global.edit'),
            style: "default", // VOIR DOC REACT-BOTSTRAP
            icon: "edit",  // VOIR DOC BOOTSTRAP ET NE PAS METTRE GLYPHICON DEVANT
            attrs: {},
            evts: {onClick: this.props.onEditer}
        }, {
            libelle: Lang.get('global.del'),
            style: "default", // VOIR DOC REACT-BOTSTRAP
            icon: "remove-sign",  // VOIR DOC BOOTSTRAP ET NE PAS METTRE GLYPHICON DEVANT
            attrs: {},
            evts: {onClick: this.props.onSupprimer}
        }];
        return (<Bandeau titre={this.props.titre} btnList={btnList} onRetour={this.props.onRetour}  />);
    }
});

module.exports = BandeauVisu;