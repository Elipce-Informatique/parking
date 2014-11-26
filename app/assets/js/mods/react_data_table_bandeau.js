/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array data: tableau de données ex: [{},{}]
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

var DataTable = require('./react_data_table');
var DataTableBandeauReact = React.createClass({
    
    mixins: [Reflux.ListenerMixin],
    
    
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
            data: [{'id':'17','nom':'perez','prenom':'vivian'}]
        };
    },
    
    shouldComponentUpdate: function(nextProps, nextStates){
//        console.log('shouldComponentUpdate: %o',this.props);
//        console.log('shouldComponentUpdate: %o',nextProps);
      return true;  
    },
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentWillMount: function(){
        
//        this.userClick = this.props.evts.click;
//        console.log(this.userClick);
//        
//        this.evts = this.props.evts;
//        this.evts.click = this.handleTableClick;
        
    },
    componentWillReceiveProps : function(nextProps){
//        this.userClick = nextProps.evts.click;
//        this.evts = nextProps.evts;
////        console.log(this.evts.click);
//        this.evts.click = this.handleTableClick;
    },
    
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentWillUpdate: function(){
    },
    
    render: function() {
                
        return (
         <DataTable id={this.props.id} head={this.props.head} data={this.props.data} hide={this.props.hide} attributes={this.props.attributes} bUnderline={this.props.bUnderline} evts={this.props.evts}/>
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
    handleTableClick: function(e){
        if(this.userClick !== undefined){
            this.userClick(e);
        }
        Actions.global.table_bandeau_line_clicked(e.currentTarget);
    }
});

module.exports = DataTableBandeauReact;
