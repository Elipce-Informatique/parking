/**
 * Mixin permettant le gérer la value des inputs
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
            this.evts.onChange(e);
        }
    },
    getInitialState: function(){
        console.log('AAAAAA');
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
}

/**
 * Mixin permettant de gérer le chack des radio et checkbox
 *
 */
var InputCheckableMixin = {

    handleChange: function(e) {
        // Mise à jour de l'état du composant
        this.setState({
            checked: this.refs.Checkable.getDOMNode().checked
        });
        // OnChange DEV existe
        if(this.props.evts.onChange !== undefined){
            this.evts.onChange(e);
        }
    },
    getInitialState: function(){
        console.log('OOOOOO');
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
}

module.exports.InputValueMixin = InputValueMixin;
module.exports.InputCheckableMixin = InputCheckableMixin;
