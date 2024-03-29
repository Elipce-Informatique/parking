var React = require('react/addons');
var Validator = require('validator');
// HELPER
var addRequiredAddon = require('../helpers/field_helper').addRequiredAddon;
/**
 * Mixin permettant le gérer la value des inputs
 * Pré-requis: le mixin est utilisé sur un composant ayant une ref="InputField"
 *
 * Ce mixin gère l'appel à la fonction validator des composants
 */
var InputValueMixin = {
    handleChange: function (e) {
        // 1. RÉCUPÉRATION DE LA VALUE
        var val = this.refs.InputField.getValue();
        // CRÉATION DES ATTRIBUTS POUR LE STATE
        var attrs = this.getStateAttributes(val, React.findDOMNode(this.refs.InputField));
        // MISE À JOUR DE L'ÉTAT DU COMPOSANT
        this.setState({attributes: attrs, value: val});
        // ONCHANGE DEV EXISTE
        if (this.props.evts.onChange !== undefined) {
            this.props.evts.onChange(e);
        }
    },
    handleBlur: function (e) {
        // 1. RÉCUPÉRATION DE LA VALUE
        var val = this.refs.InputField.getValue();
        // CRÉATION DES ATTRIBUTS POUR LE STATE
        var attrs = this.getStateAttributes(val);
        // MISE À JOUR DE L'ÉTAT DU COMPOSANT
        this.setState({attributes: attrs, value: val});

        // DÉCLENCHEMENT DE LA VALIDATION MÉTIER (AU NIVEAU DU FORMULAIRE) SI CHAMP VALIDE
        Actions.validation.form_field_changed({
            name: this.props.attributes.name,
            value: val,
            form: this.props.attributes.htmlFor
        });
        if (attrs['data-valid']) {
            Actions.validation.form_field_verif({
                name: this.props.attributes.name,
                value: val,
                form: this.props.attributes.htmlFor
            });
        }

        // ONBLUR DEV EXISTE
        if (this.props.evts.onBlur !== undefined) {
            //console.log('onBlur DEV');
            this.props.evts.onBlur(e);
        }
    },
    getInitialState: function () {
        // Value par défaut
        var val = '';
        if (this.props.attributes.value !== undefined) {
            val = this.props.attributes.value;
        }
        /// CRÉATION DES ATTRIBUTS POUR LE STATE
        var attrs = this.getStateAttributes(val);
        // MISE À JOUR DE L'ÉTAT DU COMPOSANT
        return {attributes: attrs, value: val};
    },
    componentWillReceiveProps: function (newProps) {
        // VALUE PAR DÉFAUT
        var val = '';
        if (newProps.attributes.value !== undefined) {
            val = newProps.attributes.value;
        }
        // data-valid, bsStyle, help
        var attrs = {};
        typeof(newProps.attributes['data-valid']) != 'undefined' ? attrs['data-valid'] = newProps.attributes['data-valid'] : '';
        typeof(newProps.attributes.bsStyle) != 'undefined' ? attrs.bsStyle = newProps.attributes.bsStyle : '';
        typeof(newProps.attributes.help) != 'undefined' ? attrs.help = newProps.attributes.help : '';
        attrs = _.extend(this.getStateAttributes(val), attrs);
        // MISE À JOUR DE L'ÉTAT DU COMPOSANT
        this.setState({attributes: attrs, value: val});
    },
    /**
     * Calcule les attributs à envoyer dans le state.
     * Entre autre mais IMPORTANT :Teste la validité d'un champ HTML ex: input type=date :invalid si saisie --/03/15
     * @param val: value de l'input
     * @param DOM: Element DOM input (facultatif)
     * @returns {{}}
     */
    getStateAttributes: function (val, DOM) {
        var attrs = {};
        // 1. MERGE ATTRS AVEC GESTION MODIF
        attrs = _.extend((this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {}), attrs);
        // 2. VALIDATION VALUE
        var validation = this.props.validator(val, this.props, this.state, DOM);
        // 3. ATTR DATA-VALID
        var html5Validity = true;
        if (DOM !== undefined) {
            html5Validity = $(DOM).find(':invalid').length == 0;
        }
        attrs = _.extend({'data-valid': validation.isValid && html5Validity}, attrs);
        // 4. AJOUT DU STYLE REACTB
        var style = {'bsStyle': (!Validator.matches(validation.style, 'success|warning|error', 'i') ? undefined : validation.style)};
        if (!html5Validity) {
            style = {'bsStyle': 'error'};
        }
        if (validation.tooltip.length > 0) {
            style.help = validation.tooltip;
        }
        attrs = _.extend(style, attrs);
        return attrs;
    },

    /**
     * Génère les attributs à passer au render des composant react de type Input.
     * @returns {*}
     */
    generateAttributes: function () {
        // RÉCUPÉRATION DES ATTRIBUTES DANS LE STATE
        var propsAttrs = _.cloneDeep(this.props.attributes);
        propsAttrs = _.omit(propsAttrs, ['help', 'data-valid']);
        var attrs = _.extend(propsAttrs, this.state.attributes);

        // Ajout de l'addon required si besoin
        if (this.props.attributes.required !== undefined && this.props.attributes.required) {

            // Pas d'addon sur InputFile
            if (this.props.typeOfFile === undefined) {
                attrs = addRequiredAddon(attrs, this.state.value);
            }
        }
        return attrs;
    }
};
/**
 * Mixin permettant de gérer le check des radio et checkbox
 * Pré-requis: le mixin est utilisé sur un composant ayant une ref="Checkable"
 *
 */
var InputCheckableMixin = {
    handleChange: function (e) {
        // Mise à jour de l'état du composant
        //console.log('Checked '+ this.refs.Checkable.props.label+ ' %o',this.refs.Checkable.getChecked());
        this.setState({
            checked: this.refs.Checkable.getChecked()
        });
        // OnChange DEV existe
        if (this.props.evts.onChange !== undefined) {
            this.evts.onChange(e);
        }
        // DÉCLENCHEMENT DE LA VALIDATION MÉTIER
        Actions.validation.form_field_changed({
            name: this.props.attributes.name,
            value: this.props.attributes.value,
            form: this.props.attributes.htmlFor
        });
        Actions.validation.form_field_verif({
            name: this.props.attributes.name,
            value: this.props.attributes.value,
            form: this.props.attributes.htmlFor
        });
    },
    getInitialState: function () {
        // Etat par défaut: décoché
        var coche = false;
        // Attribut checked passé
        if (this.props.attributes.checked !== undefined) {
            // Maj du state
            coche = this.props.attributes.checked;
        }
        return {checked: coche};
    }
};
module.exports.InputValueMixin = InputValueMixin;
module.exports.InputCheckableMixin = InputCheckableMixin;