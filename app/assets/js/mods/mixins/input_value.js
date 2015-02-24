var Validator = require('validator');
/**
 * Mixin permettant le gérer la value des inputs
 * Pré-requis: le mixin est utilisé sur un composant ayant une ref="InputField"
 *
 */
var InputValueMixin = {
    handleChange: function (e) {
        // 1. RÉCUPÉRATION DE LA VALUE
        var val = this.refs.InputField.getValue();
        // CRÉATION DES ATTRIBUTS POUR LE STATE
        var attrs = this.getStateAttributes(val, this.refs.InputField.getDOMNode());
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
            form: this.props.form
        });
        if (attrs['data-valid']) {
            Actions.validation.form_field_verif({
                name: this.props.attributes.name,
                value: val,
                form: this.props.form
            });
        }

        // ONBLUR DEV EXISTE
        if (this.props.evts.onBlur !== undefined) {
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
        if (typeof(DOM) != 'undefined') {
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
        //console.log('Checked %o',this.refs.Checkable.getChecked());
        this.setState({
            checked: this.refs.Checkable.getChecked()
        });
        // OnChange DEV existe
        if (this.props.evts.onChange !== undefined) {
            this.evts.onChange(e);
        }
    },
    getInitialState: function () {
        // Etat par défaut
        var coche = false;
        if (this.props.attributes.checked !== undefined) {
            coche = this.props.attributes.checked;
        }
        return {checked: coche};
    },
    componentWillReceiveProps: function (newProps) {
        // Value par défaut
        var coche = false;
        if (newProps.attributes.checked !== undefined) {
            coche = newProps.attributes.checked;
        }
        this.setState({checked: coche});
    }
};
module.exports.InputValueMixin = InputValueMixin;
module.exports.InputCheckableMixin = InputCheckableMixin;