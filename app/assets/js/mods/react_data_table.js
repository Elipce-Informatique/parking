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

var Table = require('./react_table');
var DataTableReact = React.createClass({
    
    oDataTable:{},
    
    cssLigne: 'row_selected',
    userEvts : undefined,
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        id: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired,
        settings:React.PropTypes.object,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        bUnderline:React.PropTypes.bool,
        onLineClick: React.PropTypes.func
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        
        return {
        settings:{
            "language": {
            "sProcessing":     Lang.get('global.datatable.sProcessing'),
            "sSearch":         Lang.get('global.datatable.sSearch'),
            "sLengthMenu":     Lang.get('global.datatable.sLengthMenu'),
            "sInfo":           Lang.get('global.datatable.sInfo'),
            "sInfoEmpty":      Lang.get('global.datatable.sInfoEmpty'),
            "sInfoFiltered":   Lang.get('global.datatable.sInfoFiltered'),
            "sInfoPostFix":    Lang.get('global.datatable.sInfoPostFix'),
            "sLoadingRecords": Lang.get('global.datatable.sLoadingRecords'),
            "sZeroRecords":    Lang.get('global.datatable.sZeroRecords'),
            "sEmptyTable":     Lang.get('global.datatable.sEmptyTable'),
            "oPaginate": {
                "sFirst":      Lang.get('global.datatable.oPaginate.sFirst'),
                "sPrevious":   Lang.get('global.datatable.oPaginate.sPrevious'),
                "sNext":       Lang.get('global.datatable.oPaginate.sNext'),
                "sLast":       Lang.get('global.datatable.oPaginate.sLast')
            },
            "oAria": {
                "sSortAscending":  Lang.get('global.datatable.oAria.sSortAscending'),
                "sSortDescending": Lang.get('global.datatable.oAria.sSortDescending')
            }
        }},
        attributes: {},
        evts:{},
        bUnderline: true,
        onLineClick: function(){}};
    },
    
    componentWillMount: function(){
        // Le DEV veut un surlignage sur clic
        if(this.props.bUnderline){
            this.manageLineClick(this.props);
        }
    },
    
    componentWillReceiveProps: function(newProps){
        
//        // Le DEV veut un surlignage sur clic
//        if(this.props.bUnderline){
//            this.manageLineClick(newProps);
//        }
    },
    
    componentWillUpdate: function(newProps, newState){         
        // Suppression datable
        this.destroyDataTable();
        
    },
    
    render: function() {
        return (
         <Table id={this.props.id} head={this.props.head} data={this.props.data} hide={this.props.hide} attributes={this.props.attributes} evts={this.props.evts} onLineClick={this.props.onLineClick}/>
        )
    },
    
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentDidMount: function(){
        this.applyDataTable();
    },
    
    /**
     * Après le 2è affichage
     * @returns {undefined}
     */
    componentDidUpdate: function(){
        // Suppression datable
        this.applyDataTable();
    },
    
 /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */
    /**
     * On applique le plugin dataTable sur la TABLE HTML
     */
    applyDataTable: function(){        
        // Activation datatable
        this.oDataTable = $('#'+this.props.id).DataTable(this.props.settings);
        new $.fn.dataTable.FixedHeader( this.oDataTable,{
            "offsetTop": 50
        });
    },
    
    /**
     * Destruction du composant dataTable
     * @returns {undefined}
     */
    destroyDataTable: function(){
        if(!$.isEmptyObject(this.oDataTable)){
            this.oDataTable.destroy();// ATTENTION true pose pb sur fixedHeader
        }
    },
    /**
     * Selectionne visuellement une ligne de tableau
     * @param {event} evt: evenement js
     * @returns {undefined}
     */
    selectRow: function(evt){
        var tr = $(evt.currentTarget);
        // GESTION VISUELLE
        if (tr.hasClass(this.cssLigne)) {
                tr.removeClass(this.cssLigne);
        }else {
                tr.parent('tbody').find('tr').removeClass(this.cssLigne)
                tr.addClass(this.cssLigne);
        }
    },
    
    manageLineClick: function(newProps){
        var that = this;
        // On vient du composant react_data_table_bandeau
        if(newProps.onLineClick.toString !== ''){
            var temp = newProps.onLineClick;
            newProps.onLineClick = function(e){
                that.selectRow(e);
//                console.log('currentTarget %o',e.currentTarget);
                temp(e.currentTarget);
            }
        }    
        // Merge vers on click
        if(newProps.evts.onClick != undefined){
            var temp = newProps.evts.onClick;
            newProps.evts.onClick = function(e){
                temp(e);
                newProps.onLineClick(e);
            };
        }
        // Seulement les evts bandeau et surlignage
        else{
            newProps.evts.onClick = newProps.onLineClick;
        }
    }
});

module.exports = DataTableReact;
