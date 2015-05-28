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
     * Supprime un plan au render
     */
    delPlan: function () {
        //this.setState({nbUpload : (this.props.nbUpload + 1) });
        Actions.niveau.del_upload();
    },

    /**
     * Généreles boutons plus moins en fonction de l'index passé en param
     * @param i: index correspondant au  numéro de ligne de plan
     * @param nbPlans: nb total de plans
     */
    generatePlusMinus: function (i, nbPlans) {
        var plus = '';
        if (this.props.editable) {
            // Dernière ligne
            if (i === (nbPlans - 1)) {
                // Première ligne
                if (i == 0) {
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
                // Autre que 1ere ligne
                else {
                    plus = (
                        <Col md={2}>
                            <Button
                                onClick={this.addPlan}>
                                <Glyph
                                    glyph='plus'/>
                            </Button>
                            <Button
                                onClick={this.delPlan}>
                                <Glyph
                                    glyph='minus'/>
                            </Button>
                        </Col>
                    );
                }
            }
        }
        return plus;
    },

    /**
     * Génère les composants plan à afficher
     * @returns {Array}
     */
    getPlans: function () {

        var retour = [];
        var plus = '';

        // Mode edition
        if (this.props.idNiveau !== 0) {
            // Parcours des plans du niveau
            retour = _.map(this.props.detailNiveau.plans, function (plan, index, collection) {
                // Plus et moins
                plus = this.generatePlusMinus(index, (collection.length + this.props.nbUpload));

                return (
                    <Row key={index}>
                        <Col
                            md={1}
                            className="text-right">
                            <label>{Lang.get('global.plan')}</label>
                        </Col>
                        <Col md={4}>
                            <InputTextEditable
                                attributes={{
                                    name: "plan" + plan.id,
                                    value: plan.libelle,
                                    required: true
                                }}
                                editable={this.props.editable}/>
                        </Col>
                        <Col
                            md={2}
                            className = "text-center">
                            <Photo
                                editable={this.props.editable}
                                src = {DOC_URI + 'plans/' + plan.url}
                                name={"url" + plan.id}
                                typeOfFile="img"
                                alertOn={true}
                                libelle={Lang.get('administration_parking.niveau.modif_plan')}
                                attributes={{
                                    required: true
                                }}/>
                        </Col>
                    {plus}
                    </Row>
                );
            }, this); // Fin map
            // De nouveaux plans à ajouter
            if (this.props.nbUpload > 0) {
                // Ajout de nouveaux plans
                for (var i = 0; i < this.props.nbUpload; i++) {

                    plus = this.generatePlusMinus((i + this.props.detailNiveau.plans.length), (this.props.detailNiveau.plans.length + this.props.nbUpload));

                    // Ligne complète
                    retour.push(
                        <Row key={i + this.props.detailNiveau.plans.length}>
                            <Col
                                md={1}
                                className="text-right">
                                <label>{Lang.get('global.plan')}</label>
                            </Col>
                            <Col md={4}>
                                <InputTextEditable
                                    attributes={{
                                        name: "plan_new_" + i,
                                        required: true,
                                        value: this.props.detailNiveau['plan_new_' + i]
                                    }}
                                    editable={this.props.editable}/>
                            </Col>
                            <Col md={2}>
                                <Upload
                                    key={i}
                                    name={"url_new_" + i}
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
            // Des plans à supprimer
            else{
                for(var i = this.props.nbUpload; i < 0; i++){
                    retour.pop();
                }
            }
        }
        // Mode création
        else {

            // Nb bouton upload
            for (var i = 0; i < this.props.nbUpload; i++) {

                plus = this.generatePlusMinus(i, this.props.nbUpload);

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
                    selectedValue={this.props.detailNiveau.parking_id.toString()}
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
