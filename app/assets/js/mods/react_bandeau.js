/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 */

var isEdtitableStore = require('./store_is_editable');

var ReactBandeau = React.createClass({
    mixins: [Reflux.ListenerMixin],
    
    propTypes: {
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {};
    },
    
    getInitialState: function() {
        return {bEditable: false};
    },
    
    
    /**
     * Avant le 1er affichage
     * @returns {undefined}
     */
    componentWillMount: function(){
        
    },
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentDidMount: function(){
        this.listenTo(isEdtitableStore, this.onStatusChange);
    },
    
    onStatusChange: function(isEditable) {
        this.setState({
            bEditable: isEditable
        });
    },
    
    /**
     * Après chaque mise à jour DATA du tableau (forceupdate() ou setState())
     * @returns {undefined}
     */
    componentDidUpdate: function(){
//        console.log('DATATABLE didupdate');
    },
    
    render: function() {
        var state = (this.state.bEditable?'OK':'KO');
        return (
         <div>
            Etat de l'édition: {state}
         </div>
        )
    }
 
});

module.exports = ReactBandeau;
