/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param string url: url AJAX (recupération données)
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-*
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']
 * @param string id: attribut ID de la balise TABLE
 * @param object settings: objet JSON permettant de paramètrer dataTable voir http://www.datatables.net/reference/option/
 */
var Table = require('./react_table');
var DataTableReact = React.createClass({
    
    oDataTable:{},
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        url: React.PropTypes.string.isRequired,
        hide: React.PropTypes.array.isRequired,
        id: React.PropTypes.string.isRequired,
        settings:React.PropTypes.object,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        
        return {settings:{
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
        evts:{click:"this.selectRow()"}};
    },
    
    getInitialState: function() {
//        console.log('initialize')
        return {data: []};
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
        
        // Evts
        var that = this;
        _.each(this.props.evts, function(val, key){
            $.proxy(that.oDataTable.$('tr').on(key,function(e){
                that.selectRow(e);
            }),that);
        })
        
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
    
    refreshData: function(){
        this.setState({});
    },
    
    render: function() {
        return (
         <Table id={this.props.id} head={this.props.head} url={this.props.url} hide={this.props.hide} afterUpdate={this.applyDataTable} beforeUpdate={this.destroyDataTable} attributes={this.props.attributes} />
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
