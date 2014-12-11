
/**
 * Fiche utilisateur
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var FicheUser = React.createClass({

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
        return (
            <Input
            type="text"
                {...this.props.attributes}
                {...this.props.evts}
            />
        );
    }
});

module.exports = FicheUser;