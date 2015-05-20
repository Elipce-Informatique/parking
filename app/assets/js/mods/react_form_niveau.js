// COMPOSANTS REACT
var React = require('react/addons');
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var Select = Field.InputSelectEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var Form = Field.Form;
var Upload = Field.InputFile;


/**
 * Formulaire de niveaux
 */
var FormNiveau = React.createClass({

    mixins: [Reflux.ListenerMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        parkings : React.PropTypes.array.isRequired, // Données de la combo parkings
        detailNiveau : React.PropTypes.object,
        idNiveau: React.PropTypes.number,
        validationLibelle :  React.PropTypes.object // Permet de colorer le champ en fonction des vérifications métiers effectuées dans la page
    },
    getDefaultProps: function () {
        return {
            detailNiveau: {},
            idNiveau: 0,
            validationLibelle : {}
        }
    },

    render: function () {

        return (
            <Form attributes={{id:"form_niveau"}}>
                <Row />
                <Select
                    attributes={{
                        label: Lang.get('global.parking'),
                        name: "parking_id",
                        selectCol: 4,
                        labelCol: 1,
                        required: true
                    }}
                    data         ={this.props.parkings}
                    editable     ={this.props.editable}
                    selectedValue={this.props.detailNiveau.parking_id}
                    placeholder  ={Lang.get('global.selection')}
                    labelClass = "text-right"/>

                <InputTextEditable
                    attributes={_.extend({
                        label: Lang.get('global.niveau'),
                        name: "libelle",
                        value: this.props.detailNiveau.libelle,
                        required: true,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }, this.props.validationLibelle)}
                    editable={this.props.editable}/>

                <InputTextEditable
                    attributes={{
                        label: Lang.get('global.description'),
                        name: "description",
                        value: this.props.detailNiveau.description,
                        required: false,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-1 text-right',
                        groupClassName: 'row'
                    }}
                    area = {true}
                    editable={this.props.editable}/>

                <Upload
                    name="url"
                    typeOfFile="img"
                    alertOn={true}
                    libelle={Lang.get('administration_parking.niveau.download_plan')}
                    attributes={{required:true}}
                />

            </Form>
        );
    }

});
module.exports.Composant = FormNiveau;
