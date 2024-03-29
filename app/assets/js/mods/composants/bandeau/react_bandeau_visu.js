/**
 * Created by yann on 16/12/2014.
 */
var React = require('react/addons');
require('sweetalert');
var Bandeau = require('./react_bandeau');
/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau correspondant à une page de visu de données (ex: fiche utilisateur en mode visu)
 *
 * @param string titre : Titre du bandeau
 * @param string sousTitre : sous titre du bandeau (En gris en petit à coté du titre)
 * @param func onRetour : Fonction de retour facultative (Sinon Actions.bandeau.retour)
 * @param func onCreer : Fonction de création facultative (Sinon Actions.bandeau.creer)
 * @param func onEditer : Fonction d'édition facultative (Sinon Actions.bandeau.editer)
 * @param func onSupprimer : Fonction de suppression facultative (Sinon Actions.bandeau.supprimer)
 * @param bool confirmationOnSupprimer : Boite de confirmation si true, sinon appel de Actions.bandeau.supprimer directement
 */
var BandeauVisu = React.createClass({

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        sousTitre: React.PropTypes.string,
        onRetour: React.PropTypes.func,
        onCreer: React.PropTypes.func,
        onEditer: React.PropTypes.func,
        onSupprimer: React.PropTypes.func,
        confirmationOnSupprimer : React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            sousTitre: "",
            onRetour: Actions.bandeau.retour,
            onCreer: Actions.bandeau.creer,
            onEditer: Actions.bandeau.editer,
            onSupprimer: Actions.bandeau.supprimer, // Supression métier après boite confirmation
            confirmationOnSupprimer : true
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

    /**
     * Boite de dialogue de suppression
     */
    confirmSuppression: function () {
        swal({
            title: Lang.get('global.suppression_titre'),
            text: Lang.get('global.suppression_corps'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: Lang.get('global.ok'),
            cancelButtonText: Lang.get('global.annuler'),
            closeOnConfirm: true
        }, function (isConfirm) {
            this.props.onSupprimer();
        }.bind(this));
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
            evts: {onClick: this.confirmSuppression}
        }];

        // Pas de boite de confirmation sur suppression
        if(!this.props.confirmationOnSupprimer){
            btnList[2]['evts'] = {onClick: this.props.onSupprimer}
        }

        return (
            <Bandeau
                titre={this.props.titre}
                btnList={btnList}
                onRetour={this.props.onRetour}
                sousTitre={this.props.sousTitre}
            />);
    }
});

module.exports = BandeauVisu;