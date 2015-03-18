var React = require('react/addons');
var Button = ReactB.Button;
var Glyphicon = ReactB.Glyphicon;

/**
 * Created by yann on 16/03/2015.
 *
 * Bouton de type react Bootstrap pour lancer l'action 'validation.verify_form_save' quand il est cliqué.
 * L'id du form concerné est passé en paramètres de cette action.
 *
 * @param form_id : string correspondant à l'id du form auquel est associé ce bouton.
 *
 */
var ButtonSave = React.createClass({

    propTypes: {
        form_id: React.PropTypes.string.isRequired,
        libelle: React.PropTypes.string,
        evts   : React.PropTypes.object,
        attrs  : React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            libelle: Lang.get('global.save'),
            evts: {},
            attrs: {}
        }
    },
    onClick: function () {
        Actions.validation.verify_form_save(this.props.form_id);
    },
    render: function () {
        //console.log('form id depuis le button' + this.props.form_id);
        return (
            <Button {...this.props.attrs} {...this.props.evts} onClick={this.onClick} bsStyle="success" form={this.props.form_id} >
                <Glyphicon glyph="floppy-disk"/>{this.props.libelle}
            </Button>);
    }
});

module.exports = ButtonSave;