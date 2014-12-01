(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./app/assets/js/utilisateur.app.js":[function(require,module,exports){
// ATTENTION la majuscule est super importante
var DataTableBandeauUser = require('./mods/react_data_table_bandeau_utilisateur');
var Bandeau = require('./mods/react_bandeau');
var Button = ReactB.Button;

$(function(){
    
    // Tableau
    var head = ['Nom','E-mail','E-mail','E-mail'];
    var hide = ['id'];
    var evts = {'onClick':Actions.utilisateur.display_user()};
    
    // Bandeau ATTENTION BANDEAU AVANT à cause du fixed header du tableau
     var oBandeau = React.render(
        React.createElement(Bandeau, {titre: Lang.get('utilisateur.titre')}),
        document.getElementById('bandeau')
    );
    
    
    var oReactTable = React.render(
        React.createElement(DataTableBandeauUser, {head: head, hide: hide, id: "tab_users", evts: evts}),
        document.getElementById('tableau_react')
    );
    
    
    
    
    
    
    
    
    // Click bouton IIIII
    $('#test').click(function(){
//       oReactTable.forceUpdate();
         Actions.utilisateur.load_data();
    });
});


},{"./mods/react_bandeau":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_bandeau.js","./mods/react_data_table_bandeau_utilisateur":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table_bandeau_utilisateur.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_bandeau.js":[function(require,module,exports){
/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 */

var isEdtitableStore = require('./stores/store_bandeau_is_editable');
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;

var ReactBandeau = React.createClass({displayName: 'ReactBandeau',
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

var DataTableBandeau = require('./react_data_table_bandeau');
var DataTableBandeauUtilisateurReact = React.createClass({displayName: 'DataTableBandeauUtilisateurReact',
    
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
},{"./react_data_table_bandeau":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table_bandeau.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_table.js":[function(require,module,exports){
/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 * @param array data: tableau de données ex: [{},{}]
 * @param object attributes: Attributs HTML TABLE
 * @param object evts: évènements sur les lignes de tableau {onClick:function(}{}} ATTENTION: les clés correspondent aux noms d'évènements HTML case sensitive.
 */

var Table = React.createClass({displayName: 'Table',
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        data: React.PropTypes.array.isRequired,
        attributes: React.PropTypes.object,
        evts:React.PropTypes.object
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {attributes:{}, evts:{}};
    },

    render: function() {
            // Variables
            var corps = [];
            var that = this;
            
            // Parcours des lignes du tableau
            this.props.data.forEach(function(dataLine, index) {
                // Ajout du TR
                corps.push(React.createElement(TableTr, {key: index, data: dataLine, hide: that.props.hide, evts: that.props.evts}))
            });
            
            // ID
            var id = {};
            if(this.props.id!=undefined){
                id = {'id':this.props.id}
            }
            // TABLE
             return( 
              React.createElement("div", {className: ""}, 
                React.createElement("table", React.__spread({className: "display responsive no-wrap", width: "100%"},  id,  this.props.attributes), 
                React.createElement(TableHeader, {head: this.props.head}), 
                React.createElement("tbody", null, corps)
                )
              )
            )
    }
});
module.exports = Table;

/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 */
var TableHeader = React.createClass({displayName: 'TableHeader',
    
    propTypes: {
        head: React.PropTypes.array.isRequired
    },

    render: function() {
        
            // Variables
            var entete = [];
            var that = this;
            
            // Entete
            this.props.head.forEach(function(col,index) {
                entete.push(React.createElement("td", {key: index}, col))
            });
           return React.createElement("thead", null, React.createElement("tr", null, entete));
            
    }
});

/**
 * @param json data: objet JSON. ex: {id:1, name:toto}
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 */
var TableTr = React.createClass({displayName: 'TableTr',
    
     propTypes: {
        data: React.PropTypes.object.isRequired,
        hide: React.PropTypes.array.isRequired,
        evts:React.PropTypes.object
    },

    render: function() {
            // Variables
            var tr = [];
            var that = this;
            var attr = {};
               
            // Parcours des data
             _.each(this.props.data,function(val,key) {
                 // Champ caché, on créé un data-key
                 if(that.props.hide.length > 0 && _.indexOf(that.props.hide,key)>-1){
                     attr['data-'+key] = val;
                 }
                 // Cellule de table
                 else{
                      tr.push(React.createElement("td", {key: that.props.data.id+key}, val));
                  }
             });
             // Ajout du tr
             return React.createElement("tr", React.__spread({},  attr,  this.props.evts), tr)
           
     
    },
    
    /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */

});
},{}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\stores\\store_bandeau_is_editable.js":[function(require,module,exports){
// Creates a DataStore
var isEdtitableStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.global.table_bandeau_line_clicked, this.outputTable);
    },

    // Callback
    outputTable: function(e) {
        // TR
        var tr = e.currentTarget;
        // Get ID
        var isEditable = $(tr).hasClass('row_selected');

        // Pass on to listeners
        this.trigger(isEditable);
    }

});

module.exports = isEdtitableStore;
},{}]},{},["./app/assets/js/utilisateur.app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYXBwXFxhc3NldHNcXGpzXFx1dGlsaXNhdGV1ci5hcHAuanMiLCJhcHBcXGFzc2V0c1xcanNcXG1vZHNcXHJlYWN0X2JhbmRlYXUuanMiLCJhcHBcXGFzc2V0c1xcanNcXG1vZHNcXHJlYWN0X2RhdGFfdGFibGUuanMiLCJhcHBcXGFzc2V0c1xcanNcXG1vZHNcXHJlYWN0X2RhdGFfdGFibGVfYmFuZGVhdS5qcyIsImFwcFxcYXNzZXRzXFxqc1xcbW9kc1xccmVhY3RfZGF0YV90YWJsZV9iYW5kZWF1X3V0aWxpc2F0ZXVyLmpzIiwiYXBwXFxhc3NldHNcXGpzXFxtb2RzXFxyZWFjdF90YWJsZS5qcyIsImFwcFxcYXNzZXRzXFxqc1xcbW9kc1xcc3RvcmVzXFxzdG9yZV9iYW5kZWF1X2lzX2VkaXRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBBVFRFTlRJT04gbGEgbWFqdXNjdWxlIGVzdCBzdXBlciBpbXBvcnRhbnRlXG52YXIgRGF0YVRhYmxlQmFuZGVhdVVzZXIgPSByZXF1aXJlKCcuL21vZHMvcmVhY3RfZGF0YV90YWJsZV9iYW5kZWF1X3V0aWxpc2F0ZXVyJyk7XG52YXIgQmFuZGVhdSA9IHJlcXVpcmUoJy4vbW9kcy9yZWFjdF9iYW5kZWF1Jyk7XG52YXIgQnV0dG9uID0gUmVhY3RCLkJ1dHRvbjtcblxuJChmdW5jdGlvbigpe1xuICAgIFxuICAgIC8vIFRhYmxlYXVcbiAgICB2YXIgaGVhZCA9IFsnTm9tJywnRS1tYWlsJywnRS1tYWlsJywnRS1tYWlsJ107XG4gICAgdmFyIGhpZGUgPSBbJ2lkJ107XG4gICAgdmFyIGV2dHMgPSB7J29uQ2xpY2snOkFjdGlvbnMudXRpbGlzYXRldXIuZGlzcGxheV91c2VyKCl9O1xuICAgIFxuICAgIC8vIEJhbmRlYXUgQVRURU5USU9OIEJBTkRFQVUgQVZBTlQgw6AgY2F1c2UgZHUgZml4ZWQgaGVhZGVyIGR1IHRhYmxlYXVcbiAgICAgdmFyIG9CYW5kZWF1ID0gUmVhY3QucmVuZGVyKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJhbmRlYXUsIHt0aXRyZTogTGFuZy5nZXQoJ3V0aWxpc2F0ZXVyLnRpdHJlJyl9KSxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhbmRlYXUnKVxuICAgICk7XG4gICAgXG4gICAgXG4gICAgdmFyIG9SZWFjdFRhYmxlID0gUmVhY3QucmVuZGVyKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERhdGFUYWJsZUJhbmRlYXVVc2VyLCB7aGVhZDogaGVhZCwgaGlkZTogaGlkZSwgaWQ6IFwidGFiX3VzZXJzXCIsIGV2dHM6IGV2dHN9KSxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlYXVfcmVhY3QnKVxuICAgICk7XG4gICAgXG4gICAgXG4gICAgXG4gICAgXG4gICAgXG4gICAgXG4gICAgXG4gICAgXG4gICAgLy8gQ2xpY2sgYm91dG9uIElJSUlJXG4gICAgJCgnI3Rlc3QnKS5jbGljayhmdW5jdGlvbigpe1xuLy8gICAgICAgb1JlYWN0VGFibGUuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgIEFjdGlvbnMudXRpbGlzYXRldXIubG9hZF9kYXRhKCk7XG4gICAgfSk7XG59KTtcblxuIiwiLyoqXG4gKiBAcGFyYW0gYXJyYXkgaGVhZDogYXJyYXkgY29udGVuYW50IGwnZW50w6p0ZSBkdSB0YWJsZWF1IFsnQScsICdCJ11cbiAqL1xuXG52YXIgaXNFZHRpdGFibGVTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmVzL3N0b3JlX2JhbmRlYXVfaXNfZWRpdGFibGUnKTtcbnZhciBCdXR0b24gPSBSZWFjdEIuQnV0dG9uO1xudmFyIEJ1dHRvblRvb2xiYXIgPSBSZWFjdEIuQnV0dG9uVG9vbGJhcjtcbnZhciBHbHlwaGljb24gPSBSZWFjdEIuR2x5cGhpY29uO1xuXG52YXIgUmVhY3RCYW5kZWF1ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnUmVhY3RCYW5kZWF1JyxcbiAgICBtaXhpbnM6IFtSZWZsdXguTGlzdGVuZXJNaXhpbl0sXG4gICAgXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIHRpdHJlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBMZXMgcHJvcHMgcGFyIGTDqWZhdXRcbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge3RpdHJlOiAnVGl0bGUnfTtcbiAgICB9LFxuICAgIFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7YkVkaXRhYmxlOiBmYWxzZX07XG4gICAgfSxcbiAgICBcbiAgICBcbiAgICAvKipcbiAgICAgKiBBdmFudCBsZSAxZXIgYWZmaWNoYWdlXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQXByw6hzIGxlIDFlciBhZmZpY2hhZ2VcbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmxpc3RlblRvKGlzRWR0aXRhYmxlU3RvcmUsIHRoaXMub25TdGF0dXNDaGFuZ2UpO1xuICAgIH0sXG4gICAgXG4gICAgb25TdGF0dXNDaGFuZ2U6IGZ1bmN0aW9uKGlzRWRpdGFibGUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBiRWRpdGFibGU6IGlzRWRpdGFibGVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBBcHLDqHMgY2hhcXVlIG1pc2Ugw6Agam91ciBEQVRBIGR1IHRhYmxlYXUgKGZvcmNldXBkYXRlKCkgb3Ugc2V0U3RhdGUoKSlcbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKXtcbi8vICAgICAgICBjb25zb2xlLmxvZygnREFUQVRBQkxFIGRpZHVwZGF0ZScpO1xuICAgIH0sXG4gICAgXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4vLyAgICAgICAgdmFyIGluYWN0aWYgPSAodGhpcy5zdGF0ZS5iRWRpdGFibGU/e306eydkaXNhYmxlZCc6J2Rpc2FibGVkJ30pO1xuICAgIHZhciBpbmFjdGlmID0geydkaXNhYmxlZCc6IXRoaXMuc3RhdGUuYkVkaXRhYmxlfTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2wtbWQtMTIgYmFuZGVhdVwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCwgdGhpcy5wcm9wcy50aXRyZSksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge2lkOiBcImJ0bl9jcmVlclwiLCBic1NpemU6IFwic21hbGxcIn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7Z2x5cGg6IFwicGx1cy1zaWduXCJ9KSwgXCIgXCIsIExhbmcuZ2V0KCdnbG9iYWwuY3JlYXRlJykpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgUmVhY3QuX19zcHJlYWQoe2lkOiBcImJ0bl9lZGl0XCIsIGJzU2l6ZTogXCJzbWFsbFwifSwgIGluYWN0aWYpLCBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwge2dseXBoOiBcInBlbmNpbFwifSksIFwiIFwiLCBMYW5nLmdldCgnZ2xvYmFsLmVkaXQnKSksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCBSZWFjdC5fX3NwcmVhZCh7aWQ6IFwiYnRuX2RlbFwiLCBic1NpemU6IFwic21hbGxcIn0sICBpbmFjdGlmKSwgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHtnbHlwaDogXCJtaW51cy1zaWduXCJ9KSwgXCIgXCIsIExhbmcuZ2V0KCdnbG9iYWwuZGVsJykpXG4gICAgICAgICAgICApXG4gICAgICAgICApXG4gICAgICAgIClcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEJhbmRlYXU7XG4iLCIvKipcclxuICogQHBhcmFtIGFycmF5IGhlYWQ6IGFycmF5IGNvbnRlbmFudCBsJ2VudMOqdGUgZHUgdGFibGVhdSBbJ0EnLCAnQiddXHJcbiAqIEBwYXJhbSBhcnJheSBkYXRhOiB0YWJsZWF1IGRlIGRvbm7DqWVzIGV4OiBbe30se31dXHJcbiAqIEBwYXJhbSBhcnJheSBoaWRlOiBsZXMgY2zDqXMgZGUgbGEgcmVxdcOqdGVzIFNRTCBBSkFYIHF1aSBuZSBzb250IHBhcyBhZmZpY2jDqWVzIGRhbnMgbGUgdGFibGVhdSBldCBwb3VyIGxlc3F1ZWxsZXMgb24gY3LDqcOpIHVuIGRhdGEtKlxyXG4gKiAgICAgICAgICAgICAgICAgICAgZXg6IGwndXJsIEFKQVggcmV0b3VybmUgbGVzIGRvbm7DqWVzIHN1aXZhbnRlcyB7J2lkJzoxLCAnbm9tJzonUEVSRVonLCAncHJlbm9tJzonVml2aWFuJ31cclxuICogICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFsnaWQnXVxyXG4gKiBAcGFyYW0gc3RyaW5nIGlkOiBhdHRyaWJ1dCBJRCBkZSBsYSBiYWxpc2UgVEFCTEVcclxuICogQHBhcmFtIG9iamVjdCBzZXR0aW5nczogb2JqZXQgSlNPTiBwZXJtZXR0YW50IGRlIHBhcmFtw6h0cmVyIGRhdGFUYWJsZSB2b2lyIGh0dHA6Ly93d3cuZGF0YXRhYmxlcy5uZXQvcmVmZXJlbmNlL29wdGlvbi9cclxuICogQHBhcmFtIG9iamVjdCBhdHRyaWJ1dGVzOiBhdHRyaWJ1dHMgSFRNTCBkZSBsYSBUQUJMRS4gZXgge2FsdDonbW9uIGFsdCcsIGNvbHNwYW46Mn1cclxuICogQHBhcmFtIG9iamVjdCBldnRzOiDDqXbDqG5lbWVudHMgc3VyIGxlcyBsaWduZXMgZGUgdGFibGVhdSB7b25DbGljazpmdW5jdGlvbih9e319IEFUVEVOVElPTjogbGVzIGNsw6lzIGNvcnJlc3BvbmRlbnQgYXV4IG5vbXMgZCfDqXbDqG5lbWVudHMgSFRNTCBjYXNlIHNlbnNpdGl2ZS5cclxuICogQHBhcmFtIGJvb2xlYW4gYlVuZGVybGluZTogVFJVRTogRXZlbmVtZW50IHBhciBkZWZhdXQgc3VyIGNsaWNrIGQndW5lIGxpZ25lOiBzdXJsaWduYWdlXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZBTFNFOiBwYXMgZCfDqXbDqG5lbWVudCBwYXIgZMOpZmF1dC5cclxuICogQHBhcmFtIGZ1bmN0aW9uIG9uRGF0YVRhYmxlTGluZUNsaWNrOiBzdXIgY2xpYyBsaWduZSBkZSB0YWJsZWF1IERhdGFUYWJsZVxyXG4gKi9cclxuXHJcbnZhciBUYWJsZSA9IHJlcXVpcmUoJy4vcmVhY3RfdGFibGUnKTtcclxudmFyIERhdGFUYWJsZVJlYWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRGF0YVRhYmxlUmVhY3QnLFxyXG4gICAgXHJcbiAgICBvRGF0YVRhYmxlOnt9LFxyXG4gICAgXHJcbiAgICBjc3NMaWduZTogJ3Jvd19zZWxlY3RlZCcsXHJcbiAgICBteUV2dHMgOiB7fSxcclxuICAgIHVzZXJDbGljazogZnVuY3Rpb24oKXt9LFxyXG4gICAgXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBoZWFkOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcclxuICAgICAgICBoaWRlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcclxuICAgICAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgICAgIGRhdGE6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxyXG4gICAgICAgIHNldHRpbmdzOlJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbiAgICAgICAgYXR0cmlidXRlczpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIGV2dHM6UmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxuICAgICAgICBiVW5kZXJsaW5lOlJlYWN0LlByb3BUeXBlcy5ib29sLFxyXG4gICAgICAgIG9uRGF0YVRhYmxlTGluZUNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBMZXMgcHJvcHMgcGFyIGTDqWZhdXRcclxuICAgICAqL1xyXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXR0aW5nczp7XHJcbiAgICAgICAgICAgICAgICBcImxhbmd1YWdlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcInNQcm9jZXNzaW5nXCI6ICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zUHJvY2Vzc2luZycpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic1NlYXJjaFwiOiAgICAgICAgIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLnNTZWFyY2gnKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNMZW5ndGhNZW51XCI6ICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zTGVuZ3RoTWVudScpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic0luZm9cIjogICAgICAgICAgIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLnNJbmZvJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzSW5mb0VtcHR5XCI6ICAgICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUuc0luZm9FbXB0eScpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic0luZm9GaWx0ZXJlZFwiOiAgIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLnNJbmZvRmlsdGVyZWQnKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNJbmZvUG9zdEZpeFwiOiAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zSW5mb1Bvc3RGaXgnKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNMb2FkaW5nUmVjb3Jkc1wiOiBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zTG9hZGluZ1JlY29yZHMnKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNaZXJvUmVjb3Jkc1wiOiAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zWmVyb1JlY29yZHMnKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNFbXB0eVRhYmxlXCI6ICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zRW1wdHlUYWJsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib1BhZ2luYXRlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzRmlyc3RcIjogICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5vUGFnaW5hdGUuc0ZpcnN0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic1ByZXZpb3VzXCI6ICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUub1BhZ2luYXRlLnNQcmV2aW91cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNOZXh0XCI6ICAgICAgIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLm9QYWdpbmF0ZS5zTmV4dCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNMYXN0XCI6ICAgICAgIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLm9QYWdpbmF0ZS5zTGFzdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcIm9BcmlhXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzU29ydEFzY2VuZGluZ1wiOiAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUub0FyaWEuc1NvcnRBc2NlbmRpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzU29ydERlc2NlbmRpbmdcIjogTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUub0FyaWEuc1NvcnREZXNjZW5kaW5nJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAgICAgYXR0cmlidXRlczoge30sXHJcbiAgICAgICAgICAgIGV2dHM6e30sXHJcbiAgICAgICAgICAgIGJVbmRlcmxpbmU6IHRydWUsXHJcbiAgICAgICAgICAgIG9uRGF0YVRhYmxlTGluZUNsaWNrOiBmdW5jdGlvbigpe31cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICBcclxuICAgICAgICAvLyBDb3BpZSBkZXMgZXZ0cyBwYXNzw6lzIGVuIHBhcmFtXHJcbiAgICAgICAgdGhpcy5teUV2dHMgPSBfLmNsb25lKHRoaXMucHJvcHMuZXZ0cyk7XHJcbiAgICAgICAgLy8gRXZ0cyBkw6lmaW5pcyBwYXIgbGUgREVWLlxyXG4gICAgICAgIGlmKHRoaXMubXlFdnRzLm9uQ2xpY2sgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRoaXMudXNlckNsaWNrID0gdGhpcy5teUV2dHMub25DbGljaztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRXZ0IG9uQ2xpY2sgYXZlYyBwcmlzZSBlbiBjaGFyZ2UgZGF0YVRhYmxlQmFuZGVhdSArIERhdGFUYWJsZSArIERFViBjbGlja1xyXG4gICAgICAgIHRoaXMubXlFdnRzLm9uQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV3UHJvcHMpe1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZTogZnVuY3Rpb24obmV3UHJvcHMsIG5ld1N0YXRlKXsgICAgICAgICBcclxuICAgICAgICAvLyBTdXBwcmVzc2lvbiBkYXRhYmxlXHJcbiAgICAgICAgdGhpcy5kZXN0cm95RGF0YVRhYmxlKCk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFibGUsIHtpZDogdGhpcy5wcm9wcy5pZCwgaGVhZDogdGhpcy5wcm9wcy5oZWFkLCBkYXRhOiB0aGlzLnByb3BzLmRhdGEsIGhpZGU6IHRoaXMucHJvcHMuaGlkZSwgYXR0cmlidXRlczogdGhpcy5wcm9wcy5hdHRyaWJ1dGVzLCBldnRzOiB0aGlzLm15RXZ0c30pXHJcbiAgICAgICAgKVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHLDqHMgbGUgMWVyIGFmZmljaGFnZVxyXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAgICAqL1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5hcHBseURhdGFUYWJsZSgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHLDqHMgbGUgMsOoIGFmZmljaGFnZVxyXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAgICAqL1xyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIFN1cHByZXNzaW9uIGRhdGFibGVcclxuICAgICAgICB0aGlzLmFwcGx5RGF0YVRhYmxlKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAvKlxyXG4gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiB8IEZPTkNUSU9OUyBOT04gUkVBQ1RcclxuIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuICAgIC8qKlxyXG4gICAgICogT24gYXBwbGlxdWUgbGUgcGx1Z2luIGRhdGFUYWJsZSBzdXIgbGEgVEFCTEUgSFRNTFxyXG4gICAgICovXHJcbiAgICBhcHBseURhdGFUYWJsZTogZnVuY3Rpb24oKXsgICAgICAgIFxyXG4gICAgICAgIC8vIEFjdGl2YXRpb24gZGF0YXRhYmxlXHJcbiAgICAgICAgdGhpcy5vRGF0YVRhYmxlID0gJCgnIycrdGhpcy5wcm9wcy5pZCkuRGF0YVRhYmxlKHRoaXMucHJvcHMuc2V0dGluZ3MpO1xyXG4vLyAgICAgICAgbmV3ICQuZm4uZGF0YVRhYmxlLkZpeGVkSGVhZGVyKCB0aGlzLm9EYXRhVGFibGUse1xyXG4vLyAgICAgICAgICAgIFwib2Zmc2V0VG9wXCI6IDUwXHJcbi8vICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRGVzdHJ1Y3Rpb24gZHUgY29tcG9zYW50IGRhdGFUYWJsZVxyXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAgICAqL1xyXG4gICAgZGVzdHJveURhdGFUYWJsZTogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZighJC5pc0VtcHR5T2JqZWN0KHRoaXMub0RhdGFUYWJsZSkpe1xyXG4gICAgICAgICAgICB0aGlzLm9EYXRhVGFibGUuZGVzdHJveSgpOy8vIEFUVEVOVElPTiB0cnVlIHBvc2UgcGIgc3VyIGZpeGVkSGVhZGVyXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogU2VsZWN0aW9ubmUgdmlzdWVsbGVtZW50IHVuZSBsaWduZSBkZSB0YWJsZWF1XHJcbiAgICAgKiBAcGFyYW0ge2V2ZW50fSBldnQ6IGV2ZW5lbWVudCBqc1xyXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAgICAqL1xyXG4gICAgc2VsZWN0Um93OiBmdW5jdGlvbihldnQpe1xyXG4gICAgICAgIHZhciB0ciA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgIC8vIEdFU1RJT04gVklTVUVMTEVcclxuICAgICAgICBpZiAodHIuaGFzQ2xhc3ModGhpcy5jc3NMaWduZSkpIHtcclxuICAgICAgICAgICAgICAgIHRyLnJlbW92ZUNsYXNzKHRoaXMuY3NzTGlnbmUpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyLnBhcmVudCgndGJvZHknKS5maW5kKCd0cicpLnJlbW92ZUNsYXNzKHRoaXMuY3NzTGlnbmUpXHJcbiAgICAgICAgICAgICAgICB0ci5hZGRDbGFzcyh0aGlzLmNzc0xpZ25lKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBoYW5kbGVDbGljazogZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgLy8gTGUgREVWIHZldXQgdW4gc3VybGlnbmFnZSBzdXIgY2xpY1xyXG4gICAgICAgIGlmKHRoaXMucHJvcHMuYlVuZGVybGluZSl7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0Um93KGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFeGVjdXRpb24gY2xpYyBkYXRhIHRhYmxlIGJhbmRlYXVcclxuICAgICAgICB2YXIgbW9uRXZlbmVtZW50ID0gXy5jbG9uZShlKTsvLyBJTVBPUlRBTlQgVlJBSSBjb3BpZSBldCBub24gYWZmZWN0YXRpb24gZGUgcsOpZsOpcmVuY2VzXHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkRhdGFUYWJsZUxpbmVDbGljayhtb25FdmVuZW1lbnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEV4ZWN1dGlvbiBjbGljIGTDqWZpbmkgcGFyIERFVlxyXG4gICAgICAgIHRoaXMudXNlckNsaWNrKGUpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGF0YVRhYmxlUmVhY3Q7XHJcbiIsIi8qKlxuICogQHBhcmFtIGFycmF5IGhlYWQ6IGFycmF5IGNvbnRlbmFudCBsJ2VudMOqdGUgZHUgdGFibGVhdSBbJ0EnLCAnQiddXG4gKiBAcGFyYW0gYXJyYXkgZGF0YTogdGFibGVhdSBkZSBkb25uw6llcyBleDogW3t9LHt9XVxuICogQHBhcmFtIGFycmF5IGhpZGU6IGxlcyBjbMOpcyBkZSBsYSByZXF1w6p0ZXMgU1FMIEFKQVggcXVpIG5lIHNvbnQgcGFzIGFmZmljaMOpZXMgZGFucyBsZSB0YWJsZWF1IGV0IHBvdXIgbGVzcXVlbGxlcyBvbiBjcsOpw6kgdW4gZGF0YS0qXG4gKiAgICAgICAgICAgICAgICAgICAgZXg6IGwndXJsIEFKQVggcmV0b3VybmUgbGVzIGRvbm7DqWVzIHN1aXZhbnRlcyB7J2lkJzoxLCAnbm9tJzonUEVSRVonLCAncHJlbm9tJzonVml2aWFuJ31cbiAqICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBbJ2lkJ11cbiAqIEBwYXJhbSBzdHJpbmcgaWQ6IGF0dHJpYnV0IElEIGRlIGxhIGJhbGlzZSBUQUJMRVxuICogQHBhcmFtIG9iamVjdCBzZXR0aW5nczogb2JqZXQgSlNPTiBwZXJtZXR0YW50IGRlIHBhcmFtw6h0cmVyIGRhdGFUYWJsZSB2b2lyIGh0dHA6Ly93d3cuZGF0YXRhYmxlcy5uZXQvcmVmZXJlbmNlL29wdGlvbi9cbiAqIEBwYXJhbSBvYmplY3QgYXR0cmlidXRlczogYXR0cmlidXRzIEhUTUwgZGUgbGEgVEFCTEUuIGV4IHthbHQ6J21vbiBhbHQnLCBjb2xzcGFuOjJ9XG4gKiBAcGFyYW0gb2JqZWN0IGV2dHM6IMOpdsOobmVtZW50cyBzdXIgbGVzIGxpZ25lcyBkZSB0YWJsZWF1IHtvbkNsaWNrOmZ1bmN0aW9uKH17fX0gQVRURU5USU9OOiBsZXMgY2zDqXMgY29ycmVzcG9uZGVudCBhdXggbm9tcyBkJ8OpdsOobmVtZW50cyBIVE1MIGNhc2Ugc2Vuc2l0aXZlLlxuICogQHBhcmFtIGJvb2xlYW4gYlVuZGVybGluZTogVFJVRTogRXZlbmVtZW50IHBhciBkZWZhdXQgc3VyIGNsaWNrIGQndW5lIGxpZ25lOiBzdXJsaWduYWdlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGQUxTRTogcGFzIGQnw6l2w6huZW1lbnQgcGFyIGTDqWZhdXQuXG4gKi9cblxudmFyIERhdGFUYWJsZSA9IHJlcXVpcmUoJy4vcmVhY3RfZGF0YV90YWJsZScpOyBcbnZhciBEYXRhVGFibGVCYW5kZWF1UmVhY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdEYXRhVGFibGVCYW5kZWF1UmVhY3QnLFxuICAgIFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBoZWFkOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgaGlkZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGRhdGE6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgICBzZXR0aW5nczpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBhdHRyaWJ1dGVzOlJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGV2dHM6UmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgYlVuZGVybGluZTpSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogTGVzIHByb3BzIHBhciBkw6lmYXV0XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgICAgICAgIGV2dHM6e30sXG4gICAgICAgICAgICBiVW5kZXJsaW5lOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7ICAgICAgIFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGF0YVRhYmxlLCB7aWQ6IHRoaXMucHJvcHMuaWQsIGhlYWQ6IHRoaXMucHJvcHMuaGVhZCwgZGF0YTogdGhpcy5wcm9wcy5kYXRhLCBoaWRlOiB0aGlzLnByb3BzLmhpZGUsIGF0dHJpYnV0ZXM6IHRoaXMucHJvcHMuYXR0cmlidXRlcywgYlVuZGVybGluZTogdGhpcy5wcm9wcy5iVW5kZXJsaW5lLCBldnRzOiB0aGlzLnByb3BzLmV2dHMsIG9uRGF0YVRhYmxlTGluZUNsaWNrOiBBY3Rpb25zLmdsb2JhbC50YWJsZV9iYW5kZWF1X2xpbmVfY2xpY2tlZH0pXG4gICAgICAgIClcbiAgICB9XG4gICAgXG4gLypcbiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB8IEZPTkNUSU9OUyBOT04gUkVBQ1RcbiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVRhYmxlQmFuZGVhdVJlYWN0O1xuIiwiLyoqXG4gKiBAcGFyYW0gYXJyYXkgaGVhZDogYXJyYXkgY29udGVuYW50IGwnZW50w6p0ZSBkdSB0YWJsZWF1IFsnQScsICdCJ11cbiAqIEBwYXJhbSBhcnJheSBoaWRlOiBsZXMgY2zDqXMgZGUgbGEgcmVxdcOqdGVzIFNRTCBBSkFYIHF1aSBuZSBzb250IHBhcyBhZmZpY2jDqWVzIGRhbnMgbGUgdGFibGVhdSBldCBwb3VyIGxlc3F1ZWxsZXMgb24gY3LDqcOpIHVuIGRhdGEtKlxuICogICAgICAgICAgICAgICAgICAgIGV4OiBsJ3VybCBBSkFYIHJldG91cm5lIGxlcyBkb25uw6llcyBzdWl2YW50ZXMgeydpZCc6MSwgJ25vbSc6J1BFUkVaJywgJ3ByZW5vbSc6J1Zpdmlhbid9XG4gKiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gWydpZCddXG4gKiBAcGFyYW0gc3RyaW5nIGlkOiBhdHRyaWJ1dCBJRCBkZSBsYSBiYWxpc2UgVEFCTEVcbiAqIEBwYXJhbSBvYmplY3Qgc2V0dGluZ3M6IG9iamV0IEpTT04gcGVybWV0dGFudCBkZSBwYXJhbcOodHJlciBkYXRhVGFibGUgdm9pciBodHRwOi8vd3d3LmRhdGF0YWJsZXMubmV0L3JlZmVyZW5jZS9vcHRpb24vXG4gKiBAcGFyYW0gb2JqZWN0IGF0dHJpYnV0ZXM6IGF0dHJpYnV0cyBIVE1MIGRlIGxhIFRBQkxFLiBleCB7YWx0Oidtb24gYWx0JywgY29sc3BhbjoyfVxuICogQHBhcmFtIG9iamVjdCBldnRzOiDDqXbDqG5lbWVudHMgc3VyIGxlcyBsaWduZXMgZGUgdGFibGVhdSB7b25DbGljazpmdW5jdGlvbih9e319IEFUVEVOVElPTjogbGVzIGNsw6lzIGNvcnJlc3BvbmRlbnQgYXV4IG5vbXMgZCfDqXbDqG5lbWVudHMgSFRNTCBjYXNlIHNlbnNpdGl2ZS5cbiAqIEBwYXJhbSBib29sZWFuIGJVbmRlcmxpbmU6IFRSVUU6IEV2ZW5lbWVudCBwYXIgZGVmYXV0IHN1ciBjbGljayBkJ3VuZSBsaWduZTogc3VybGlnbmFnZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgRkFMU0U6IHBhcyBkJ8OpdsOobmVtZW50IHBhciBkw6lmYXV0LlxuICovXG5cbnZhciBEYXRhVGFibGVCYW5kZWF1ID0gcmVxdWlyZSgnLi9yZWFjdF9kYXRhX3RhYmxlX2JhbmRlYXUnKTtcbnZhciBEYXRhVGFibGVCYW5kZWF1VXRpbGlzYXRldXJSZWFjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0RhdGFUYWJsZUJhbmRlYXVVdGlsaXNhdGV1clJlYWN0JyxcbiAgICBcbiAgICBtaXhpbnM6IFtSZWZsdXguTGlzdGVuZXJNaXhpbl0sXG4gICAgXG4gICAgXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGhlYWQ6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgICBoaWRlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgc2V0dGluZ3M6UmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgYXR0cmlidXRlczpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBldnRzOlJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGJVbmRlcmxpbmU6UmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIExlcyBwcm9wcyBwYXIgZMOpZmF1dFxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICAgICAgICBldnRzOnt9LFxuICAgICAgICAgICAgYlVuZGVybGluZTogdHJ1ZVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4ge2RhdGE6W119O1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogQXByw6hzIGxlIDFlciBhZmZpY2hhZ2VcbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh1c2VyU3RvcmUsIHRoaXMudXBkYXRlRGF0YSwgdGhpcy51cGRhdGVEYXRhKTtcbiAgICAgICAgLy8gQXBwZWwgYWN0aW9uXG4gICAgICAgIEFjdGlvbnMudXRpbGlzYXRldXIubG9hZF9kYXRhKCk7XG4gICAgfSxcbiAgICBcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEYXRhVGFibGVCYW5kZWF1LCB7aWQ6IHRoaXMucHJvcHMuaWQsIGhlYWQ6IHRoaXMucHJvcHMuaGVhZCwgZGF0YTogdGhpcy5zdGF0ZS5kYXRhLCBoaWRlOiB0aGlzLnByb3BzLmhpZGUsIGF0dHJpYnV0ZXM6IHRoaXMucHJvcHMuYXR0cmlidXRlcywgYlVuZGVybGluZTogdGhpcy5wcm9wcy5iVW5kZXJsaW5lLCBldnRzOiB0aGlzLnByb3BzLmV2dHN9KVxuICAgICAgICApXG4gICAgfSxcbiAgICBcbiAvKlxuIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHwgRk9OQ1RJT05TIE5PTiBSRUFDVFxuIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovICAgXG4gICAgLyoqXG4gICAgICogTWlzZSDDoCBqb3VyIGRlIGxhIFRBQkxFXG4gICAgICogQHBhcmFtIHt0eXBlfSBkYXRhXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICB1cGRhdGVEYXRhOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8vIE1BSiBkYXRhXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVGFibGVCYW5kZWF1VXRpbGlzYXRldXJSZWFjdDtcblxuXG4vLyBDcmVhdGVzIGEgRGF0YVN0b3JlXG52YXIgdXNlclN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcblxuICAgIC8vIEluaXRpYWwgc2V0dXBcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBSZWdpc3RlciBzdGF0dXNVcGRhdGUgYWN0aW9uXG4gICAgICAgIHRoaXMubGlzdGVuVG8oQWN0aW9ucy51dGlsaXNhdGV1ci5sb2FkX2RhdGEsIHRoaXMuZ2V0RGF0YSk7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvLyBDYWxsYmFja1xuICAgIGdldERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBBSkFYXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEJBU0VfVVJJKyd1dGlsaXNhdGV1ci9hbGwnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gUGFzc2UgdmFyaWFibGUgYXV4IGNvbXBvc2FudHMgcXVpIMOpY291dGVudCBsJ2FjdGlvbiBhY3Rpb25Mb2FkRGF0YVxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcihkYXRhKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoe30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgICAgICAgXG4gICAgfSxcbiAgICBcbiAgICBnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGRhdGFSZXRvdXIgPSBbXTtcbiAgICAgICAgLy8gQUpBWFxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBCQVNFX1VSSSsndXRpbGlzYXRldXIvYWxsJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxuICAgICAgICAgICAgYXN5bmM6ZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YVJldG91ciA9IGRhdGE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcbiAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7ICAgXG4gICAgICAgIHJldHVybiBkYXRhUmV0b3VyO1xuICAgIH1cbiAgICBcbiAgICBcbn0pOyIsIi8qKlxuICogQHBhcmFtIGFycmF5IGhlYWQ6IGFycmF5IGNvbnRlbmFudCBsJ2VudMOqdGUgZHUgdGFibGVhdSBbJ0EnLCAnQiddXG4gKiBAcGFyYW0gYXJyYXkgaGlkZTogbGVzIGNsw6lzIGRlIGxhIHJlcXXDqnRlcyBTUUwgQUpBWCBxdWkgbmUgc29udCBwYXMgYWZmaWNow6llcyBkYW5zIGxlIHRhYmxlYXUgZXQgcG91ciBsZXNxdWVsbGVzIG9uIGNyw6nDqSB1biBkYXRhLSogXG4gKiAgICAgICAgICAgICAgICAgICAgZXg6IGwndXJsIEFKQVggcmV0b3VybmUgbGVzIGRvbm7DqWVzIHN1aXZhbnRlcyB7J2lkJzoxLCAnbm9tJzonUEVSRVonLCAncHJlbm9tJzonVml2aWFuJ31cbiAqICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBbJ2lkJ10gICBcbiAqIEBwYXJhbSBhcnJheSBkYXRhOiB0YWJsZWF1IGRlIGRvbm7DqWVzIGV4OiBbe30se31dXG4gKiBAcGFyYW0gb2JqZWN0IGF0dHJpYnV0ZXM6IEF0dHJpYnV0cyBIVE1MIFRBQkxFXG4gKiBAcGFyYW0gb2JqZWN0IGV2dHM6IMOpdsOobmVtZW50cyBzdXIgbGVzIGxpZ25lcyBkZSB0YWJsZWF1IHtvbkNsaWNrOmZ1bmN0aW9uKH17fX0gQVRURU5USU9OOiBsZXMgY2zDqXMgY29ycmVzcG9uZGVudCBhdXggbm9tcyBkJ8OpdsOobmVtZW50cyBIVE1MIGNhc2Ugc2Vuc2l0aXZlLlxuICovXG5cbnZhciBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1RhYmxlJyxcbiAgICBcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaGVhZDogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICAgIGhpZGU6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgICBkYXRhOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgYXR0cmlidXRlczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgZXZ0czpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBMZXMgcHJvcHMgcGFyIGTDqWZhdXRcbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge2F0dHJpYnV0ZXM6e30sIGV2dHM6e319O1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gVmFyaWFibGVzXG4gICAgICAgICAgICB2YXIgY29ycHMgPSBbXTtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gUGFyY291cnMgZGVzIGxpZ25lcyBkdSB0YWJsZWF1XG4gICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhTGluZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAvLyBBam91dCBkdSBUUlxuICAgICAgICAgICAgICAgIGNvcnBzLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChUYWJsZVRyLCB7a2V5OiBpbmRleCwgZGF0YTogZGF0YUxpbmUsIGhpZGU6IHRoYXQucHJvcHMuaGlkZSwgZXZ0czogdGhhdC5wcm9wcy5ldnRzfSkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gSURcbiAgICAgICAgICAgIHZhciBpZCA9IHt9O1xuICAgICAgICAgICAgaWYodGhpcy5wcm9wcy5pZCE9dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBpZCA9IHsnaWQnOnRoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUQUJMRVxuICAgICAgICAgICAgIHJldHVybiggXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCBSZWFjdC5fX3NwcmVhZCh7Y2xhc3NOYW1lOiBcImRpc3BsYXkgcmVzcG9uc2l2ZSBuby13cmFwXCIsIHdpZHRoOiBcIjEwMCVcIn0sICBpZCwgIHRoaXMucHJvcHMuYXR0cmlidXRlcyksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFibGVIZWFkZXIsIHtoZWFkOiB0aGlzLnByb3BzLmhlYWR9KSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsIGNvcnBzKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuLyoqXG4gKiBAcGFyYW0gYXJyYXkgaGVhZDogYXJyYXkgY29udGVuYW50IGwnZW50w6p0ZSBkdSB0YWJsZWF1IFsnQScsICdCJ11cbiAqL1xudmFyIFRhYmxlSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnVGFibGVIZWFkZXInLFxuICAgIFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBoZWFkOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIFZhcmlhYmxlc1xuICAgICAgICAgICAgdmFyIGVudGV0ZSA9IFtdO1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBFbnRldGVcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaGVhZC5mb3JFYWNoKGZ1bmN0aW9uKGNvbCxpbmRleCkge1xuICAgICAgICAgICAgICAgIGVudGV0ZS5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7a2V5OiBpbmRleH0sIGNvbCkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCwgZW50ZXRlKSk7XG4gICAgICAgICAgICBcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAcGFyYW0ganNvbiBkYXRhOiBvYmpldCBKU09OLiBleDoge2lkOjEsIG5hbWU6dG90b31cbiAqIEBwYXJhbSBhcnJheSBoaWRlOiBsZXMgY2zDqXMgZGUgbGEgcmVxdcOqdGVzIFNRTCBBSkFYIHF1aSBuZSBzb250IHBhcyBhZmZpY2jDqWVzIGRhbnMgbGUgdGFibGVhdSBldCBwb3VyIGxlc3F1ZWxsZXMgb24gY3LDqcOpIHVuIGRhdGEtKiBcbiAqICAgICAgICAgICAgICAgICAgICBleDogbCd1cmwgQUpBWCByZXRvdXJuZSBsZXMgZG9ubsOpZXMgc3VpdmFudGVzIHsnaWQnOjEsICdub20nOidQRVJFWicsICdwcmVub20nOidWaXZpYW4nfVxuICogICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFsnaWQnXSAgIFxuICovXG52YXIgVGFibGVUciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1RhYmxlVHInLFxuICAgIFxuICAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgZGF0YTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgICBoaWRlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgZXZ0czpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBWYXJpYWJsZXNcbiAgICAgICAgICAgIHZhciB0ciA9IFtdO1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGF0dHIgPSB7fTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gUGFyY291cnMgZGVzIGRhdGFcbiAgICAgICAgICAgICBfLmVhY2godGhpcy5wcm9wcy5kYXRhLGZ1bmN0aW9uKHZhbCxrZXkpIHtcbiAgICAgICAgICAgICAgICAgLy8gQ2hhbXAgY2FjaMOpLCBvbiBjcsOpw6kgdW4gZGF0YS1rZXlcbiAgICAgICAgICAgICAgICAgaWYodGhhdC5wcm9wcy5oaWRlLmxlbmd0aCA+IDAgJiYgXy5pbmRleE9mKHRoYXQucHJvcHMuaGlkZSxrZXkpPi0xKXtcbiAgICAgICAgICAgICAgICAgICAgIGF0dHJbJ2RhdGEtJytrZXldID0gdmFsO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIC8vIENlbGx1bGUgZGUgdGFibGVcbiAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICB0ci5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7a2V5OiB0aGF0LnByb3BzLmRhdGEuaWQra2V5fSwgdmFsKSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgLy8gQWpvdXQgZHUgdHJcbiAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgYXR0ciwgIHRoaXMucHJvcHMuZXZ0cyksIHRyKVxuICAgICAgICAgICBcbiAgICAgXG4gICAgfSxcbiAgICBcbiAgICAvKlxuIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHwgRk9OQ1RJT05TIE5PTiBSRUFDVFxuIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbn0pOyIsIi8vIENyZWF0ZXMgYSBEYXRhU3RvcmVcbnZhciBpc0VkdGl0YWJsZVN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcblxuICAgIC8vIEluaXRpYWwgc2V0dXBcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBSZWdpc3RlciBzdGF0dXNVcGRhdGUgYWN0aW9uXG4gICAgICAgIHRoaXMubGlzdGVuVG8oQWN0aW9ucy5nbG9iYWwudGFibGVfYmFuZGVhdV9saW5lX2NsaWNrZWQsIHRoaXMub3V0cHV0VGFibGUpO1xuICAgIH0sXG5cbiAgICAvLyBDYWxsYmFja1xuICAgIG91dHB1dFRhYmxlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIFRSXG4gICAgICAgIHZhciB0ciA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgLy8gR2V0IElEXG4gICAgICAgIHZhciBpc0VkaXRhYmxlID0gJCh0cikuaGFzQ2xhc3MoJ3Jvd19zZWxlY3RlZCcpO1xuXG4gICAgICAgIC8vIFBhc3Mgb24gdG8gbGlzdGVuZXJzXG4gICAgICAgIHRoaXMudHJpZ2dlcihpc0VkaXRhYmxlKTtcbiAgICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWR0aXRhYmxlU3RvcmU7Il19
