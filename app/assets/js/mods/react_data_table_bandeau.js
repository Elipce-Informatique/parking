/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array data: tableau de données ex: [{},{}]
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

var DataTable = require('./react_data_table'); 
var DataTableBandeauReact = React.createClass({
   
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        id: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired,
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
            bUnderline: true,
            data: []
        };
    },
    
    getInitialState: function(){
        return {evts:{}};
    },
    
    componentWillMount: function(){
      this.addCustomClick(this.props, this.state);  
    },
    
    componentReceiveProps: function(newProps){
        
        // Ajout des Evts spécifiques à ce composant
        this.addCustomClick(newProps, this.state); // ATTENTION, ne pas mettre dans willUpdate car un setState engendre un willUpdate => boucle infinie
    },
    
    render: function() {
                
        return (
         <DataTable id={this.props.id} head={this.props.head} data={this.props.data} hide={this.props.hide} attributes={this.props.attributes} bUnderline={this.props.bUnderline} evts={this.state.evts}/>
        )
    },
    /**
     * Après chaque RENDER de type update (forceupdate() ou setState())
     * @returns {undefined}
     */
    componentDidUpdate: function(){
    },
    
 /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */
    handleDataTableBandeauClick: function(e){
        e.preventDefault();
        // Activation / désactivation bandeau
//        Actions.global.table_bandeau_line_clicked(e.currentTarget);
        // Execution des Evts définis par le DEV
        if(this.props.evts.onClick !== undefined){
            this.props.evts.onClick(e);
        }
    },
    
    addCustomClick: function(newProps, newState){
        
        var evts = newProps.evts;
        evts.onClick = this.handleDataTableBandeauClick;
        this.setState({evts: evts});
        console.log('setState 2');
        
    }
});

module.exports = DataTableBandeauReact;
