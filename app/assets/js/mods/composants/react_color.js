/***********************/
/* Composants Boostrap */
var React = require('react/addons');
var Row   = ReactB.Row;
var Col   = ReactB.Col;
var Input = ReactB.Input;

/*********/
/* Mixin */
var MixinInputValue = require('../mixins/input_value').InputValueMixin;

/**
 * Champ Couleur de type Input. En mode visualisation: rectangle de type ColorPicker
 * ATTENTION: le plugin jscolor ajoute une value par défaut: FFFFFF, cette value n'est pas reportée dans this.props.attributes.value
 * @param editable: True: champ input; false: champ ColorPicker (mode visualisation)
 * @param color (string(6)): code couleur héxadécimal ex: 000000
 * @param label: Label devant le champ couleur
 * @param attributes: attributs HTML du champ Input
 * @param gestMod: champ pris en compte dans la gestion des modification si TRUE
 * @param validator: function de validation sur onChange
 * @param mdLabel: col-md-?? du label ex: 2
 * @param mdColor: col-md-?? du champ couleur
 * @param evts: evenements de Input (react bootstrap)  ex: {onChange: maFonction}
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      tooltip: 'La donnée saisie est déjà présente dans la base de données.' | ''
 *      style: 'success|warning|error|default',
 * }
 * @param labelClass: string: classes css à passer au champ label du colorpicker
 * @param colorClass: string: classes css à passer au champ Input du colorpicker
 */
var ColorPickerEditable = React.createClass({

    mixins: [MixinInputValue], // Gère la MAJ de la value contenue initialement dans this.props.attributes.value

    propTypes: {
        editable:   React.PropTypes.bool.isRequired,
        label:      React.PropTypes.string,
        attributes: React.PropTypes.object,
        gestMod:    React.PropTypes.bool,
        mdLabel:    React.PropTypes.number,
        mdColor:    React.PropTypes.number,
        evts:       React.PropTypes.object,
        validator:  React.PropTypes.func,
        labelClass: React.PropTypes.string,
        colorClass: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            attributes: {value:'FFFFFF'},
            gestMod: true,
            mdLabel: 1,
            mdColor: 1,
            label: '',
            evts: {},
            labelClass : '',
            colorClass : '',
            validator: function (val, props, state) {
                var retour = {};
                // Value vide
                if (val.length == 0) {
                    retour =  {isValid: !props.attributes.required, style: (props.attributes.required?'error':'default'), tooltip: ''};
                }
                // Couleur OK
                else {
                    retour = {isValid: true, style: 'success', tooltip: ''};
                }
                return retour;
            }
        }
    },

    componentDidMount: function(){
        // Init du plugin color
        jscolor.init();
    },

    componentDidUpdate: function(){
        // Init du plugin color
        jscolor.init();
    },

    render: function () {
        var retour;

       // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();
        //console.log('attrs %o', attrs);
        // EDITABLE
        if (this.props.editable) {
            // Construction des classes pour Input
            attrs = _.extend({  wrapperClassName:'col-md-'+this.props.mdColor+' '+this.props.colorClass,
                                labelClassName:'col-md-'+this.props.mdLabel+' '+this.props.labelClass,
                                groupClassName:'row',
                                label: this.props.label}, attrs);

            retour =
                <Input
                    type="text"
                    maxLength="6"
                    addonBefore="#"
                    {...attrs}
                    value={this.state.value}
                    className="color {pickerFaceColor:'transparent',pickerFace:3,pickerBorder:0,pickerInsetColor:'black'}"
                    {...this.props.evts}
                    onChange = {this.handleChange}
                    onBlur = {this.handleBlur}
                    ref="InputField"
                    hasFeedback
                />
        }
        // NON EDITABLE
        else{
            retour = <ColorPicker
                        color={this.props.attributes.value}
                        label={this.props.label}
                        mdLabel={this.props.mdLabel}
                        mdColor={this.props.mdColor}
                        labelClass={this.props.labelClass}
                        colorClass={this.props.colorClass}
            />;
        }

        return retour;
    }
});
module.exports.ColorPickerEditable = ColorPickerEditable;

/**
 * Couleur en mode visualisation: rectangle à la couleur définie par l'attribut couleur
 * @param color string(6): code couleur héxadécimal ex: 000000
 * @param label: Label devant le champ couleur
 * @param height: hauteur du rectangle en px ex: 120
 * @param width: largeur du rectangle en px ex: 120
 * @param mdLabel: col-md-?? du label ex: 2
 * @param mdColor: col-md-?? du champ couleur
 * @param labelClass: string: classes css à passer au champ label du colorpicker
 * @param colorClass: string: classes css à passer au champ Input du colorpicker
 */
var ColorPicker = React.createClass({

    propTypes: {
        color: React.PropTypes.string,
        label: React.PropTypes.string,
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        mdLabel: React.PropTypes.number,
        mdColor: React.PropTypes.number,
        labelClass: React.PropTypes.string,
        colorClass: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            color: 'FFFFFF',
            attributes: {},
            evts: {},
            height: 20,
            width: 50,
            label:'',
            mdLabel: 1,
            mdColor: 1,
            labelClass : '',
            colorClass : ''
        }
    },

    render: function () {

        var splitterStyle = {
            background:'#'+this.props.color,
            height:this.props.height,
            width:this.props.width,
            boxShadow: '3px 3px 3px #888888',
            borderRadius: "5px"
        };
        //console.log('COLOR PICKER splitterStyle %o',splitterStyle);
        return (<Row>
            <Col md={this.props.mdLabel} className={this.props.labelClass}>
                <label>{this.props.label}</label>
            </Col>
            <Col md={this.props.mdColor} className={this.props.colorClass}>
                <div style={splitterStyle}></div>
            </Col>
        </Row>
        )
    }
});
module.exports.ColorPicker = ColorPicker;