/***********************/
/* Composants Boostrap */
var Row   = ReactB.Row;
var Col   = ReactB.Col;
var Input = ReactB.Input;

/*********/
/* Mixin */
var MixinInputValue = require('../mixins/input_value').InputValueMixin;
/**
 * Couleur en mode visualisation: rectangle à la couleur définie par l'attribut couleur
 * @param color string(6): code couleur héxadécimal ex: 000000
 * @param label: Label devant le champ couleur
 * @param height: hauteur du rectangle en px ex: 120
 * @param width: largeur du rectangle en px ex: 120
 * @param mdLabel: col-md-?? du label ex: 2
 * @param mdColor: col-md-?? du champ couleur
 */
var ColorPicker = React.createClass({

    propTypes: {
        color: React.PropTypes.string,
        label: React.PropTypes.string,
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        mdLabel: React.PropTypes.number,
        mdColor: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            color: '000000',
            attributes: {},
            evts: {},
            height: 20,
            width: 50,
            label:'',
            mdLabel: 1,
            mdColor: 1
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

        return (<Row>
            <Col md={this.props.mdLabel}>
                <label>{this.props.label}</label>
            </Col>
            <Col md={this.props.mdColor}>
                <div style={splitterStyle}></div>
            </Col>
        </Row>
        )
    }
});
module.exports.ColorPicker = ColorPicker;

/**
 * Champ Couleur de type Input. En mode visualisation: rectangle de type ColorPicker
 * @param editable: True: champ input; false: champ ColorPicker (mode visualisation)
 * @param color (string(6)): code couleur héxadécimal ex: 000000
 * @param label: Label devant le champ couleur
 * @param attributes: attributs HTML du champ Input
 * @param gestMod: champ pris en compte dans la gestion des modification si TRUE
 * @param validator: function de validation sur onChange
 * @param mdLabel: col-md-?? du label ex: 2
 * @param mdColor: col-md-?? du champ couleur
 */
var ColorPickerEditable = React.createClass({

    mixins: [MixinInputValue],

    propTypes: {
        editable:   React.PropTypes.bool.isRequired,
        color:      React.PropTypes.string,
        label:      React.PropTypes.string,
        attributes: React.PropTypes.object,
        gestMod:    React.PropTypes.bool,
        validator:  React.PropTypes.func,
        mdLabel: React.PropTypes.number,
        mdColor: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            color: '000000',
            attributes: {},
            gestMod: true,
            validator: function(){
                return {isValid: true, style: 'default', tooltip: ''};
            },
            mdLabel: 1,
            mdColor: 1,
            label: ''
        }
    },

    getInitialState: function () {
        return {color: this.props.color};
    },

    onChange: function(e){
        this.setState({color:e.target.value});
    },

    onBlur: function(e){
        this.setState({color:e.target.value});
    },

    render: function () {
        var retour;

        // EDITABLE
        if (this.props.editable) {

            retour = <Row>
                <Col md={this.props.mdLabel}>
                    <label>{this.props.label}</label>
                </Col>
                <Col md={this.props.mdColor}>
                    <Input type="text" maxLength="6" addonBefore="#" {...this.props.attributes} value={this.state.color} onChange={this.onChange} onBlur={this.onBlur} className="color {pickerFaceColor:'transparent',pickerFace:3,pickerBorder:0,pickerInsetColor:'black'}" />
                </Col>
            </Row>;
        }
        // NON EDITABLE
        else{
            retour = <ColorPicker color={this.state.color} label={this.props.label} mdLabel={this.props.mdLabel} mdColor={this.props.mdColor}/>;
        }

        return retour;
    }
});
module.exports.ColorPickerEditable = ColorPickerEditable;