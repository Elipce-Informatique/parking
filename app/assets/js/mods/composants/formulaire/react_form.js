var React = require('react/addons');
// MIXIN
var FormValidationMixin = require('../../mixins/form_validation')

/**
 * Formulaire contenant le mixin FormValidation pour gérer la validation syntaxique des champs
 * et déclencher la validation métier si la syntaxe est ok
 *
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var Form = React.createClass({

    mixins: [Reflux.ListenerMixin, FormValidationMixin],

    propTypes: {
        attributes:React.PropTypes.object,
        evts: React.PropTypes.object
    },

    getDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
        return (
            <form
                {...this.props.attributes}
                {...this.props.evts}
                ref="form"
            >
                {this.props.children}
            </form>
        );
    }
});
module.exports = Form;