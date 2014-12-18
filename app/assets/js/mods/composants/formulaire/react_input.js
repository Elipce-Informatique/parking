var Input = ReactB.Input;
var MixinInput = require('../../mixins/input_value');
var MixinInputValue = MixinInput.InputValueMixin;
var MixinInputChecked = MixinInput.InputCheckableMixin;

/**
 * Champ texte
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 */
var InputText = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        attributes:React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange:React.PropTypes.func,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            onChange:this.handleChange,
            gestMod: true
        }
    },

   // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function() {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod}: {};
        return (
            <Input
            type="text"
                {...this.props.attributes}
                {...this.props.evts}
                {...gestMod}
                value = {this.state.value}
                onChange={this.handleChange}
                ref = "InputField"
            />
        );
    }
});



/**
 * Champ texte editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputTextEditable = React.createClass({

    propTypes: {
        editable:React.PropTypes.bool.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function() {
        var retour;
        // Editable
        if(this.props.editable){
            retour =  <InputText
                            attributes = {this.props.attributes}
                            evts = {this.props.evts}
                            ref="Editable"
                            gestMod={this.props.gestMod}
                        />
        }
        // Non editable
        else{
            retour = modeEditableFalse(this.props.attributes);
        }
        return retour;
    }
});

/**
 * Champ mail
 */
var InputMail = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },
    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function() {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod}: {};
        return (
            <Input
                type="email"
                {...this.props.attributes}
                {...this.props.evts}
                {...gestMod}
                value = {this.state.value}
                onChange={this.handleChange}
                ref = "InputField"
            />
        );
    }
});


/**
 * Champ mail editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputMailEditable = React.createClass({

    propTypes: {
        editable:React.PropTypes.bool.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function() {
        var retour;
        // Editable
        if(this.props.editable){
            retour =
                <InputMail
                    attributes = {this.props.attributes}
                    evts = {this.props.evts}
                    ref="Editable"
                    gestMod={this.props.gestMod}
                />
        }
        // Non editable
        else{
            retour = modeEditableFalse(this.props.attributes);
        }
        return retour;
    }
});


/**
 * Champ mot de passe
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 */
var InputPassword = React.createClass({
        mixins: [MixinInputValue],

        propTypes: {
            attributes:React.PropTypes.object,
            evts: React.PropTypes.object,
            onChange:React.PropTypes.func,
            gestMod: React.PropTypes.bool
        },

        getDefaultProps: function(){
            return{
                attributes: {},
                evts: {},
                onChange:this.handleChange,
                gestMod: true
            }
        },

        // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

        render: function() {
            var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod}: {};
            return (
                <Input
                    type="password"
                    {...this.props.attributes}
                    {...this.props.evts}
                    {...gestMod}
                    value = {this.state.value}
                    onChange={this.handleChange}
                    ref = "InputField"
                />
            );
        }
    });

/**
 * Champ texte editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputPasswordEditable = React.createClass({

    propTypes: {
        editable:React.PropTypes.bool.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function() {
        var retour;
        // Editable
        if(this.props.editable){
            retour =
                <InputPassword
                    attributes = {this.props.attributes}
                    evts = {this.props.evts}
                    ref="Editable"
                    gestMod={this.props.gestMod}
                />
        }
        // Non editable
        else{
            retour = modeEditableFalse(this.props.attributes);
        }
        return retour;
    }
});

/*--------------------------------------------------------------
        CHECKABLE
---------------------------------------------------------------- */

/**
 * Champ radio
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 */
var InputRadio = React.createClass({
    mixins: [MixinInputChecked],

    propTypes: {
        attributes:React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange:React.PropTypes.func,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            onChange:this.handleChange,
            gestMod: true
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function() {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod}: {};
        return (
            <Input
            type="radio"
                {...this.props.attributes}
                {...this.props.evts}
                {...gestMod}
                value = {this.state.value}
                onChange={this.handleChange}
                ref = "Checkable"
            />
        );
    }
});

/**
 * Champ texte editable => si pas editable INPUT devient READONLY.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputRadioEditable = React.createClass({

    propTypes: {
        editable:React.PropTypes.bool.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function() {
        var attr = this.props.attributes;
        // Editable
        if(this.props.editable){
            attr = _.extend(attr,{readOnly:true});
        }
        //console.log(attr);
        return <InputRadio
                    attributes = {attr}
                    evts = {this.props.evts}
                    ref="Editable"
                    gestMod={this.props.gestMod}
                />
    }
});


/**
 * Champ checkbox
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 */
var InputCheckbox = React.createClass({
    mixins: [MixinInputChecked],

    propTypes: {
        attributes:React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange:React.PropTypes.func,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            onChange:this.handleChange,
            gestMod: true
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function() {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod}: {};
        return (
            <Input
                type="checkbox"
                {...this.props.attributes}
                {...this.props.evts}
                {...gestMod}
                value = {this.state.value}
                onChange={this.handleChange}
                ref = "Checkable"
            />
        );
    }
});

/**
 * Champ checkbox editable => si pas editable INPUT devient READONLY.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputCheckboxEditable = React.createClass({

    propTypes: {
        editable:React.PropTypes.bool.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function() {
        var attr = this.props.attributes;
        // Editable
        if(this.props.editable){
            attr = _.extend(attr,{readOnly:true});
        }
        //console.log(attr);
        return <InputCheckbox
            attributes = {attr}
            evts = {this.props.evts}
            ref="Editable"
            gestMod={this.props.gestMod}
        />
    }
});

module.exports.InputText = InputText;
module.exports.InputTextEditable = InputTextEditable;
module.exports.InputMail = InputMail;
module.exports.InputMailEditable = InputMailEditable;
module.exports.InputPassword = InputPassword;
module.exports.InputPasswordEditable = InputPasswordEditable;
module.exports.InputRadio = InputRadio;
module.exports.InputRadioEditable = InputRadioEditable;
module.exports.InputCheckbox = InputCheckbox;
module.exports.InputCheckboxEditable = InputCheckboxEditable;

// FONCTIONS

/**
 * Permet de construire le formulaire en mode non editable (labels)
 * @param attr: this.props.attributes
 * @returns {XML}
 */
function modeEditableFalse(attr){
    // Label
    var label= (attr.label !== undefined?attr.label:'');
    // Texte
    var texte = (attr.value !== undefined?attr.value:'');
    // CSS
    var classRow = (attr.groupClassName !== undefined?{className:attr.groupClassName}:{});
    var classLabel = (attr.labelClassName !== undefined?{className:attr.labelClassName}:{});
    var classTexte = (attr.wrapperClassName !== undefined?{className:attr.wrapperClassName}:{});

    return (
        <div {...classRow}>
            <label {...classLabel}><span>{label}</span></label>
            <div {...classTexte}>
                <span>{texte}</span>
            </div>
        </div>
    )
}
