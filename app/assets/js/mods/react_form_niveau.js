// COMPOSANTS REACT
var React = require('react/addons');
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var Select = Field.InputSelectEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var Glyph = ReactB.Glyphicon;
var Form = Field.Form;
var Upload = Field.InputFile;
var Photo = require('./composants/react_photo').PhotoEditable;


/**
 * Formulaire de niveaux
 */
var FormNiveau = React.createClass({

    mixins: [Reflux.ListenerMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        parkings: React.PropTypes.array.isRequired, // Données de la combo parkings
        detailNiveau: React.PropTypes.object,
        idNiveau: React.PropTypes.number,
        validationLibelle: React.PropTypes.object, // Permet de colorer le champ en fonction des vérifications métiers effectuées dans la page
        nbUpload: React.PropTypes.number
    },
    getDefaultProps: function () {
        return {
            detailNiveau: {},
            idNiveau: 0,
            validationLibelle: {},
            nbUpload: 1
        }
    },

    /**
     * Ajoute un plan au render
     */
    addPlan: function () {
        //this.setState({nbUpload : (this.props.nbUpload + 1) });
        Actions.niveau.add_upload();
    },

    /**
     * Génère les composants plan à afficher
     * @returns {Array}
     */
    getPlans: function () {

        var retour = [];

        // Mode edition
        if (this.props.idNiveau !== 0) {
            // Parcours des plans du niveau
            plans = _.map(this.props.detailNiveau.plans, function (plan) {
                return (
                    <Row>
                        <InputTextEditable
                            attributes={{
                                label: Lang.get('global.plan'),
                                name: "plan",
                                value: this.props.detailNiveau.plans.libelle,
                                required: true,
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-1 text-right',
                                groupClassName: 'col-md-5'
                            }}
                            editable={this.props.editable}/>
                        <Col md={2}>
                            <Upload
                                name="url"
                                typeOfFile="img"
                                alertOn={true}
                                libelle={Lang.get('administration_parking.niveau.modif_plan')}
                                attributes={{
                                    required: true
                                }}
                            />
                        </Col>
                        <Col md={2}>
                            <Photo
                                src = {this.props.detailNiveau.plans.url}/>
                        </Col>
                    </Row>
                );
            })
        }
        // Mode création
        else {
            console.log('NB upload : ' + this.props.nbUpload);
            // Bouton "plus" seulement sur la dernière ligne
            var plus = '';

            // Nb bouton upload
            for (var i = 0; i < this.props.nbUpload; i++) {

                // Dernière ligne
                if (i === (this.props.nbUpload - 1)) {
                    plus = (
                        <Col md={2}>
                            <Button
                                onClick={this.addPlan}>
                                <Glyph
                                    glyph='plus'/>
                            </Button>
                        </Col>
                    );
                }

                // Ligne complète
                retour.push(
                    <Row key={i}>
                        <Col
                            md={1}
                            className="text-right">
                            <label>{Lang.get('global.plan')}</label>
                        </Col>
                        <Col md={4}>
                            <InputTextEditable
                                attributes={{
                                    name: "plan" + i,
                                    required: true,
                                    value: this.props.detailNiveau['plan' + i]
                                }}
                                editable={this.props.editable}/>
                        </Col>
                        <Col md={2}>
                            <Upload
                                key={i}
                                name={"url" + i}
                                typeOfFile="img"
                                alertOn={true}
                                libelle={Lang.get('administration_parking.niveau.download_plan')}
                                attributes={{
                                    required: true
                                }}
                            />
                        </Col>
                    {plus}
                    </Row>
                );
            }
        }
        return retour;
    },

    render: function () {

        var plans = this.getPlans();

        return (
            <Form attributes={{id: "form_niveau"}}>
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
                    labelClass = "text-right"
                    key={Date.now()}/>

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

            {plans}
            </Form>
        );
    }

});
module.exports.Composant = FormNiveau;
