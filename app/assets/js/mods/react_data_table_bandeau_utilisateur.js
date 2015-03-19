/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-*
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']
 * @param string id: attribut ID de la balise TABLE
 * @param object settings: objet JSON permettant de paramètrer dataTable voir http://www.datatables.net/reference/option/
 * @param object attributes: attributs HTML de la TABLE. ex {alt:'mon alt', colspan:2}
 * @param object evts: évènements sur les lignes de tableau {onClick:function(}{}} ATTENTION: les clés correspondent aux noms d'évènements HTML case sensitive.
 * @param boolean bUnderline: TRUE: Evenement par defaut sur click d'une ligne: surlignage
 *                            FALSE: pas d'évènement par défaut.
 */
var React = require('react/addons');
var AuthentMixins = require('./mixins/component_access');
var DataTableBandeau = require('./composants/tableau/react_data_table_bandeau');

var DataTableBandeauUtilisateurReact = React.createClass({
    
    mixins: [Reflux.ListenerMixin,AuthentMixins],

    head : [Lang.get('administration.utilisateur.tableau.nom'),Lang.get('administration.utilisateur.tableau.prenom'),Lang.get('administration.utilisateur.tableau.email')],
    hide : ['id'],
    // evts ne pas mettre ici car this.displayUser n'est pas encore connu
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        
        return {
            module_url: 'utilisateur'
        };
    },
    
    getInitialState: function(){
        return {data:[]};
    },
    
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentWillMount: function(){
        this.listenTo(tableauUserStore, this.updateData, this.updateData);
    },
    
    render: function() {
        return (
         <DataTableBandeau id="tab_users" head={this.head} data={this.state.data} hide={this.hide} attributes={this.attributes} bUnderline={true} evts={{onClick:this.displayUser}}/>
        )
    },
    
 /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */   
    /**
     * Mise à jour de la TABLE
     * @param {type} data
     * @returns {undefined}
     */
    updateData: function(data) {
        // MAJ data
        this.setState({
            data: data
        });
    },

    displayUser: function(e){
        // Ligne du tableau
        var id = $(e.currentTarget).data('id');
        Actions.utilisateur.display_user(id);
    }
});

module.exports.Composant = DataTableBandeauUtilisateurReact;


// Creates a DataStore
var tableauUserStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.load_data_all_users, this.getData);
        
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
    
    getInitialState:function(){
        var dataRetour = [];
        // AJAX
        $.ajax({
            url: BASE_URI+'utilisateur/all',
            dataType: 'json',
            context: this,
            async:false,
            success: function(data) {
                dataRetour = data;
            },
            error: function(xhr, status, err) {
                 console.error(status, err.toString());
            }
        });   
        return dataRetour;
    }
});
module.exports.Store = tableauUserStore;