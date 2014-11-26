/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-*
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']
 * @param string id: attribut ID de la balise TABLE
 * @param object settings: objet JSON permettant de paramètrer dataTable voir http://www.datatables.net/reference/option/
 * @param object attributes: attributs HTML de la TABLE. ex {alt:'mon alt', colspan:2}
 * @param object evts: Evenements des lignes de tableau. ex: {click:modifierLigne, hover:mafonction}. Les clés de l'objet des évènements jquery: http://www.quirksmode.org/dom/events/
 * @param boolean bUnderline: TRUE: Evenement par defaut sur click d'une ligne: surlignage
 *                            FALSE: pas d'évènement par défaut.
 */

var DataTableBandeau = require('./react_data_table_bandeau');
var DataTableBandeauUtilisateurReact = React.createClass({
    
    mixins: [Reflux.ListenerMixin],
    
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        id: React.PropTypes.string.isRequired,
        settings:React.PropTypes.object,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        bUnderline:React.PropTypes.bool
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        
        return {
            attributes: {},
            evts:{},
            bUnderline: true};
    },
    
    getInitialState: function(){
        return {data:[]};
    },
    
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentWillMount: function(){
        this.listenTo(userStore, this.updateData, this.updateData);
        // Appel action
        Actions.utilisateur.load_data();
    },
    
    /**
     * Après le 1er affichage. ATTENTION : on a pas les nouvelles propriétés this.props
     * @returns {undefined}
     */
    componentWillUpdate: function(){
    },
    
    render: function() {
        return (
         <DataTableBandeau id={this.props.id} head={this.props.head} data={this.state.data} hide={this.props.hide} attributes={this.props.attributes} bUnderline={this.props.bUnderline} evts={this.props.evts}/>
        )
    },
    
    componentDidMount : function(){
    },
    
    componentDidUpdate: function(){
    },
    
 /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */   
    
    updateData: function(data) {
//        console.log('listen %o',data);
        this.setState({
            data: data
        });
    }
});

module.exports = DataTableBandeauUtilisateurReact;


// Creates a DataStore
var userStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.load_data, this.getData);
        
    },

    // Callback
    getData: function() {
        // AJAX
        $.ajax({
            url: BASE_URI+'utilisateur/all',
            dataType: 'json',
            context: this,
            success: function(data) {
                // Passe variable aux composants qui écoutent l'action actionLoadData
                this.trigger(data);
            },
            error: function(xhr, status, err) {
                 console.error(status, err.toString());
                 this.trigger({});
            }
        });       
    },
    
//    getInitialState:function(){
//        var dataRetour = [];
//        // AJAX
//        $.ajax({
//            url: BASE_URI+'utilisateur/all',
//            dataType: 'json',
//            context: this,
//            async:false,
//            success: function(data) {
//                dataRetour = data;
//            },
//            error: function(xhr, status, err) {
//                 console.error(status, err.toString());
//            }
//        });   
//        return dataRetour;
//    }
    
    
});