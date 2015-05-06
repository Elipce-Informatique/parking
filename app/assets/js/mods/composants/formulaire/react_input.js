var React = require('react/addons');
var Input = ReactB.Input;
var OverlayTrigger = ReactB.OverlayTrigger;
var Tooltip = ReactB.Tooltip;
var Glyphicon = ReactB.Glyphicon;
var Validator = require('validator');
var Select = require('react-select');
var ButtonGroup = ReactB.ButtonGroup;
// Time
var moment = require('moment');
require('moment/locale/fr');
require('moment/locale/en-gb');
moment.locale(Lang.locale());

/*********/
/* Mixin */
var MixinInput = require('../../mixins/input_value');
var MixinInputValue = MixinInput.InputValueMixin;
var MixinInputChecked = MixinInput.InputCheckableMixin;

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

/**
 * Champ texte
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: active ou non la gestion des modifications sur le champ
 * @param area: bool, input type area ou non, false par défaut
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
        gestMod: React.PropTypes.bool,
        area: React.PropTypes.bool,
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
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

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

        // Text ou Textarea
        var type = this.props.area ? "textarea" : "text";

        return (
            <Input
                type={type}
                {...attrs}
                {...this.props.evts}
                onChange = {this.handleChange}
                onBlur = {this.handleBlur}
                value={this.state.value}
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
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: active ou non la gestion des modifications sur le champ
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
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: active ou non la gestion des modifications sur le champ
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

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

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
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: active ou non la gestion des modifications sur le champ
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
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: active ou non la gestion des modifications sur le champ
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

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

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
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: active ou non la gestion des modifications sur le champ
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
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
 * @param data: array({label:'Framboise', value:0}, {label:'Pomme', value:1})
 * @param selectedValue: array('0', '1')
 * @param placeholder: string, par défaut 'Sélection..'
 * @param multi: bool, à choix multiple, par défaut non
 * @param attributes: attributs HTML du select:
 *                  - name
 *                  - label: label devant le select
 *                  - labelCol: nombre de colonnes bootstrap du label
 *                  - selectCol: nombre de colonnes bootstrap du select
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onChange: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 * @param labelClass: string: classe CSS à ajouter au Col qui entoure le label ex: text-right
 */
var InputSelect = React.createClass({

    propTypes: {
        data: React.PropTypes.array.isRequired,
        selectedValue: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string
        ]),
        placeholder: React.PropTypes.string,
        multi: React.PropTypes.bool,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        validator: React.PropTypes.func,
        labelClass: React.PropTypes.string
    },

    getInitialState: function () {
        return {
            attributes: {
                'data-valid': true,
                'data-class': 'has-default',
                'data-tooltip': ''
            }
        };
    },

    getDefaultProps: function () {
        return {
            attributes: {labelCol: '6', selectCol: '6', required: false},
            evts: {},
            gestMod: true,
            delimiter: '[-]',
            name: '',
            labelClass: '',
            validator: function (val, props, state) {
                var retour = {};
                // Value vide
                if (val.length == 0) {
                    retour = {
                        'data-valid': !props.attributes.required,
                        'data-class': (props.attributes.required ? 'has-error' : 'has-default'),
                        'data-tooltip': ''
                    };
                }
                // Option sélectionnée
                else {
                    retour = {'data-valid': true, 'data-class': 'has-success', 'data-tooltip': ''};
                }
                return retour;
            }
        };
    },

    componentWillMount: function () {

        // Validations syntaxiques
        var validations = this.props.validator(this.props.selectedValue, this.props, this.state);

        // Nouvelle value
        this.setState({attributes: validations});
    },

    /**
     * Gestion des modifications+
     * Action field_change +
     * Action field_verif (vérifications métier)
     *
     * @param val: value du select
     * @param data: array of selected options
     */
    handleChange: function (val, data) {
        // Gestion des modifications
        Actions.global.gestion_modif_change();

        // Validations syntaxiques
        var validations = this.props.validator(val, this.props, this.state);

        // Action indiquant un CHANGE => permet de mettre à jour le state du store
        Actions.validation.form_field_changed({
            name: this.props.attributes.name,
            value: val,
            form: this.props.attributes.htmlFor
        });

        // Validation syntaxique OK => envoi d'une action permettant une éventuelle vérification métier
        if (validations['data-valid']) {
            Actions.validation.form_field_verif({
                name: this.props.attributes.name,
                value: val,
                form: this.props.attributes.htmlFor
            });
        }

        // Nouvelle value
        this.setState({attributes: validations, value: val.split(this.props.delimiter)});

        // onChange DEV
        if (this.props.evts.onChange !== undefined) {
            this.props.evts.onChange(val, data);
        }
    },

    /**
     * Seulement les evenements définis par le user
     * @param e
     * @param data
     */
    handleBlur: function (e, data) {

        // onBlur DEV
        if (this.props.evts.onBlur !== undefined) {
            this.props.evts.onBlur(e, data);
        }
    },


    render: function () {
        // Copie attributes
        var attrs = _.cloneDeep(this.props.attributes);

        // Ajout des attributs state
        attrs = _.extend(attrs, this.state.attributes);

        // Suppression de name, label, labelCol, selectCol
        attrs = _.omit(attrs, ['name', 'label', 'labelCol', 'selectCol']);

        var val = {};
        if (this.props.selectedValue !== '') {
            val = {value: this.props.selectedValue};
        }
        //console.log('ATTRIBUTES %o',attrs);
        var select =
            <Select
                inputProps={attrs}
                name={this.props.attributes.name}
                {...val}
                options={this.props.data}
                placeholder={this.props.placeholder}
                multi={this.props.multi}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                matchProp="label"
                ref = "SelectField"
                delimiter = {this.props.delimiter}
            />;

        // Select non requis
        var ctnSelect = select;
        // Select requis
        if (attrs.required) {
            ctnSelect =
                <div className="input-group">
                    <span className="input-group-addon glyphicon glyphicon-asterisk" id="basic-addon1"></span>
                    {select}
                </div>;
        }

        var label;
        // Avec label
        if (this.props.attributes.label !== undefined) {
            label = (
                <Col
                    md={this.props.attributes.labelCol}
                    className={attrs['data-class'] + ' ' + this.props.labelClass}>
                    <label className="control-label">
                        {this.props.attributes.label}
                    </label>
                </Col>
            );
        }

        return (
            <Row className="form-group">
                {label}
                <Col md={this.props.attributes.selectCol}>
                    {ctnSelect}
                </Col>
            </Row>);
    }
});

/**
 * Champ select editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param data: [   {label:'Framboise', value:0, ce que l'on veut...},
 *                  {label:'Pomme', value:1, ce que l'on veut...}
 *              ]
 * @param selectedValue: array('0', '1') ou valeur
 * @param placeholder: string, par défaut 'Sélection..'
 * @param multi: bool, à choix multiple, par défaut non
 * @param attributes: attributs HTML du select:
 *                  - name
 *                  - label: label devant le select
 *                  - labelCol: nombre de colonnes bootstrap du label
 *                  - selectCol: nombre de colonnes bootstrap du select
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 * @param labelClass: string: classe CSS à ajouter au Col qui entoure le label ex: text-right
 */
var InputSelectEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        data: React.PropTypes.array.isRequired,
        selectedValue: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string
        ]),
        placeholder: React.PropTypes.string,
        multi: React.PropTypes.bool,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        labelClass: React.PropTypes.string
    },

    getDefaultProps: function () {

        return {
            attributes: {labelCol: '6', selectCol: '6'},
            evts: {},
            gestMod: true,
            placeholder: Lang.get('global.select'),
            multi: false,
            selectedValue: '',
            labelClass: ''
        }
    },

    render: function () {
        var retour;
        // Editable
        if (this.props.editable) {
            retour =
                <InputSelect
                    attributes = {this.props.attributes}
                    evts       = {this.props.evts}
                    selectedValue = {this.props.selectedValue}
                    placeholder   = {this.props.placeholder}
                    ref        = "Editable"
                    gestMod    = {this.props.gestMod}
                    data       = {this.props.data}
                    multi      = {this.props.multi}
                    labelClass  = {this.props.labelClass}
                    autocomplete="both"
                />;
        }
        // Non editable
        else {
            /* Récupération des libellés en fonction des valeurs */
            var aValues = [];
            // Valeurs multiples
            if (this.props.multi) {
                // Tableau de values existe
                if (typeof this.props.selectedValue === 'object') {
                    // Parcours des valeurs sélectionnées
                    this.props.selectedValue.forEach(function (val, indexSelect) {
                        // Parcours des données du selecteur
                        this.props.data.forEach(function (obj, indexData) {
                            if (obj.value !== undefined && obj.value == val) {
                                aValues.push(obj.label);
                            }
                        }.bind(this))

                    }.bind(this));
                }
            }
            // Mode combobox
            else {
                // Parcours des data
                this.props.data.forEach(function (obj, index) {
                    // Donnée sélectionnée
                    if (obj.value == this.props.selectedValue) {
                        aValues.push(obj.label);
                    }
                }.bind(this));
            }
            // Chaines de caractères
            retour = (
                <Row>
                    <Col md={this.props.attributes.labelCol} className={this.props.labelClass}>
                        <label>
                            <span>{this.props.attributes.label}</span>
                        </label>
                    </Col>
                    <Col md={this.props.attributes.selectCol}>
                        <span>{aValues.join(', ')}</span>
                    </Col>
                </Row>
            )
        }

        return retour;
    }
});

/**
 * Champ nombre
 * @param min: valeur minimale du champ InputNumber. ex: 0
 * @param max: valeur minimale du champ InputNumber. ex: 100
 * @param step: pas d'incrémentation ou de décrémentation, par défaut 1.
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
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
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            min: -9999999999,
            max: 9999999999,
            step: 1,
            attributes: {},
            evts: {},
            gestMod: true,
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

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

        return (
            <Input
                type="number"
                step={this.props.step}
                {...attrs}
                {...this.props.evts}
                onChange = {this.handleChange}
                onBlur = {this.handleBlur}
                value={this.state.value}
                ref = "InputField"
                hasFeedback
            />
        )
    }
});


/**
 * Champ texte editable => si pas editable INPUT devient LABEL.
 * @param min: valeur minimale du champ InputNumber. ex: 0
 * @param max: valeur minimale du champ InputNumber. ex: 100
 * @param step: pas d'incrémentation ou de décrémentation, par défaut 1.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
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
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
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
        validator: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
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

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

        return <Input
            type="tel"
            {...attrs}
            {...this.props.evts}
            onChange = {this.handleChange}
            onBlur = {this.handleBlur}
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
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
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
 * Champ upload stylé
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

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

        return (
            <div className={"fileUpload btn " + this.props.style}>
                <span>{this.props.libelle}</span>
                <Input
                    type="file"
                    name={this.props.name}
                    className="upload"
                    {...attrs}
                    {...this.props.evts}
                    onChange = {this.handleChange}
                    ref = "InputField"
                />
                ;
            </div>
        );
    }
});

/**
 * Champ Date
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputDate = React.createClass({
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
                // Champ obligatoire + vide
                //console.log('length:'+val.length+' required: '+typeof(props.attributes.required));
                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    return {isValid: false, style: 'default', tooltip: ''};
                    // Champ optionnel + vide
                } else if (val.length == 0) {
                    return {isValid: true, style: 'default', tooltip: ''};
                }
                // Champ rempli + valide
                else if (moment().isValid(val)) {
                    return {isValid: true, style: 'success', tooltip: ''};
                }
                // Format erroné
                else {
                    return {isValid: false, style: 'error', tooltip: Lang.get('global.validation_erreur_date')};
                }
            }
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

        // Affichage
        return (
            <Input
                type="date"
                {...attrs}
                {...this.props.evts}
                onChange = {this.handleChange}
                onBlur = {this.handleBlur}
                value={this.state.value}
                ref = "InputField"
                hasFeedback
            />
        );
    }
});

/**
 * Champ date editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 */
var InputDateEditable = React.createClass({

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
        if (this.props.editable) {
            retour = <InputDate
                defaultValue = {this.props.attributes.value}
                attributes = {this.props.attributes}
                evts       = {this.props.evts}
                ref        = "Editable"
                gestMod    = {this.props.gestMod}
            />
        }
        // Non editable
        else {
            // Format d'affichage de la date en fonction de la langue
            var date = moment(this.props.attributes.value).format('L');
            var attrs = _.cloneDeep(this.props.attributes);
            attrs.value = date;
            // Création du HTML
            retour = modeEditableFalse(attrs);
        }

        return retour;
    }
});


/**
 * Champ Time: heure / min / sec
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 * @param validator: function - facultatif, appellé sur onChange pour valider le contenu de l'input, retourne un objet comme ci-dessous:
 * {
 *      isValid: false|true
 *      style: 'success|warning|error|default',
 *      tooltip 'La donnée saisie est déjà présente dans la base de données.'
 * }
 */
var InputTime = React.createClass({
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
            validator: function (val, props, state, inputNode) {
                //console.log('length:'+val.length+' required: '+typeof(props.attributes.required));

                // Champ obligatoire + vide
                if (val.length == 0 && typeof(props.attributes.required) != 'undefined') {
                    var tooltip = '';
                    // Champ invalidé par HTML + vidé automatiquement => Le test est effectué dans le mixin pour ce qui est de la coloration rouge
                    if (inputNode !== undefined && $(inputNode).find(':invalid').length > 0) {
                        tooltip = Lang.get('global.validation_erreur_time');
                    }
                    return {isValid: false, style: 'default', tooltip: tooltip};
                }
                // Champ optionnel + vide
                else if (val.length == 0) {
                    var tooltip = '';
                    // Champ invalidé par HTML + vidé automatiquement
                    if (inputNode !== undefined && $(inputNode).find(':invalid').length > 0) {
                        tooltip = Lang.get('global.validation_erreur_time');
                    }
                    return {isValid: true, style: 'default', tooltip: tooltip};
                }
                // Champ rempli + valide
                else if (moment().isValid(val)) {
                    return {isValid: true, style: 'success', tooltip: ''};
                }
                // Format erroné => NE PEUT PASSER DANS CE CAS CAR HTML5 VIDE LE CHAMP
                else {
                    return {isValid: false, style: 'error', tooltip: Lang.get('global.validation_erreur_time')};
                }
            }
        }
    },

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {

        // IMPORTANT Génère les attributs à passer à l'INPUT (attributs du DEV + ceux du MIXIN)
        var attrs = this.generateAttributes();

        // Affichage
        return (
            <Input
                type="time"
                {...attrs}
                {...this.props.evts}
                onChange = {this.handleChange}
                onBlur = {this.handleBlur}
                value={this.state.value}
                ref = "InputField"
                hasFeedback
            />
        );
    }
});


/**
 * Champ time editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 *          SPECIFICITE: {for: id_du_form} permet de lier le champ au formulaire souhaité.
 *          Indispensable lorsqu'il y a plusieurs formulmaires dans la même page.
 *          Permet de distinguer 2 champs au name identique de deux formulaires différents
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 */
var InputTimeEditable = React.createClass({

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
        if (this.props.editable) {
            retour = <InputTime
                defaultValue = {this.props.attributes.value}
                attributes = {this.props.attributes}
                evts       = {this.props.evts}
                ref        = "Editable"
                gestMod    = {this.props.gestMod}
            />
        }
        // Non editable
        else {
            // Création du HTML
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
 * Doit être utilisé dans un RadioGroup pour la gestion multi-radio avec le même name
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 */
var InputRadio = React.createClass({
    mixins: [MixinInputChecked],

    propTypes: {
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

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        // Gestion des modifications
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {};

        return (
            <Input
                type="radio"
                {...this.props.attributes}
                {...this.props.evts}
                {...gestMod}
                ref = "Checkable"
            />
        );
    }
});

/**
 * Champ radio editable  => si pas editable INPUT devient READONLY.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
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
            attr = _.extend(attr, {disabled: true});// readOnly ne fait rien
        }
        //console.log(attr);
        return (
            <InputRadio
                attributes = {attr}
                evts = {this.props.evts}
                ref="Editable"
                gestMod={this.props.gestMod}
            />
        )
    }
});

/**
 * Champ radio groupe. Permet de gérer un ensemble de radio
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param gestMod: booléen: prise en compte ou pas de la gestion des modifications
 * @param bootstrap: Mode d'affichage des radio
 *                  Si true: mettre des InputRadioBootstrapEditable en enfant
 *                  Sinon mettre des InputRadioEditable
 */
var RadioGroup = React.createClass({

    propTypes: {
        attributes: React.PropTypes.object,
        gestMod: React.PropTypes.bool,
        bootstrap: React.PropTypes.bool // mode d'affichage bootstrap (boutons)
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            gestMod: true,
            bootstrap: false
        }
    },

    getInitialState: function () {

        var matrice = {};
        // Parcours des chidren
        _.forEach(this.props.children, function (child, index) {
            //console.log('CHILD index %o', child);
            // On est sur le radio cliqué
            matrice[this.props.attributes.name + index] = child.props.attributes.checked !== undefined ? child.props.attributes.checked : false;
        }.bind(this));

        return matrice;
    },

    componentWillReceiveProps: function (np, ns) {
        var matrice = {};
        // Parcours des chidren
        _.forEach(np.children, function (child, index) {
            //console.log('CHILD index %o', child);
            // On est sur le radio cliqué
            matrice[np.attributes.name + index] = child.props.attributes.checked !== undefined ? child.props.attributes.checked : false;
        }.bind(this));

        // Maj State
        this.setState(matrice);
    },

    handleChange: function (evt) {

        // Attribut index du radio qui a déclenché le change
        var index = $(evt.currentTarget).prop('tagName') == 'INPUT' ? $(evt.currentTarget).data('index') : $(evt.currentTarget).find('input').data('index');

        // Matrice {n° radio : cheched, ....}
        var matrice = {};
        // Parcours des chidren
        _.forEach(this.props.children, function (child) {
            //console.log('CHILD index %o', child);
            // On est sur le radio cliqué
            matrice[child.props.attributes['data-index']] = (child.props.attributes['data-index'] == index);
        });

        // DÉCLENCHEMENT DE LA VALIDATION MÉTIER
        Actions.validation.form_field_changed({
            name: this.props.attributes.name,
            value: $(evt.currentTarget).prop('tagName') == 'INPUT' ? $(evt.currentTarget).val() : $(evt.currentTarget).find('input').val(),
            form: this.props.attributes.htmlFor
        });
        Actions.validation.form_field_verif({
            name: this.props.attributes.name,
            value: $(evt.currentTarget).prop('tagName') == 'INPUT' ? $(evt.currentTarget).val() : $(evt.currentTarget).find('input').val(),
            form: this.props.attributes.htmlFor
        });

        //console.log('INDEX '+ index +' MATRICE  %o',matrice);
        // Maj render
        this.setState(matrice);
    },

    /**
     *
     * @param enfants
     */
    display: function (enfants) {
        var code = '';
        // Mode bootstrap
        if (this.props.bootstrap) {
            code = (
                <ButtonGroup
                    data-toggle="buttons"
                    bsSize="xsmall"
                    key={'radio_' + this.props.attributes.name}>

                {enfants}
                </ButtonGroup>
            )
        }
        // Mode classique
        else {
            code = (
                <div className="row" key={'radio_' + this.props.attributes.name}>
                    {enfants}
                </div>);
        }
        return code;
    },

    render: function () {

        // Parcours des chidren
        var enfants = _.map(this.props.children, function (child, index) {
            // Props à ajouter
            var newProps = {
                evts: {},
                attributes: _.extend(child.props.attributes, {
                    checked: this.state[this.props.attributes.name + index],
                    name: this.props.attributes.name,
                    'data-index': this.props.attributes.name + index // index unique permettant d'identifier chaque radio
                })
            };
            // Evt en fonction de bootsrap ou radio classique
            var keyEvt = this.props.bootstrap ? 'onClick' : 'onChange';
            newProps.evts[keyEvt] = this.handleChange;

            // Clone du radio
            return React.cloneElement(child, newProps);

        }.bind(this));

        // Affichage du groupe de radio
        return this.display(enfants);

    }
});

/**
 * Champ radio bootstrap (visuel bouton)
 * @param attributes: props du radio
 * @param evts: evenements du btn
 * @param gestMod: bool: gestion des modifications
 * @param attributesLabel: props du label
 */
var InputRadioBootstrap = React.createClass({

    propTypes: {
        attributes: React.PropTypes.object, // attributs du input type radio
        evts: React.PropTypes.object, // Evts du Label (visuel bouton)
        gestMod: React.PropTypes.bool,
        attributesLabel: React.PropTypes.object // attributs du label
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
            attributesLabel: {}
        }
    },


    render: function () {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {};
        var classBtn = 'btn btn-default ';
        classBtn += this.props.attributes.checked ? 'active' : '';

        //console.log('ATTRS '+this.props.attributes.value+' %o', this.props.attributes);
        //console.log('#VALUE ' + this.props.attributes.value + ' #CHECKED ' + this.props.attributes.checked);

        return (
            <label
                {...this.props.evts}
                {...this.props.attributesLabel}
                className={classBtn + ' ' + this.props.attributes.className}>

                <input
                    {...gestMod}
                    type="radio"
                    {...this.props.attributes}
                    onChange = {function () {
                    }}
                />

                {this.props.children}
            </label>
        );
    }
});

/**
 * Champ texte editable => si pas editable INPUT devient DISABLED.
 * A utiliser dans un RadioGroup
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: bool: gestion des modifications
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
        ;

        return (
            <InputRadioBootstrap
                attributes = {this.props.attributes}
                attributesLabel = {{disabled: (!this.props.editable)}}
                evts = {this.props.evts}
                ref="Editable"
                gestMod={this.props.gestMod} >

            {this.props.children}
            </InputRadioBootstrap>
        );
    }
});


/**
 * Champ checkbox
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 * @param gestMod: bool: gestion des modifications
 */
var InputCheckbox = React.createClass({
    mixins: [MixinInputChecked],

    propTypes: {
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

    // ATTENTION: GetInitialState est déclaré dans le MIXIN, ne pas  réimplémenter la clé value dans un eventuel getInitialState local.

    render: function () {
        var gestMod = this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {};
        return (
            <Input
                type="checkbox"
                {...this.props.attributes}
                {...this.props.evts}
                {...gestMod}
                checked = {this.state.checked}
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
module.exports.RadioGroup = RadioGroup;
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
module.exports.InputDate = InputDate;
module.exports.InputDateEditable = InputDateEditable;
module.exports.InputTime = InputTime;
module.exports.InputTimeEditable = InputTimeEditable;


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