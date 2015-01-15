var Input = ReactB.Input;
var OverlayTrigger = ReactB.OverlayTrigger;
var Tooltip = ReactB.Tooltip;
var Glyphicon = ReactB.Glyphicon;

/*********/
/* Mixin */
var MixinInput = require('../../mixins/input_value');
var MixinInputValue = MixinInput.InputValueMixin;
var MixinInputChecked = MixinInput.InputCheckableMixin;
var Validator = require('validator');

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

/**
 * Champ texte
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param area: bool, input type area ou non, false par défaut
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
        area: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            onChange: this.handleChange,
            gestMod: true,
            area: false,
            validator: function (val, props, state) {
                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    return {isValid: false, style: 'default', tooltip: ''};
                }
                else if (val.length == 0) {
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
        var propsAttrs = _.cloneDeep(this.props.attributes);
        propsAttrs = _.omit(propsAttrs, ['help', 'data-valid']);
        var attrs = _.extend(propsAttrs, this.state.attributes);

        // Ajout de l'addon required si besoin
        if (typeof(this.props.attributes.required) != "undefined" && this.props.attributes.required == true) {
            attrs = addRequiredAddon(attrs, this.state.value);
        }

        // 4. ATTRS OK, CREATION INPUT
        var type = "text";
        if (this.props.area == true)
            type = "textarea";

        return (<Input
            type={type}
            {...attrs}
            {...this.props.evts}
            onChange = {this.handleChange}
            onBlur = {this.handleBlur}
            value={this.state.value}
            ref = "InputField"
            hasFeedback
        />);
    }
});


/**
 * Champ texte editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param area: bool, input type area ou non, false par défaut
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
        area: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
            area: false
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
                    area       = {this.props.area}
                    validator  = {this.props.validator}
                />
            }
            else {
                retour = <InputText
                    attributes = {this.props.attributes}
                    evts       = {this.props.evts}
                    ref        = "Editable"
                    gestMod    = {this.props.gestMod}
                    area       = {this.props.area}
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
            validator: function (val, props, state) {
                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    return {isValid: false, style: 'default', tooltip: ''};
                } else if (val.length == 0) {
                    return {isValid: true, style: 'default', tooltip: ''};
                }
                else if (Validator.isEmail(val)) {
                    return {isValid: true, style: 'success', tooltip: ''};
                }
                else {
                    return {isValid: false, style: 'error', tooltip: Lang.get('global.validation_erreur_mail')};
                }
            }
        }
    },

    render: function () {
        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var propsAttrs = _.cloneDeep(this.props.attributes);
        propsAttrs = _.omit(propsAttrs, ['help', 'data-valid']);
        var attrs = _.extend(propsAttrs, this.state.attributes);

        // Ajout de l'addon required si besoin
        if (typeof(this.props.attributes.required) != "undefined" && this.props.attributes.required == true) {
            attrs = addRequiredAddon(attrs, this.state.value);
        }

        return (
            <Input
                type="email"
                {...attrs}
                {...this.props.evts}
                value = {this.state.value}
                onChange={this.handleChange}
                onBlur = {this.handleBlur}
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
            validator: function (val, props, state) {
                var retour = {};
                // CHAMP OK
                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    return {isValid: false, style: 'default', tooltip: ''};
                } else if (val.length == 0) {
                    return {isValid: true, style: 'default', tooltip: ''};
                }
                else if (val.length >= 6 && (!Validator.isAlpha(val) && !Validator.isNumeric(val))) {
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
        var propsAttrs = _.cloneDeep(this.props.attributes);
        propsAttrs = _.omit(propsAttrs, ['help', 'data-valid']);
        var attrs = _.extend(propsAttrs, this.state.attributes);

        // Ajout de l'addon required si besoin
        if (typeof(this.props.attributes.required) != "undefined" && this.props.attributes.required == true) {
            attrs = addRequiredAddon(attrs, this.state.value);
        }

        return (
            <Input
                type="password"
                    {...attrs}
                    {...this.props.evts}
                value = {this.state.value}
                onChange={this.handleChange}
                onBlur = {this.handleBlur}
                ref = "InputField"
                hasFeedback
            />
        );
    }
});

/**
 * Champ mot de passe => si pas editable INPUT devient LABEL.
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
 * Champ select (react-select)
 * @param data: array(array(label:'Framboise', value:0), array(label:'Pomme', value:1))
 * @param selectedValue: array('0', '1')
 * @param placeholder: string, par défaut 'Sélection..'
 * @param multi: bool, à choix multiple, par défaut non
 * @param attributes: props de Input (react bootstrap) ex: {label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onChange: maFonction}
 */
var InputSelect = React.createClass({

    propTypes: {
        data: React.PropTypes.array.isRequired,
        selectedValue: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        multi: React.PropTypes.bool,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        };
    },

    // ATTENTION: getInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {

        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        //var attrs = this.props.attributes;
        //attrs = _.merge(this.state.attributes, this.props.attributes);

        return <Row>
            <Col md={(this.props.attributes.labelCol !== undefined ? this.props.attributes.labelCol : 6)}>
                <label>{(this.props.attributes.label !== undefined ? this.props.attributes.label : '')}</label>
            </Col>
            <Col md={(this.props.attributes.selectCol !== undefined ? this.props.attributes.selectCol : 6)}>
                <Select
                    name={this.props.attributes.name}
                    value={this.props.selectedValue}
                    options={this.props.data}
                    placeholder={this.props.placeholder}
                    multi={this.props.multi}
                    {...this.props.attributes}
                    {...this.props.evts}
                    matchProp="label"
                    ref = "InputField"
                    hasFeedback
                />
            </Col>
        </Row>;
    }
});

/**
 * Champ select editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param data: array(array(label:'Framboise', value:0), array(label:'Pomme', value:1))
 * @param selectedValue: array('0', '1')
 * @param placeholder: string, par défaut 'Sélection..'
 * @param multi: bool, à choix multiple, par défaut non
 * @param attributes: props de Input (react bootstrap) ex: {label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputSelectEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        data: React.PropTypes.array.isRequired,
        selectedValue: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        multi: React.PropTypes.bool,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
            placeholder: Lang.get('global.select'),
            multi: false
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {
            retour = <InputSelect
                attributes = {this.props.attributes}
                evts       = {this.props.evts}
                selectedValue = {this.props.selectedValue}
                placeholder   = {this.props.placeholder}
                ref        = "Editable"
                gestMod    = {this.props.gestMod}
                data       = {this.props.data}
                multi      = {this.props.multi}
                autocomplete="both"/>;
        }
        // Non editable
        else {

            /* Récupère les valeurs depuis les datas en mode non éditable */
            var attrs = this.props.attributes;
            var that = this;
            var firstPassage = true;
            attrs.value = '';
            _.each(this.props.selectedValue, function (val) {
                if (firstPassage == false)
                    attrs.value += ', ';
                attrs.value += that.props.data[val]['label'];
                firstPassage = false;
            }, that);
            /* FIN : Récupère les valeurs depuis les datas en mode non éditable */

            retour = modeEditableFalse(attrs);
        }

        return retour;
    }
});

/**
 * Champ nombre
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
var InputNumber = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        step: React.PropTypes.number,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            min: -9999999999,
            max: 9999999999,
            step: 1,
            attributes: {},
            evts: {},
            gestMod: true,
            onChange: this.handleChange,
            validator: function (val, props, state) {

                /* Pour résoudre le problème de float accuracy */
                var resModulo = (val / props.step).toFixed(1);
                var test = resModulo + '';
                var aTest = test.split('.');

                /* Champ vide obligatoire ? */
                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    return {isValid: false, style: 'default', tooltip: ''};
                }
                else if (val.length == 0) {
                    return {isValid: true, style: 'default', tooltip: ''};
                }
                /* Valeur non correct */
                else if (val < props.min || val > props.max || aTest[1] != 0) {
                    var tooltip = Lang.get('global.saisieNumber');
                    tooltip = tooltip.replace('[min]', props.min);
                    tooltip = tooltip.replace('[max]', props.max);
                    var step = props.step + '';
                    step = step.replace('.', ',');
                    tooltip = tooltip.replace('[pas]', step);
                    return {isValid: false, style: 'error', tooltip: tooltip};
                }
                /* Valeur correct */
                else {
                    return {isValid: true, style: 'success', tooltip: ''};
                }
            }
        };
    },

    // ATTENTION: getInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {

        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var propsAttrs = _.cloneDeep(this.props.attributes);
        propsAttrs = _.omit(propsAttrs, ['help', 'data-valid']);
        var attrs = _.extend(propsAttrs, this.state.attributes);

        // Ajout de l'addon required si besoin
        if (typeof(this.props.attributes.required) != "undefined" && this.props.attributes.required == true) {
            attrs = addRequiredAddon(attrs, this.state.value);
        }

        // 4. ATTRS OK, CREATION INPUT
        return <Input
            type="number"
            step={this.props.step}
            {...attrs}
            {...this.props.evts}
            onChange = {this.handleChange}
            value={this.state.value}
            ref = "InputField"
            hasFeedback
        />;
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
var InputNumberEditable = React.createClass({

    propTypes: {
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        step: React.PropTypes.number,
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {value: ''},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {// 4. ATTRS OK, CREATION INPUT
            retour = <InputNumber
                defaultValue = {this.props.attributes.value}
                attributes = {this.props.attributes}
                min        = {this.props.min}
                max        = {this.props.max}
                step       = {this.props.step}
                evts       = {this.props.evts}
                ref        = "Editable"
                gestMod    = {this.props.gestMod}
            />
        }
        // Non editable
        else
            retour = modeEditableFalse(this.props.attributes);

        return retour;
    }
});


/**
 * Champ nombre
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
var InputTel = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
            onChange: this.handleChange,
            validator: function (val, props, state) {

                var tel = val + '';
                var telSansEspace = tel.replace(/ /g, '').replace(/\+/g, '');
                var telNumber = telSansEspace * 1;
                var bool = !isNaN(telNumber);

                /* Champ vide */
                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    return {isValid: false, style: 'default', tooltip: ''};
                }
                else if (val.length == 0) {
                    return {isValid: true, style: 'default', tooltip: ''};
                }
                /* Valeur non correct */
                else if (!bool) {
                    return {isValid: false, style: 'error', tooltip: Lang.get('global.inputTelError')};
                }
                /* Valeur correct */
                else {
                    return {isValid: true, style: 'success', tooltip: ''};
                }
            }
        };
    },

    // ATTENTION: getInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {

        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var propsAttrs = _.cloneDeep(this.props.attributes);
        propsAttrs = _.omit(propsAttrs, ['help', 'data-valid']);
        var attrs = _.extend(propsAttrs, this.state.attributes);

        // Ajout de l'addon required si besoin
        if (typeof(this.props.attributes.required) != "undefined" && this.props.attributes.required == true) {
            attrs = addRequiredAddon(attrs, this.state.value);
        }

        // 4. ATTRS OK, CREATION INPUT
        return <Input
            type="tel"
            {...attrs}
            {...this.props.evts}
            onChange = {this.handleChange}
            value={this.state.value}
            ref = "InputField"
            hasFeedback
        />;
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
var InputTelEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {value: ''},
            evts: {},
            gestMod: true
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {// 4. ATTRS OK, CREATION INPUT
            retour = <InputTel
                defaultValue = {this.props.attributes.value}
                attributes = {this.props.attributes}
                evts       = {this.props.evts}
                ref        = "Editable"
                gestMod    = {this.props.gestMod}
            />
        }
        // Non editable
        else
            retour = modeEditableFalse(this.props.attributes);

        return retour;
    }
});


/**
 * Created by yann on 12/01/2015.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 * @param typeOfFile : all, docs, word, excel, pdf, txt, img
 */
var InputFile = React.createClass({
    mixins: [MixinInputValue],

    propTypes: {
        name: React.PropTypes.string.isRequired,
        typeOfFile: React.PropTypes.string,
        alertOn: React.PropTypes.bool,
        style: React.PropTypes.string,
        libelle: React.PropTypes.string,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
            onChange: this.handleChange,
            style: "btn-primary",
            libelle: "Upload",
            typeOfFile: 'all',
            alertOn: false,
            validator: function (val, props, state) {

                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    return {isValid: false, style: 'default', tooltip: ''};
                }
                else if (val.length == 0 || checkFileExtension(val, props.typeOfFile, props.alertOn)) {
                    return {isValid: true, style: 'default', tooltip: ''};
                }
                else {
                    return {isValid: false, style: 'default', tooltip: ''};
                }
            }
        };
    },
    render: function () {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {};

        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var propsAttrs = _.cloneDeep(this.props.attributes);
        propsAttrs = _.omit(propsAttrs, ['help', 'data-valid']);
        var attrs = _.extend(propsAttrs, this.state.attributes);

        // 4. ATTRS OK, CREATION INPUT
        return (
            <div className={"fileUpload btn " + this.props.style}>
                <span>{this.props.libelle}</span>
                <Input
                    type="file"
                    name={this.props.name}
                    className="upload"
                    {...attrs}
                    {...gestMod}
                    {...this.props.evts}
                    onChange = {this.handleChange}
                    ref = "InputField"
                />
                ;
            </div>
        );
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
            <label {...this.props.evts} {...this.props.attributes} className={classBtn + ' ' + this.props.attributes.className}>
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
        } else {
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
        if (!this.props.editable) {
            attr = _.extend(attr, {disabled: true});
        } else {
            attr = _.extend(attr, {disabled: false});
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
module.exports.InputTelEditable = InputTelEditable;
module.exports.InputTel = InputTel;
module.exports.InputSelect = InputSelect;
module.exports.InputSelectEditable = InputSelectEditable;
module.exports.InputNumber = InputNumber;
module.exports.InputNumberEditable = InputNumberEditable;
module.exports.InputFile = InputFile;


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

function addRequiredAddon(attrs, value) {
    return _.extend(attrs, {
        addonBefore: <OverlayTrigger placement="top" overlay={<Tooltip>
            {Lang.get('global.champ_obligatoire')}
        </Tooltip>}>
            <Glyphicon glyph="asterisk" />
        </OverlayTrigger>
    });
}

/**
 * Verifie l'extension d'un fichier
 * @param value: value de l'input type="file"
 * @param mode: voir le case (all, docs, word, excel, pdf, txt, img)
 * @param withAlert: booléen si on affiche ou non une alert si l'extension n'est pas bonne
 * @return booléen
 */
function checkFileExtension(value, mode, withAlert) {
    var filePath = value;
    //console.log('checkFileExtension');
    //console.log('filePath : '+filePath);
    //console.log('mode : '+mode);
    //console.log('withAlert : %o', withAlert);

    if (filePath.indexOf('.') == -1)
        return false;

    var validExtensions = [];
    var ext = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
    switch (mode) {
        case 'all':
            validExtensions[0] = 'jpg';
            validExtensions[1] = 'bmp';
            validExtensions[2] = 'png';
            validExtensions[3] = 'gif';
            validExtensions[4] = 'txt';
            validExtensions[5] = 'doc';
            validExtensions[6] = 'docx';
            validExtensions[7] = 'xls';
            validExtensions[8] = 'xlsx';
            validExtensions[9] = 'pdf';
            break;
        case 'docs':
            validExtensions[0] = 'doc';
            validExtensions[1] = 'docx';
            validExtensions[2] = 'pdf';
            break;
        case 'word':
            validExtensions[0] = 'doc';
            validExtensions[1] = 'docx';
            break;
        case 'excel':
            validExtensions[0] = 'xls';
            validExtensions[1] = 'xlsx';
            break;
        case 'pdf':
            validExtensions[0] = 'pdf';
            break;
        case 'txt':
            validExtensions[0] = 'txt';
            break;
        case 'img':
            validExtensions[0] = 'jpg';
            validExtensions[1] = 'jpeg';
            validExtensions[2] = 'bmp';
            validExtensions[3] = 'png';
            validExtensions[4] = 'gif';
            break;

        default:
            break;
    }

    for (var i = 0; i < validExtensions.length; i++) {
        if (ext == validExtensions[i])
            return true;
    }
    var temp = '';
    for (var i = 0; i < validExtensions.length; i++) {
        temp = temp + '.' + validExtensions[i] + '\n';
    }

    var str = Lang.get('global.erreurFileInput');
    str = str.replace('[extensions]', temp);

    if (withAlert)
        swal(str);

    return false;
}