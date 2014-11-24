/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 */

var isEdtitableStore = require('./store_is_editable');
var Button = require('react-bootstrap/Button');

var ReactBandeau = React.createClass({
    mixins: [Reflux.ListenerMixin],
    
    propTypes: {
        titre: React.PropTypes.string
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {titre: 'Title'};
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
            <h1>{this.props.titre}</h1>
            <h3>Etat de l'édition: {state}</h3>
            <Button bsStyle="success">TST</Button>
            <Button bsStyle="primary">{Lang.get('global.edit')}</Button>
            <Button bsStyle="danger">{Lang.get('global.del')}</Button>
         </div>
        )
    }
 
});

module.exports = ReactBandeau;
