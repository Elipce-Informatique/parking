// COMPOSANTS REACT
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var Color = require('./composants/react_color').ColorPickerEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var Form = Field.Form;
var InputTimeEditable = Field.InputTimeEditable;


/**
 * Formulaire de jours prédéfinis
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param idJours: ID table jour_calendrier
 */
var FormJours = React.createClass({

    mixins: [Reflux.ListenerMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        detailJour : React.PropTypes.object,
        idJour: React.PropTypes.number,
        validationLibelle :  React.PropTypes.object // Permet de colorer le champ en fonction des vérifications métiers effectuées dans la page
    },
    getDefaultProps: function () {
        return {
            detailJour: {},
            idJour: 0,
            validationLibelle : {}
        }
    },

    render: function () {


        return (
            <Form attributes={{id:"form_jours"}}>
                <Row />
                <InputTextEditable
                    attributes={_.extend({
                        label: Lang.get('calendrier.jours.tableau.nom'),
                        name: "libelle",
                        value: this.props.detailJour.libelle,
                        required: true,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }, this.props.validationLibelle)}
                    editable={this.props.editable}
                    evts={{onChange: this.test}}/>
                <InputTimeEditable
                    attributes={{
                        label: Lang.get('calendrier.jours.tableau.ouvert'),
                        name: "ouverture",
                        value: this.props.detailJour.ouverture,
                        required: true,
                        wrapperClassName: 'col-md-2',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }}
                    editable={this.props.editable} />
                <InputTimeEditable
                    attributes={{
                        label: Lang.get('calendrier.jours.tableau.fermer'),
                        name: "fermeture",
                        value: this.props.detailJour.fermeture,
                        required: true,
                        wrapperClassName: 'col-md-2',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }}
                    editable={this.props.editable} />
                <Color
                    label = {Lang.get('calendrier.jours.tableau.couleur')}
                    attributes={{
                        name: "couleur",
                        required: true,
                        value: this.props.detailJour.couleur
                    }}
                    editable={this.props.editable}
                    mdLabel={1}
                    mdColor={2}
                    labelClass="text-right"
                />

            </Form>
        );
    }

});
module.exports.Composant = FormJours;
