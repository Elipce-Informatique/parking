/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array data: tableau de données ex: [{},{}]
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-*
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']
 * @param string id: attribut ID de la balise TABLE
 * @param object settings: objet JSON permettant de paramètrer dataTable voir http://www.datatables.net/reference/option/
 * @param object attributes: attributs HTML de la TABLE. ex {alt:'mon alt', colspan:2}
 * @param object evts: Evenements des lignes de tableau. ex: {click:Action1, hover:Action2}. Les clés de l'objet des évènements jquery: http://www.quirksmode.org/dom/events/
 * @param boolean bUnderline: TRUE: Evenement par defaut sur click d'une ligne: surlignage
 *                            FALSE: pas d'évènement par défaut.
 */

var Table = require('./react_table');
var DataTableReact = React.createClass({
    
    mixins: [Reflux.ListenerMixin],
    
    oDataTable:{},
    
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
        bUnderline: true};
    },
    
    getInitialState: function() {
//        console.log('initialize')
        return {evts:{click:this.selectRow}};
    },
    
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentDidMount: function(){
//        console.log('DATATABLE didmount');
    },
    
    /**
     * Après chaque mise à jour DATA du tableau (forceupdate() ou setState())
     * @returns {undefined}
     */
    componentDidUpdate: function(){
//        console.log('DATATABLE didupdate');
    },
    
    /**
     * On applique le plugin dataTable sur la TABLE HTML
     */
    applyDataTable: function(){
//        console.log('DATATABLE applydatatable')
        this.oDataTable = $('#'+this.props.id).DataTable(this.props.settings);
        new $.fn.dataTable.FixedHeader( this.oDataTable,{
            "offsetTop": 50
        });
        
        // Evts déclarés par le dév
        var that = this;
        _.each(this.props.evts, function(val, key){
            that.oDataTable.$('tr').on(key,val);
        })
        // Activations  des évènements fixes
        if(this.props.bUnderline){
            // Evts  fixes
            _.each(this.state.evts, function(val, key){
                $.proxy(that.oDataTable.$('tr').on(key,val),that);
            })
        }
        
    },
    
    /**
     * Destruction du composant dataTable
     * @returns {undefined}
     */
    destroyDataTable: function(){
//        console.log('DATATABLE destroy')
        if(!$.isEmptyObject(this.oDataTable)){
//            console.log('destroy le retour 4');
            this.oDataTable.destroy();
        }
    },
    
    render: function() {
        return (
         <Table id={this.props.id} head={this.props.head} data={this.props.data} hide={this.props.hide} afterUpdate={this.applyDataTable} beforeUpdate={this.destroyDataTable} attributes={this.props.attributes} />
        )
    },
    
    /**
     * Selectionne visuellement une ligne de tableau
     * @param {event} evt: evenement js
     * @returns {undefined}
     */
    selectRow: function(evt){
        
        var tr = $(evt.currentTarget);
        // GESTION VISUELLE
        if (tr.hasClass('row_selected')) {
                tr.removeClass('row_selected');
        } else {
                this.oDataTable.$('tr.row_selected').removeClass('row_selected');
                tr.addClass('row_selected');
        }
    }
});

module.exports = DataTableReact;
