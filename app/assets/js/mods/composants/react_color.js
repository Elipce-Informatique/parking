/***********************/
/* Composants Boostrap */
var Row   = ReactB.Row;
var Col   = ReactB.Col;
var Input = ReactB.Input;

/*********/
/* Mixin */
var MixinInput = require('../mixins/input_value');
var MixinInputValue = MixinInput.InputValueMixin;

/**
 * Photo de protrait
 * @param src: URL de l'image
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var ColorPicker = React.createClass({

    propTypes: {
        attributes: React.PropTypes.object,
        sansLabelModeNonEditable: React.PropTypes.bool,
        evts: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            height: 20,
            width: 50,
            sansLabelModeNonEditable: false
        }
    },

    render: function () {
        var color = (this.props.attributes.value !== undefined ? this.props.attributes.value : 'FFFFFF');

        var splitterStyle = {
            background:color,
            height:this.props.height,
            width:this.props.width,
            boxShadow: '3px 3px 3px #888888',
            borderRadius: "5px"
        };

        var label = (this.props.attributes.label !== undefined ? this.props.attributes.label : '');
        var classRow   = (this.props.attributes.groupClassName !== undefined ? {className: this.props.attributes.groupClassName} : {});
        var classLabel = (this.props.attributes.labelClassName !== undefined ? {className: this.props.attributes.labelClassName} : {});
        var classTexte = (this.props.attributes.wrapperClassName !== undefined ? {className: this.props.attributes.wrapperClassName} : {});

        var labelCp = '';

        if(this.props.sansLabelModeNonEditable == false){
            labelCp = <label {...classLabel}>
                          <span>{label}</span>
                      </label>;
        }

        return (<div {...classRow}>
                    {labelCp}
                    <div {...classTexte}>
                        <div style={splitterStyle}></div>
                    </div>
                </div>);
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
        onChange:   React.PropTypes.func,
        onBlur:     React.PropTypes.func,
        attributes: React.PropTypes.object,
        evts:       React.PropTypes.object,
        gestMod:    React.PropTypes.bool,
        sansLabelModeNonEditable: React.PropTypes.bool,
        editable:   React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts:       {},
            editable:   false,
            onChange:  this.handleChange,
            onBlur:    this.handleBlur,
            gestMod:   true,
            validator: function (val, props, state) {
                return {isValid: true, style: 'default', tooltip: ''};
            }
        }
    },

    componentWillReceiveProps: function(np){
        this.setState({value:np.color});
    },

    render: function () {
        var retour = '';

        // EDITABLE
        if (this.props.editable) {
            var mdLabel = (this.props.attributes.labelCol !== undefined ? this.props.attributes.labelCol : 1);
            var mdColor = (this.props.attributes.colorCol !== undefined ? this.props.attributes.colorCol : 1);

            // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
            var propsAttrs = _.cloneDeep(this.props.attributes);
            propsAttrs     = _.omit(propsAttrs, ['help', 'data-valid']);
            var attrs      = _.extend(propsAttrs, this.state.attributes);

            retour = <Input type="text"
                       ref = "InputField"
                       hasFeedback
                       addonBefore="#"
                       value={this.state.value}
                       onChange={this.handleChange}
                       onBlur={this.handleBlur}
                       {...attrs}
                       {...this.props.evts}
                       className="color {pickerFaceColor:'transparent',pickerFace:3,pickerBorder:0,pickerInsetColor:'black'}" />;
        }
        // NON EDITABLE
        else{
            retour = <ColorPicker attributes={this.props.attributes}/>;
        }

        return retour;
    }
});
module.exports.ColorPickerEditable = ColorPickerEditable;