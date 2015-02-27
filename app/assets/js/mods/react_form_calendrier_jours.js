// COMPOSANTS REACT
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var Color = require('./composants/react_color').ColorPickerEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;
var InputRadioEditable = Field.InputRadioEditable;
var InputPasswordEditable = Field.InputPasswordEditable;
var Form = Field.Form;
var InputTimeEditable = Field.InputTimeEditable;

// Mixin
var FormValidationMixin = require('./mixins/form_validation');

/**
 * Formulaire de jours prédéfinis
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param idJours: ID table jour_calendrier
 */
var FormJours = React.createClass({

    mixins: [Reflux.ListenerMixin, FormValidationMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        jourData : React.PropTypes.object,
        idJour: React.PropTypes.number
    },
    getDefaultProps: function () {
        return {
            jourData: {},
            idJour: 0
        }
    },

    render: function () {

        return (
            <Form attributes={{id:"form_jours"}}>
                <Row />
                <InputTextEditable
                    attributes={{
                        label: Lang.get('calendrier.jours.tableau.nom'),
                        name: "nom",
                        value: this.props.jourData.libelle,
                        required: true,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }}
                    editable={this.props.editable}
                    evts={{onChange: this.test}}/>
                <InputTimeEditable
                    attributes={{
                        label: Lang.get('calendrier.jours.tableau.ouvert'),
                        name: "ouverture",
                        value: this.props.jourData.ouverture,
                        required: true,
                        wrapperClassName: 'col-md-1',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }}
                    editable={this.props.editable} />
                <InputTimeEditable
                    attributes={{
                        label: Lang.get('calendrier.jours.tableau.fermer'),
                        name: "fermeture",
                        value: this.props.jourData.fermeture,
                        required: true,
                        wrapperClassName: 'col-md-1',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }}
                    editable={this.props.editable} />
                <Color
                    label = {Lang.get('calendrier.jours.tableau.couleur')}
                    attributes={{
                        name: "couleur",
                        required: true,
                        value: this.props.jourData.couleur
                    }}
                    editable={this.props.editable}
                    mdLabel={1}
                    mdColor={2}
                />

            </Form>
        );
    }

});
module.exports.Composant = FormJours;
