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
        onChange:React.PropTypes.func
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            onChange:this.handleChange
        }
    },

   // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function() {
        return (
            <Input
            type="text"
                {...this.props.attributes}
                {...this.props.evts}
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
        evts:React.PropTypes.object
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
        var retour;
        // Editable
        if(this.props.editable){
            retour =  <InputText
                            attributes = {this.props.attributes}
                            evts = {this.props.evts}
                        />
        }
        // Non editable
        else{
            var texte = '';
            if(this.props.attributes.value !== undefined){
                texte = this.props.attributes.value;
            }
            retour = <label>{texte}</label>
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
        evts:React.PropTypes.object
    },
    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
        return (
            <Input
                type="email"
                {...this.props.attributes}
                {...this.props.evts}
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
        evts:React.PropTypes.object
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
        var retour;
        // Editable
        if(this.props.editable){
            retour =  <InputMail
            attributes = {this.props.attributes}
            evts = {this.props.evts}
            />
        }
        // Non editable
        else{
            var texte = '';
            if(this.props.attributes.value !== undefined){
                texte = this.props.attributes.value;
            }
            retour = <label>{texte}</label>
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
            onChange:React.PropTypes.func
        },

        getDefaultProps: function(){
            return{
                attributes: {},
                evts: {},
                onChange:this.handleChange
            }
        },

        // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

        render: function() {
            return (
                <Input
                    type="password"
                    {...this.props.attributes}
                    {...this.props.evts}
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
        evts:React.PropTypes.object
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
        var retour;
        // Editable
        if(this.props.editable){
            retour =  <InputPassword
            attributes = {this.props.attributes}
            evts = {this.props.evts}
            />
        }
        // Non editable
        else{
            var texte = '';
            if(this.props.attributes.value !== undefined){
                texte = this.props.attributes.value;
            }
            retour = <label>{texte}</label>
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
        onChange:React.PropTypes.func
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {},
            onChange:this.handleChange
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function() {
        return (
            <Input
            type="radio"
                {...this.props.attributes}
                {...this.props.evts}
                value = {this.state.value}
                onChange={this.handleChange}
                ref = "Checkable"
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
var InputRadioEditable = React.createClass({

    propTypes: {
        editable:React.PropTypes.bool.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
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