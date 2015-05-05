/**
 * Created by vivian on 30/04/2015
 */
var React = require('react/addons');
var Bandeau = require('./react_bandeau');
var bHelper = require('../../helpers/bandeau_helper').type_btn;

/**
 * Created by yann on 16/12/2014.
 *
 * Bandeau sans boutons
 *
 * @param string titre : Titre du bandeau
 * @param string sousTitre : sous titre du bandeau (En gris en petit à coté du titre)
 */
var BandeauVide = React.createClass({

    propTypes: {
        form_id: React.PropTypes.string.isRequired,
        titre: React.PropTypes.string.isRequired,
        sousTitre: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            sousTitre: ""
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
        switch (this.props.mode) {
            case 0:
                sousTitre = this.props.sousTitre + Lang.get('global.creation');
                break;
            case 1:
                sousTitre = this.props.sousTitre;
                break;
            default:
                sousTitre = this.props.sousTitre;
                break;
        }
        return (<Bandeau
            titre={this.props.titre}
            form_id={this.props.form_id}
            sousTitre={sousTitre} />);
    }
});

module.exports = BandeauVide;