
/**
 * Champ texte
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputText = React.createClass({

    propTypes: {
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object
    },
    GetDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
        return (
            <Input
            type="text"
                {...this.props.attributes}
                {...this.props.evts}
            />
        );
    }
});

module.exports = InputText;


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

    GetDefaultProps: function(){
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
                            {...this.props.attributes}
                            {...this.props.evts}
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

module.exports = InputTextEditable;