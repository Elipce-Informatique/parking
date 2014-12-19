/**
 * Created by yann on 16/12/2014.
 */
var Bandeau = require('./react_bandeau');
/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau correspondant à une page de modification ou création
 *
 * @param string titre : Titre du bandeau
 * @param number mode : 0 => création, 1 => édition autre => sous titre perso
 * @param string sousTitre : sous titre du bandeau (En gris en petit à coté du titre)
 * @param func onRetour : Fonction de retour facultative (Sinon Actions.bandeau.retour)
 * @param func onSauvegarder : Action à exécuter
 */
var BandeauEdition = React.createClass({

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        mode: React.PropTypes.number.isRequired,
        sousTitre: React.PropTypes.string,
        onRetour: React.PropTypes.func,
        onSauvegarder: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            sousTitre: "",
            onRetour: Actions.bandeau.retour,
            onSauvegarder: Actions.bandeau.sauvegarder
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
        var sousTitre = "";
        switch(this.props.mode){
            case 0:
                sousTitre = this.props.sousTitre + Lang.get('global.creation');
                break;
            case 1:
                sousTitre = this.props.sousTitre + Lang.get('global.edition');
                break;
            default:
                sousTitre = this.props.sousTitre;
                break;
        }
        var btnList = [{
            libelle: Lang.get('global.save'),
            style: "success", // VOIR DOC REACT-BOTSTRAP
            icon: "floppy-disk", // VOIR DOC BOOTSTRAP ET NE PAS METTRE GLYPHICON DEVANT
            attrs: {},
            evts: {onClick: this.props.onSauvegarder}
        }];
        return (<Bandeau titre={this.props.titre} btnList={btnList} onRetour={this.props.onRetour} sousTitre={sousTitre} />);
    }
});

module.exports = BandeauEdition;