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
        var attrs = this.getStateAttributes(val);

        // MISE À JOUR DE L'ÉTAT DU COMPOSANT
        this.setState({attributes: attrs, value: val});

        // y. DÉCLENCHEMENT DE LA VALIDATION MÉTIER (AU NIVEAU DU FORMULAIRE)
        if (attrs['data-valid']) {
            Actions.validation.form_field_changed({
                name: this.props.attributes.name,
                value: val,
                form: this.props.form
            });
        }

        // ONCHANGE DEV EXISTE
        if (this.props.evts.onChange !== undefined) {
            this.props.evts.onChange(e);
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

        // CRÉATION DES ATTRIBUTS POUR LE STATE
        var attrs = this.getStateAttributes(val);

        // MISE À JOUR DE L'ÉTAT DU COMPOSANT
        this.setState({attributes: attrs, value: val});
    },

    getStateAttributes: function (val) {
        var attrs = {}

        // 1. MERGE ATTRS AVEC GESTION MODIF
        attrs = _.merge((this.props.gestMod ? {'data-gest-mod': this.props.gestMod} : {}), attrs);

        // 2. VALIDATION VALUE
        var validation = this.props.validator(val);

        // 3. ATTR DATA-VALID
        attrs = _.merge({'data-valid': validation.isValid}, attrs);

        // 4. AJOUT DU STYLE REACTB
        var style = {'bsStyle': (!Validator.matches(validation.style, 'success|warning|error', 'i') ? undefined : validation.style)};
        if (validation.tooltip.length > 0) {
            style.help = validation.tooltip;
        }
        attrs = _.merge(style, attrs);

        return attrs;
    }
};

/**
 * Mixin permettant de gérer le chack des radio et checkbox
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
