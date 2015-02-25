/***********************/
/* Composants Boostrap */
var Row   = ReactB.Row;
var Col   = ReactB.Col;
var Input = ReactB.Input;

/*********/
/* Mixin */
var MixinInputValue = require('../mixins/input_value').InputValueMixin;
/**
 * Photo de protrait
 * @param src: URL de l'image
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var ColorPicker = React.createClass({

    propTypes: {
        color: React.PropTypes.string.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            height: 20,
            width: 50
        }
    },

    render: function () {
        var splitterStyle = {
            background:this.props.color,
            height:this.props.height,
            width:this.props.width,
            boxShadow: '3px 3px 3px #888888',
            borderRadius: "5px"
        };

        var mdLabel = (this.props.attributes.labelCol !== undefined ? this.props.attributes.labelCol : 1);
        var mdColor = (this.props.attributes.colorCol !== undefined ? this.props.attributes.colorCol : 1);

        return (<Row>
                    <Col md={mdLabel}>
                        <label>
                            {this.props.attributes.label}
                        </label>
                    </Col>
                    <Col md={mdColor}>
                        <div style={splitterStyle}></div>
                    </Col>
                </Row>
        )
    }
});
module.exports.ColorPicker = ColorPicker;

/**
 * Photo portrait editable
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var ColorPickerEditable = React.createClass({

    mixins: [MixinInputValue],

    propTypes: {
        color:      React.PropTypes.string.isRequired,
        attributes: React.PropTypes.object,
        evts:       React.PropTypes.object,
        gestMod:    React.PropTypes.bool,
        editable:   React.PropTypes.bool,
        validator:  React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts:       {},
            editable:   false,
            validator: function(){
                return {isValid: true, style: 'default', tooltip: ''};
            }
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
            var mdLabel = (this.props.attributes.labelCol !== undefined ? this.props.attributes.labelCol : 1);
            var mdColor = (this.props.attributes.colorCol !== undefined ? this.props.attributes.colorCol : 1);

            retour = <Row>
                        <Col md={mdLabel}>
                            <label>
                                    {this.props.attributes.label}
                            </label>
                        </Col>
                        <Col md={mdColor}>
                            <Input type="text" maxLength="6" addonBefore="#" value={this.state.color} onChange={this.onChange} onBlur={this.onBlur} className="color {pickerFaceColor:'transparent',pickerFace:3,pickerBorder:0,pickerInsetColor:'black'}" />
                        </Col>
                    </Row>;
        }
        // NON EDITABLE
        else{
            retour = <ColorPicker color={this.props.color} evts={this.props.evts} attributes={this.props.attributes}/>;
        }

        return retour;
    }
});
module.exports.ColorPickerEditable = ColorPickerEditable;