/**
 * Mixin permettant le gérer la value des inputs
 * Pré-requis: le mixin est utilisé sur un composant ayant une ref="InputField"
 *
 */
var InputValueMixin = {

    handleChange: function(e) {
        // Mise à jour de l'état du composant
        this.setState({
            value: this.refs.InputField.getValue()
        });
        // OnChange DEV existe
        if(this.props.evts.onChange !== undefined){
            this.props.evts.onChange(e);
        }
    },
    getInitialState: function(){
        // Value par défaut
        var val = '';
        if(this.props.attributes.value !== undefined){
            val = this.props.attributes.value;
        }
        return {value: val};
    },

    componentWillReceiveProps: function(newProps){
        // Value par défaut
        var val = '';
        if(newProps.attributes.value !== undefined){
            val = newProps.attributes.value;
        }
        this.setState ({value: val});
    }
};

/**
 * Mixin permettant de gérer le chack des radio et checkbox
 * Pré-requis: le mixin est utilisé sur un composant ayant une ref="Checkable"
 *
 */
var InputCheckableMixin = {

    handleChange: function(e) {
        // Mise à jour de l'état du composant
        //console.log('Checked %o',this.refs.Checkable.getChecked());
        this.setState({
            checked: this.refs.Checkable.getChecked()
        });
        // OnChange DEV existe
        if(this.props.evts.onChange !== undefined){
            this.evts.onChange(e);
        }
    },
    getInitialState: function(){
        // Etat par défaut
        var coche = false;
        if(this.props.attributes.checked !== undefined){
            coche = this.props.attributes.checked;
        }
        return {checked: coche};
    },

    componentWillReceiveProps: function(newProps){
        // Value par défaut
        var coche = false;
        if(newProps.attributes.checked !== undefined){
            coche= newProps.attributes.checked;
        }
        this.setState ({checked: coche});
    }
};

module.exports.InputValueMixin = InputValueMixin;
module.exports.InputCheckableMixin = InputCheckableMixin;
