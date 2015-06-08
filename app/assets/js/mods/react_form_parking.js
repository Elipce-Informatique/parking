// COMPOSANTS REACT
var React = require('react/addons');
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var Color = require('./composants/react_color').ColorPickerEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var Form = Field.Form;
var InputNumberEditable = Field.InputNumberEditable;
var Validator = require('validator');
var Select = Field.InputSelectEditable;

/**
 * Formulaire de jours prédéfinis
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param idParkings: ID table jour_calendrier
 */
var FormParking = React.createClass({

    mixins: [Reflux.ListenerMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        detailParking: React.PropTypes.object,
        idParking: React.PropTypes.number,
        validationLibelle: React.PropTypes.object, // Permet de colorer le champ en fonction des vérifications métiers effectuées dans la page
        users: React.PropTypes.array
    },
    getDefaultProps: function () {
        return {
            detailParking: {},
            idParking: 0,
            validationLibelle: {}
        }
    },

    render: function () {
        //console.log('render form detail: %o',this.props.detailParking);
        return (
            <Form attributes={{id: "form_parking"}}>
                <Row />
                <InputTextEditable
                    attributes={_.extend({
                        label: Lang.get('global.parking'),
                        name: "libelle",
                        value: this.props.detailParking.libelle,
                        required: true,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2 text-right',
                        groupClassName: 'row'
                    }, this.props.validationLibelle)}
                    editable={this.props.editable}/>

                <InputTextEditable
                    attributes={{
                        label: Lang.get('global.description'),
                        name: "description",
                        value: this.props.detailParking.description,
                        required: false,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2 text-right',
                        groupClassName: 'row'
                    }}
                    editable={this.props.editable}
                    area = {true} />

                <InputTextEditable
                    attributes={{
                        label: Lang.get('global.ip'),
                        name: "ip",
                        value: this.props.detailParking.ip,
                        required: true,
                        wrapperClassName: 'col-md-2',
                        labelClassName: 'col-md-2 text-right',
                        groupClassName: 'row',
                        maxLength: 15
                    }}
                    editable={this.props.editable}
                    validator= {function (val, props, state) {
                        // Champ obligatoire vide
                        if (val.length == 0 && typeof(props.attributes.required) != 'undefined' && props.attributes.required) {
                            return {isValid: false, style: 'default', tooltip: ''};
                        }
                        // Champ facultatif vide
                        else if (val.length == 0) {
                            return {isValid: true, style: 'default', tooltip: ''};
                        }
                        // Champ non vide mail valide
                        else if (Validator.isIP(val)) {
                            return {isValid: true, style: 'success', tooltip: ''};
                        }
                        // Champ non vide mail invalide
                        else {
                            return {isValid: false, style: 'error', tooltip: Lang.get('global.validation_erreur_ip')};
                        }
                    }}/>

                <InputNumberEditable
                    attributes={{
                        label: Lang.get('global.v4id'),
                        name: "v4_id",
                        value: this.props.detailParking.v4_id,
                        required: true,
                        wrapperClassName: 'col-md-2',
                        labelClassName: 'col-md-2 text-right',
                        groupClassName: 'row'
                    }}
                    editable={this.props.editable}
                    min={0}/>

                <Select
                    attributes={{
                        label: Lang.get('administration_parking.parking.users'),
                        name: "utilisateurs",
                        selectCol: 4,
                        labelCol: 2,
                        required: false
                    }}
                    data         ={this.props.users}
                    editable     ={this.props.editable}
                    selectedValue={this.props.detailParking.utilisateurs}
                    placeholder  ={Lang.get('global.selection')}
                    labelClass = "text-right"
                    key={Date.now()}
                    multi={true}/>

            </Form>
        );
    }

});
module.exports.Composant = FormParking;
