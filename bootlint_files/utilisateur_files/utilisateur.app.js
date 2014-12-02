
$(function(){

   
   
        var oDataTable = $('#tab_users').DataTable({
                destroy: true,
                responsive: true,
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
				}
        });
        // Tableau à entete fixe
        new $.fn.dataTable.FixedHeader( oDataTable,{
            "offsetTop": 0
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
        React.createElement("div", {className: "col-md-12 bandeau"}, 
            React.createElement("h1", null, this.props.titre), 
            React.createElement(ButtonToolbar, null, 
                React.createElement(Button, {id: "btn_creer", bsSize: "small"}, React.createElement(Glyphicon, {glyph: "plus-sign"}), " ", Lang.get('global.create')), 
                React.createElement(Button, React.__spread({id: "btn_edit", bsSize: "small"},  inactif), React.createElement(Glyphicon, {glyph: "pencil"}), " ", Lang.get('global.edit')), 
                React.createElement(Button, React.__spread({id: "btn_del", bsSize: "small"},  inactif), React.createElement(Glyphicon, {glyph: "minus-sign"}), " ", Lang.get('global.del'))
            )
         )
        )
    }
});

module.exports = ReactBandeau;

},{"./stores/store_bandeau_is_editable":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\stores\\store_bandeau_is_editable.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table.js":[function(require,module,exports){
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
 * @param function onDataTableLineClick: sur clic ligne de tableau DataTable
 */

var Table = require('./react_table');
var DataTableReact = React.createClass({displayName: 'DataTableReact',
    
    oDataTable:{},
    
    cssLigne: 'row_selected',
    myEvts : {},
    userClick: function(){},
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        id: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired,
        settings:React.PropTypes.object,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object,
        bUnderline:React.PropTypes.bool,
        onDataTableLineClick: React.PropTypes.func
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
                }
        },
            attributes: {},
            evts:{},
            bUnderline: true,
            onDataTableLineClick: function(){}
        };
    },
    
    componentWillMount: function(){
         
        // Copie des evts passés en param
        this.myEvts = _.clone(this.props.evts);
        // Evts définis par le DEV.
        if(this.myEvts.onClick !== undefined){
            this.userClick = this.myEvts.onClick;
        }
        // Evt onClick avec prise en charge dataTableBandeau + DataTable + DEV click
        this.myEvts.onClick = this.handleClick;
    },
    
    componentWillReceiveProps: function(newProps){
        
    },
    
    componentWillUpdate: function(newProps, newState){         
        // Suppression datable
        this.destroyDataTable();
        
    },
    
    render: function() {
        return (
         React.createElement(Table, {id: this.props.id, head: this.props.head, data: this.props.data, hide: this.props.hide, attributes: this.props.attributes, evts: this.myEvts})
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
//        new $.fn.dataTable.FixedHeader( this.oDataTable,{
//            "offsetTop": 50
//        });
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
    
    handleClick: function(e){
        // Le DEV veut un surlignage sur clic
        if(this.props.bUnderline){
            this.selectRow(e);
        }
        // Execution clic data table bandeau
        var monEvenement = _.clone(e);// IMPORTANT VRAI copie et non affectation de références
        this.props.onDataTableLineClick(monEvenement);
        
        // Execution clic défini par DEV
        this.userClick(e);
        
    }
});

module.exports = DataTableReact;

},{"./react_table":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_table.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table_bandeau.js":[function(require,module,exports){
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
var DataTableBandeauReact = React.createClass({displayName: 'DataTableBandeauReact',
    
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
    
    render: function() {       
        
        return (
         React.createElement(DataTable, {id: this.props.id, head: this.props.head, data: this.props.data, hide: this.props.hide, attributes: this.props.attributes, bUnderline: this.props.bUnderline, evts: this.props.evts, onDataTableLineClick: Actions.global.table_bandeau_line_clicked})
        )
    }
    
 /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */
    
});

module.exports = DataTableBandeauReact;

},{"./react_data_table":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table_bandeau_utilisateur.js":[function(require,module,exports){
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

var AuthentMixins = require('./mixins/component_access');
var DataTableBandeau = require('./react_data_table_bandeau');
var DataTableBandeauUtilisateurReact = React.createClass({displayName: 'DataTableBandeauUtilisateurReact',
    
    mixins: [Reflux.ListenerMixin,AuthentMixins],
    
    module_url: 'utilisateur',
    
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
            bUnderline: true
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
        this.listenTo(userStore, this.updateData, this.updateData);
        // Appel action
        Actions.utilisateur.load_data();
    },
    
    render: function() {
        return (
         React.createElement(DataTableBandeau, {id: this.props.id, head: this.props.head, data: this.state.data, hide: this.props.hide, attributes: this.props.attributes, bUnderline: this.props.bUnderline, evts: this.props.evts})
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
    
    
    
    
   
});

