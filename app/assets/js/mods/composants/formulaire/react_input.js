var Input = ReactB.Input;

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
            evts: {onChange:this.handleChange}
        }
    },

    getInitialState: function(){
        var val = '';
        if(this.props.attributes.value !== undefined){
            val = this.props.attributes.value;

        }
        return {value: val};
    },



    componentWillReceiveProps: function(newProps){
        var val = '';
        console.log('tributes %o',this.props.attributes);
        if(this.props.attributes.value !== undefined){
            val = this.props.attributes.value;

        }
        console.log(val);
        this.setState ({value: val});
    },

    render: function() {
        return (
            <Input
            type="text"
                {...this.props.attributes}
                {...this.props.evts}
                value = {this.state.value}
            />
        );
    },

    handleChange: function() {
        this.setState({
            value: this.refs.input.getValue()
        });
    }
});



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
                            attributes = {this.props.attributes}
                            evts = {this.props.evts}
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

/**
 * Champ mail
 */
var InputMail = React.createClass({

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
            type="email"
                {...this.props.attributes}
                {...this.props.evts}
            />
        );
    }
});


/**
 * Champ mail editable => si pas editable INPUT devient LABEL.
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var InputMailEditable = React.createClass({

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
            attributes = {this.props.attributes}
            evts = {this.props.evts}
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

module.exports.InputText = InputText;
module.exports.InputTextEditable = InputTextEditable;
module.exports.InputMail = InputMail;
module.exports.InputMailEditable = InputMailEditable;