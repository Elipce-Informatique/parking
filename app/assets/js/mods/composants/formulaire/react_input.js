var Input = ReactB.Input;
var OverlayTrigger = ReactB.OverlayTrigger;
var Tooltip = ReactB.Tooltip;
var MixinInput = require('../../mixins/input_value');
var MixinInputValue = MixinInput.InputValueMixin;
var MixinInputChecked = MixinInput.InputCheckableMixin;
var Validator = require('validator');

var DateTimePicker = ReactW.DateTimePicker;
var Combobox       = ReactW.Combobox;

/**
 * Champ texte
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      tooltip: 'La donnée saisie est déjà présente dans la base de données.' | ''
 *      style: 'success|warning|error|default',
 * }
 */
var InputText = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange: React.PropTypes.func,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            onChange: this.handleChange,
            gestMod: true,
            validator: function (val) {
                if (val.length == 0) {
                    return {isValid: true, style: 'default', tooltip: ''};
                } else {
                    return {isValid: true, style: 'success', tooltip: ''};
                }
            }
        };
    },

    // ATTENTION: getInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var attrs = this.props.attributes;
        attrs = _.merge(this.state.attributes, this.props.attributes);

        // 4. ATTRS OK, CREATION INPUT
        retour = (<Input
        type="text"
        {...attrs}
        {...this.props.evts}
        onChange = {this.handleChange}
        value={this.state.value}
        ref = "InputField"
        hasFeedback
        />);
        return retour;
    }
});


/**
 * Champ texte editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputTextEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {
            // AJOUT DU VALIDATOR PERSO
            if (typeof(this.props.validator) == 'function') {
                retour = <InputText
                            attributes = {this.props.attributes}
                            evts       = {this.props.evts}
                            ref        = "Editable"
                            gestMod    = {this.props.gestMod}
                            validator  = {this.props.validator}
                            />
            }
            else {
                retour = <InputText
                            attributes = {this.props.attributes}
                            evts       = {this.props.evts}
                            ref        = "Editable"
                            gestMod    = {this.props.gestMod}
                            />
            }
        }
        // Non editable
        else
            retour = modeEditableFalse(this.props.attributes);

        return retour;
    }
});

/**
 * Champ mail
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputMail = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
            validator: function (val) {
                if (Validator.isEmail(val)) {
                    return {isValid: true, style: 'success', tooltip: ''};
                } else if (val.length == 0) {
                    return {isValid: true, style: 'default', tooltip: ''};
                }
                else {
                    return {isValid: false, style: 'error', tooltip: Lang.get('global.validation_erreur_mail')};
                }
            }
        }
    },

    render: function () {
        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var attrs = this.props.attributes;
        attrs = _.merge(this.state.attributes, this.props.attributes);

        return (
            <Input
            type="email"
                {...attrs}
                {...this.props.evts}
            value = {this.state.value}
            onChange={this.handleChange}
            ref = "InputField"
            hasFeedback
            />
        );
    }
});


/**
 * Champ mail editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputMailEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {
            var attrs = this.props.attributes;
            // AJOUT DU VALIDATOR PERSO
            if (typeof(this.props.validator) == 'function') {
                attrs = _.extends(this.props.attributes, {validator: this.props.validator});
            }

            retour =
                <InputMail
                attributes = {attrs}
                evts = {this.props.evts}
                ref="Editable"
                gestMod={this.props.gestMod}
                />
        }
        // Non editable
        else {
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
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputPassword = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange: React.PropTypes.func,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            onChange: this.handleChange,
            gestMod: true,
            validator: function (val) {
                var retour = {};
                // CHAMP OK
                if (val.length >= 6 && (!Validator.isAlpha(val) && !Validator.isNumeric(val))) {
                    retour = {isValid: true, style: 'success', tooltip: ''};
                }
                // CHAMP KO
                else {
                    retour = {isValid: false, style: 'error', tooltip: Lang.get('global.validation_erreur_pass')};
                }
                return retour;
            }
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var attrs = this.props.attributes;
        attrs = _.merge(this.state.attributes, this.props.attributes);

        return (
            <Input
            type="password"
                    {...attrs}
                    {...this.props.evts}
            value = {this.state.value}
            onChange={this.handleChange}
            ref = "InputField"
            hasFeedback
            />
        );
    }
});

/**
 * Champ texte editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip: 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputPasswordEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {
            var attrs = this.props.attributes;
            // AJOUT DU VALIDATOR PERSO
            if (typeof(this.props.validator) == 'function') {
                attrs = _.extends(this.props.attributes, {validator: this.props.validator});
            }
            retour =
                <InputPassword
                attributes = {attrs}
                evts = {this.props.evts}
                ref="Editable"
                gestMod={this.props.gestMod}
                />
        }
        // Non editable
        else {
            retour = modeEditableFalse(this.props.attributes);
        }
        return retour;
    }
});

/**
 * Champ texte
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      tooltip: 'La donnée saisie est déjà présente dans la base de données.' | ''
 *      style: 'success|warning|error|default',
 * }
 */
var InputDate = React.createClass({
        mixins: [MixinInputValue],

        propTypes: {
            min: React.PropTypes.object,
            max: React.PropTypes.object,
            attributes: React.PropTypes.object,
            evts: React.PropTypes.object,
            onChange: React.PropTypes.func,
            gestMod: React.PropTypes.bool,
            validator: React.PropTypes.func
        },

        getDefaultProps: function () {
            return {
                attributes: {},
                evts: {},
                onChange: this.handleChange,
                gestMod: true,
                validator: function (val) {
                    if (Validator.isDate(val)) {
                        return {isValid: true, style: 'success', tooltip: ''};
                    } else {
                        return {isValid: true, style: 'error', tooltip: ''};
                    }
                }
            };
        },

        // ATTENTION: getInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

        render: function () {
            // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
            var attrs = this.props.attributes;
            attrs = _.merge(this.state.attributes, this.props.attributes);

            // 4. ATTRS OK, CREATION INPUT
            retour = (<DateTimePicker
                min={this.props.min}
                max={this.props.max}
                time={false}
                format='dd/MM/yyyy'
                {...attrs}
                {...this.props.evts}
                ref = "InputField"
                hasFeedback
            />);
            return retour;
        }
    });


/**
 * Champ texte editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputDateEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        min: React.PropTypes.object,
        max: React.PropTypes.object,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            min: new Date(0, 0, 0),
            max: new Date(9999, 1, 1),
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {

        var retour;
        // Editable
        if (this.props.editable) {
            // AJOUT DU VALIDATOR PERSO
            if (typeof(this.props.validator) == 'function') {
                retour = <InputDate
                attributes = {this.props.attributes}
                evts       = {this.props.evts}
                ref        = "Editable"
                gestMod    = {this.props.gestMod}
                min        = {this.props.min}
                max        = {this.props.max}
                validator  = {this.props.validator}
                />
            }
            else {
                retour = <InputDate
                attributes = {this.props.attributes}
                evts       = {this.props.evts}
                ref        = "Editable"
                gestMod    = {this.props.gestMod}
                min        = {this.props.min}
                max        = {this.props.max}
                />
            }
        }
        // Non editable
        else
            retour = modeEditableFalse(this.props.attributes);

        return retour;
    }
});

/**
 * Champ select
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      tooltip: 'La donnée saisie est déjà présente dans la base de données.' | ''
 *      style: 'success|warning|error|default',
 * }
 */
var InputSelect = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        data:React.PropTypes.object.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange: React.PropTypes.func,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            onChange: this.handleChange,
            gestMod: true,
            validator: function (val) {
                if (Validator.isDate(val)) {
                    return {isValid: true, style: 'success', tooltip: ''};
                } else {
                    return {isValid: true, style: 'error', tooltip: ''};
                }
            }
        };
    },

    // ATTENTION: getInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        function logChange(value) {
            console.log('Select value changed: ' + value);
        }

        var ops = [
            { label: 'Chocolate', value: 'chocolate' },
            { label: 'Vanilla', value: 'vanilla' },
            { label: 'Strawberry', value: 'strawberry' },
            { label: 'Caramel', value: 'caramel' },
            { label: 'Cookies and Cream', value: 'cookiescream' },
            { label: 'Peppermint', value: 'peppermint' }
        ];

        return <div>
                   <label>Toto</label>
                   <Combobox
                       data={ops}
                       value={'Select in'}
                       onChange={logChange}
                       textField='latoto'
                       valueField='value' />
               </div>;
    }
});


/**
 * Champ select editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputSelectEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        data:React.PropTypes.object.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {
            // AJOUT DU VALIDATOR PERSO
            if (typeof(this.props.validator) == 'function') {
                retour = <InputSelect
                            attributes = {this.props.attributes}
                            evts       = {this.props.evts}
                            ref        = "Editable"
                            gestMod    = {this.props.gestMod}
                            validator  = {this.props.validator}
                            data       = {this.props.data}
                            autocomplete="both"/>;
            }
            else {
                retour = <InputSelect
                            attributes = {this.props.attributes}
                            evts       = {this.props.evts}
                            ref        = "Editable"
                            gestMod    = {this.props.gestMod}
                            data       = {this.props.data}
                            autocomplete="both"/>;
            }
        }
        // Non editable
        else
            retour = modeEditableFalse(this.props.attributes);

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
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange: React.PropTypes.func,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            onChange: this.handleChange,
            gestMod: true
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {};
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
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var attr = this.props.attributes;
        // Editable
        if (!this.props.editable) {
            attr = _.extend(attr, {disabled: true});
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
 * Champ radio
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param onChange: fonction: Par défaut mise à jour de value du champ par rapport aux saisies user. Si pas de onChange alors champ en READONLY
 */
var InputRadioBootstrap = React.createClass({
    mixins: [MixinInputChecked],

    propTypes: {
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange: React.PropTypes.func,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            onChange: this.handleChange,
            gestMod: true
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {};
        var classBtn = 'btn btn-default';

        return (
            <label {...this.props.evts} {...this.props.attributes} className={classBtn+' '+this.props.attributes.className}>
                <input {...gestMod} type="radio" name={this.props.name} />{this.props.children}
            </label>
        );
    }
});

/**
 * Champ texte editable => si pas editable INPUT devient READONLY.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputRadioBootstrapEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var attr = this.props.attributes;
        // Editable
        if (!this.props.editable) {
            attr = _.extend(attr, {disabled: true});
        }else{
            attr = _.extend(attr, {disabled: false});
        }

        return <InputRadioBootstrap
        attributes = {attr}
        evts = {this.props.evts}
        ref="Editable"
        gestMod={this.props.gestMod} >
                    {this.props.children}
        </InputRadioBootstrap>
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
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        onChange: React.PropTypes.func,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            onChange: this.handleChange,
            gestMod: true
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {};
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
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var attr = this.props.attributes;
        // Editable
        if (this.props.editable) {
            attr = _.extend(attr, {readOnly: true});
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
module.exports.InputRadioBootstrap = InputRadioBootstrap;
module.exports.InputRadioBootstrapEditable = InputRadioBootstrapEditable;
module.exports.InputCheckbox = InputCheckbox;
module.exports.InputCheckboxEditable = InputCheckboxEditable;
module.exports.InputDateEditable = InputDateEditable;
module.exports.InputDate = InputDate;
module.exports.InputSelect = InputSelect;
module.exports.InputSelectEditable = InputSelectEditable;


// FONCTIONS

/**
 * Permet de construire le formulaire en mode non editable (labels)
 * @param attr: this.props.attributes
 * @returns {XML}
 */
function modeEditableFalse(attr) {
    // Label
    var label = (attr.label !== undefined ? attr.label : '');
    // Texte
    var texte = (attr.value !== undefined ? attr.value : '');
    // CSS
    var classRow = (attr.groupClassName !== undefined ? {className: attr.groupClassName} : {});
    var classLabel = (attr.labelClassName !== undefined ? {className: attr.labelClassName} : {});
    var classTexte = (attr.wrapperClassName !== undefined ? {className: attr.wrapperClassName} : {});

    return (
        <div {...classRow}>
            <label {...classLabel}>
                <span>{label}</span>
            </label>
            <div {...classTexte}>
                <span>{texte}</span>
            </div>
        </div>
    )
}
