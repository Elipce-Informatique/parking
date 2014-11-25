/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 */

var isEdtitableStore = require('./store_is_editable');
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;

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
        
//        var inactif = (this.state.bEditable?{}:{'disabled':'disabled'});
    var inactif = {'disabled':!this.state.bEditable};
        
        return (
        <div className="col-md-12 bandeau" > 
            <h1>{this.props.titre}</h1>
            <ButtonToolbar>
                <Button  id="btn_creer" bsSize="small" bsStyle="success"><Glyphicon glyph="plus-sign"/> {Lang.get('global.create')}</Button>
                <Button  id="btn_edit" bsSize="small" bsStyle="primary" {...inactif}><Glyphicon glyph="pencil"/> {Lang.get('global.edit')}</Button>
                <Button  id="btn_del" bsSize="small" bsStyle="danger" {...inactif}><Glyphicon glyph="minus-sign"/> {Lang.get('global.del')}</Button>
            </ButtonToolbar>
         </div>
        )
    }
});

module.exports = ReactBandeau;
