/**
 * Created by yann on 16/12/2014.
 */
var Bandeau = require('./react_bandeau');
/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau correspondant à une page de liste (Bouton créer uniquement)
 *
 * @param string titre : Titre du bandeau
 * @param func onCreer : Action à exécuter
 */
var BandeauListe = React.createClass({

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        onCreer: React.PropTypes.func.isRequired
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

        var btnList = [{
            libelle: Lang.get('global.create'),
            style: "default", // VOIR DOC REACT-BOTSTRAP
            icon: "plus-sign",  // VOIR DOC BOOTSTRAP ET NE PAS METTRE GLYPHICON DEVANT
            attrs: {},
            evts: {onClick: this.props.onCreer}
        }];
        return (<Bandeau titre={this.props.titre} btnList={btnList} />);
    }
});

module.exports = BandeauListe;