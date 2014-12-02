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


},{"./mods/react_bandeau":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_bandeau.js","./mods/react_data_table_bandeau_utilisateur":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table_bandeau_utilisateur.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\mixins\\component_access.js":[function(require,module,exports){
/**
 * Utilise la variable de classe
 * @type {{componentWillMount: Function}}
 */
var AuthentLevelMixin = {
    componentWillMount: function () {
        this._originalRender = this.render;
        this._setRenderMethod();
    },
    componentWillUpdate: function () {
        this._setRenderMethod();
    },
    _emptyRender: function () {
        return React.createElement("span", null);
    },
    _setRenderMethod: function () {
        this.render = Auth.canAccess(this.module_url) ? this._originalRender : this._emptyRender;
    }
}

module.exports = AuthentLevelMixin;
},{}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_bandeau.js":[function(require,module,exports){
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
},{"./mixins/component_access":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\mixins\\component_access.js","./react_data_table_bandeau":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_data_table_bandeau.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_table.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYXBwXFxhc3NldHNcXGpzXFx1dGlsaXNhdGV1ci5hcHAuanMiLCJhcHBcXGFzc2V0c1xcanNcXG1vZHNcXG1peGluc1xcY29tcG9uZW50X2FjY2Vzcy5qcyIsImFwcFxcYXNzZXRzXFxqc1xcbW9kc1xccmVhY3RfYmFuZGVhdS5qcyIsImFwcFxcYXNzZXRzXFxqc1xcbW9kc1xccmVhY3RfZGF0YV90YWJsZS5qcyIsImFwcFxcYXNzZXRzXFxqc1xcbW9kc1xccmVhY3RfZGF0YV90YWJsZV9iYW5kZWF1LmpzIiwiYXBwXFxhc3NldHNcXGpzXFxtb2RzXFxyZWFjdF9kYXRhX3RhYmxlX2JhbmRlYXVfdXRpbGlzYXRldXIuanMiLCJhcHBcXGFzc2V0c1xcanNcXG1vZHNcXHJlYWN0X3RhYmxlLmpzIiwiYXBwXFxhc3NldHNcXGpzXFxtb2RzXFxzdG9yZXNcXHN0b3JlX2JhbmRlYXVfaXNfZWRpdGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEFUVEVOVElPTiBsYSBtYWp1c2N1bGUgZXN0IHN1cGVyIGltcG9ydGFudGVcbnZhciBEYXRhVGFibGVCYW5kZWF1VXNlciA9IHJlcXVpcmUoJy4vbW9kcy9yZWFjdF9kYXRhX3RhYmxlX2JhbmRlYXVfdXRpbGlzYXRldXInKTtcbnZhciBCYW5kZWF1ID0gcmVxdWlyZSgnLi9tb2RzL3JlYWN0X2JhbmRlYXUnKTtcbnZhciBCdXR0b24gPSBSZWFjdEIuQnV0dG9uO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgLy8gVGFibGVhdVxuICAgIHZhciBoZWFkID0gWydOb20nLCdFLW1haWwnLCdFLW1haWwnLCdFLW1haWwnXTtcbiAgICB2YXIgaGlkZSA9IFsnaWQnXTtcbiAgICB2YXIgZXZ0cyA9IHsnb25DbGljayc6QWN0aW9ucy51dGlsaXNhdGV1ci5kaXNwbGF5X3VzZXIoKX07XG4gICAgXG4gICAgLy8gQmFuZGVhdSBBVFRFTlRJT04gQkFOREVBVSBBVkFOVCDDoCBjYXVzZSBkdSBmaXhlZCBoZWFkZXIgZHUgdGFibGVhdVxuICAgICB2YXIgb0JhbmRlYXUgPSBSZWFjdC5yZW5kZXIoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQmFuZGVhdSwge3RpdHJlOiBMYW5nLmdldCgndXRpbGlzYXRldXIudGl0cmUnKX0pLFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFuZGVhdScpXG4gICAgKTtcbiAgICBcbiAgICBcbiAgICB2YXIgb1JlYWN0VGFibGUgPSBSZWFjdC5yZW5kZXIoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGF0YVRhYmxlQmFuZGVhdVVzZXIsIHtoZWFkOiBoZWFkLCBoaWRlOiBoaWRlLCBpZDogXCJ0YWJfdXNlcnNcIiwgZXZ0czogZXZ0c30pLFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGVhdV9yZWFjdCcpXG4gICAgKTtcbiAgICBcbiAgICBcbiAgICBcbiAgICBcbiAgICBcbiAgICBcbiAgICBcbiAgICBcbiAgICAvLyBDbGljayBib3V0b24gSUlJSUlcbiAgICAkKCcjdGVzdCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4vLyAgICAgICBvUmVhY3RUYWJsZS5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgQWN0aW9ucy51dGlsaXNhdGV1ci5sb2FkX2RhdGEoKTtcbiAgICB9KTtcbn0pO1xuXG4iLCIvKipcbiAqIFV0aWxpc2UgbGEgdmFyaWFibGUgZGUgY2xhc3NlXG4gKiBAdHlwZSB7e2NvbXBvbmVudFdpbGxNb3VudDogRnVuY3Rpb259fVxuICovXG52YXIgQXV0aGVudExldmVsTWl4aW4gPSB7XG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX29yaWdpbmFsUmVuZGVyID0gdGhpcy5yZW5kZXI7XG4gICAgICAgIHRoaXMuX3NldFJlbmRlck1ldGhvZCgpO1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zZXRSZW5kZXJNZXRob2QoKTtcbiAgICB9LFxuICAgIF9lbXB0eVJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCk7XG4gICAgfSxcbiAgICBfc2V0UmVuZGVyTWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyID0gQXV0aC5jYW5BY2Nlc3ModGhpcy5tb2R1bGVfdXJsKSA/IHRoaXMuX29yaWdpbmFsUmVuZGVyIDogdGhpcy5fZW1wdHlSZW5kZXI7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGhlbnRMZXZlbE1peGluOyIsIi8qKlxuICogQHBhcmFtIGFycmF5IGhlYWQ6IGFycmF5IGNvbnRlbmFudCBsJ2VudMOqdGUgZHUgdGFibGVhdSBbJ0EnLCAnQiddXG4gKi9cblxudmFyIGlzRWR0aXRhYmxlU3RvcmUgPSByZXF1aXJlKCcuL3N0b3Jlcy9zdG9yZV9iYW5kZWF1X2lzX2VkaXRhYmxlJyk7XG52YXIgQnV0dG9uID0gUmVhY3RCLkJ1dHRvbjtcbnZhciBCdXR0b25Ub29sYmFyID0gUmVhY3RCLkJ1dHRvblRvb2xiYXI7XG52YXIgR2x5cGhpY29uID0gUmVhY3RCLkdseXBoaWNvbjtcblxudmFyIFJlYWN0QmFuZGVhdSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1JlYWN0QmFuZGVhdScsXG4gICAgbWl4aW5zOiBbUmVmbHV4Lkxpc3RlbmVyTWl4aW5dLFxuICAgIFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICB0aXRyZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogTGVzIHByb3BzIHBhciBkw6lmYXV0XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHt0aXRyZTogJ1RpdGxlJ307XG4gICAgfSxcbiAgICBcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge2JFZGl0YWJsZTogZmFsc2V9O1xuICAgIH0sXG4gICAgXG4gICAgXG4gICAgLyoqXG4gICAgICogQXZhbnQgbGUgMWVyIGFmZmljaGFnZVxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFwcsOocyBsZSAxZXIgYWZmaWNoYWdlXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyhpc0VkdGl0YWJsZVN0b3JlLCB0aGlzLm9uU3RhdHVzQ2hhbmdlKTtcbiAgICB9LFxuICAgIFxuICAgIG9uU3RhdHVzQ2hhbmdlOiBmdW5jdGlvbihpc0VkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgYkVkaXRhYmxlOiBpc0VkaXRhYmxlXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogQXByw6hzIGNoYXF1ZSBtaXNlIMOgIGpvdXIgREFUQSBkdSB0YWJsZWF1IChmb3JjZXVwZGF0ZSgpIG91IHNldFN0YXRlKCkpXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgY29uc29sZS5sb2coJ0RBVEFUQUJMRSBkaWR1cGRhdGUnKTtcbiAgICB9LFxuICAgIFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuLy8gICAgICAgIHZhciBpbmFjdGlmID0gKHRoaXMuc3RhdGUuYkVkaXRhYmxlP3t9OnsnZGlzYWJsZWQnOidkaXNhYmxlZCd9KTtcbiAgICB2YXIgaW5hY3RpZiA9IHsnZGlzYWJsZWQnOiF0aGlzLnN0YXRlLmJFZGl0YWJsZX07XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sLW1kLTEyIGJhbmRlYXVcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIHRoaXMucHJvcHMudGl0cmUpLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgbnVsbCwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtpZDogXCJidG5fY3JlZXJcIiwgYnNTaXplOiBcInNtYWxsXCJ9LCBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwge2dseXBoOiBcInBsdXMtc2lnblwifSksIFwiIFwiLCBMYW5nLmdldCgnZ2xvYmFsLmNyZWF0ZScpKSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIFJlYWN0Ll9fc3ByZWFkKHtpZDogXCJidG5fZWRpdFwiLCBic1NpemU6IFwic21hbGxcIn0sICBpbmFjdGlmKSwgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHtnbHlwaDogXCJwZW5jaWxcIn0pLCBcIiBcIiwgTGFuZy5nZXQoJ2dsb2JhbC5lZGl0JykpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgUmVhY3QuX19zcHJlYWQoe2lkOiBcImJ0bl9kZWxcIiwgYnNTaXplOiBcInNtYWxsXCJ9LCAgaW5hY3RpZiksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7Z2x5cGg6IFwibWludXMtc2lnblwifSksIFwiIFwiLCBMYW5nLmdldCgnZ2xvYmFsLmRlbCcpKVxuICAgICAgICAgICAgKVxuICAgICAgICAgKVxuICAgICAgICApXG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RCYW5kZWF1O1xuIiwiLyoqXHJcbiAqIEBwYXJhbSBhcnJheSBoZWFkOiBhcnJheSBjb250ZW5hbnQgbCdlbnTDqnRlIGR1IHRhYmxlYXUgWydBJywgJ0InXVxyXG4gKiBAcGFyYW0gYXJyYXkgZGF0YTogdGFibGVhdSBkZSBkb25uw6llcyBleDogW3t9LHt9XVxyXG4gKiBAcGFyYW0gYXJyYXkgaGlkZTogbGVzIGNsw6lzIGRlIGxhIHJlcXXDqnRlcyBTUUwgQUpBWCBxdWkgbmUgc29udCBwYXMgYWZmaWNow6llcyBkYW5zIGxlIHRhYmxlYXUgZXQgcG91ciBsZXNxdWVsbGVzIG9uIGNyw6nDqSB1biBkYXRhLSpcclxuICogICAgICAgICAgICAgICAgICAgIGV4OiBsJ3VybCBBSkFYIHJldG91cm5lIGxlcyBkb25uw6llcyBzdWl2YW50ZXMgeydpZCc6MSwgJ25vbSc6J1BFUkVaJywgJ3ByZW5vbSc6J1Zpdmlhbid9XHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBbJ2lkJ11cclxuICogQHBhcmFtIHN0cmluZyBpZDogYXR0cmlidXQgSUQgZGUgbGEgYmFsaXNlIFRBQkxFXHJcbiAqIEBwYXJhbSBvYmplY3Qgc2V0dGluZ3M6IG9iamV0IEpTT04gcGVybWV0dGFudCBkZSBwYXJhbcOodHJlciBkYXRhVGFibGUgdm9pciBodHRwOi8vd3d3LmRhdGF0YWJsZXMubmV0L3JlZmVyZW5jZS9vcHRpb24vXHJcbiAqIEBwYXJhbSBvYmplY3QgYXR0cmlidXRlczogYXR0cmlidXRzIEhUTUwgZGUgbGEgVEFCTEUuIGV4IHthbHQ6J21vbiBhbHQnLCBjb2xzcGFuOjJ9XHJcbiAqIEBwYXJhbSBvYmplY3QgZXZ0czogw6l2w6huZW1lbnRzIHN1ciBsZXMgbGlnbmVzIGRlIHRhYmxlYXUge29uQ2xpY2s6ZnVuY3Rpb24ofXt9fSBBVFRFTlRJT046IGxlcyBjbMOpcyBjb3JyZXNwb25kZW50IGF1eCBub21zIGQnw6l2w6huZW1lbnRzIEhUTUwgY2FzZSBzZW5zaXRpdmUuXHJcbiAqIEBwYXJhbSBib29sZWFuIGJVbmRlcmxpbmU6IFRSVUU6IEV2ZW5lbWVudCBwYXIgZGVmYXV0IHN1ciBjbGljayBkJ3VuZSBsaWduZTogc3VybGlnbmFnZVxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGQUxTRTogcGFzIGQnw6l2w6huZW1lbnQgcGFyIGTDqWZhdXQuXHJcbiAqIEBwYXJhbSBmdW5jdGlvbiBvbkRhdGFUYWJsZUxpbmVDbGljazogc3VyIGNsaWMgbGlnbmUgZGUgdGFibGVhdSBEYXRhVGFibGVcclxuICovXHJcblxyXG52YXIgVGFibGUgPSByZXF1aXJlKCcuL3JlYWN0X3RhYmxlJyk7XHJcbnZhciBEYXRhVGFibGVSZWFjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0RhdGFUYWJsZVJlYWN0JyxcclxuICAgIFxyXG4gICAgb0RhdGFUYWJsZTp7fSxcclxuICAgIFxyXG4gICAgY3NzTGlnbmU6ICdyb3dfc2VsZWN0ZWQnLFxyXG4gICAgbXlFdnRzIDoge30sXHJcbiAgICB1c2VyQ2xpY2s6IGZ1bmN0aW9uKCl7fSxcclxuICAgIFxyXG4gICAgcHJvcFR5cGVzOiB7XHJcbiAgICAgICAgaGVhZDogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgaGlkZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXHJcbiAgICAgICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgICAgICBkYXRhOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcclxuICAgICAgICBzZXR0aW5nczpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6UmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcclxuICAgICAgICBldnRzOlJlYWN0LlByb3BUeXBlcy5vYmplY3QsXHJcbiAgICAgICAgYlVuZGVybGluZTpSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcclxuICAgICAgICBvbkRhdGFUYWJsZUxpbmVDbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogTGVzIHByb3BzIHBhciBkw6lmYXV0XHJcbiAgICAgKi9cclxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2V0dGluZ3M6e1xyXG4gICAgICAgICAgICAgICAgXCJsYW5ndWFnZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzUHJvY2Vzc2luZ1wiOiAgICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUuc1Byb2Nlc3NpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNTZWFyY2hcIjogICAgICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zU2VhcmNoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzTGVuZ3RoTWVudVwiOiAgICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUuc0xlbmd0aE1lbnUnKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNJbmZvXCI6ICAgICAgICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zSW5mbycpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic0luZm9FbXB0eVwiOiAgICAgIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLnNJbmZvRW1wdHknKSxcclxuICAgICAgICAgICAgICAgICAgICBcInNJbmZvRmlsdGVyZWRcIjogICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5zSW5mb0ZpbHRlcmVkJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzSW5mb1Bvc3RGaXhcIjogICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUuc0luZm9Qb3N0Rml4JyksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzTG9hZGluZ1JlY29yZHNcIjogTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUuc0xvYWRpbmdSZWNvcmRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzWmVyb1JlY29yZHNcIjogICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUuc1plcm9SZWNvcmRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzRW1wdHlUYWJsZVwiOiAgICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUuc0VtcHR5VGFibGUnKSxcclxuICAgICAgICAgICAgICAgICAgICBcIm9QYWdpbmF0ZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic0ZpcnN0XCI6ICAgICAgTGFuZy5nZXQoJ2dsb2JhbC5kYXRhdGFibGUub1BhZ2luYXRlLnNGaXJzdCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNQcmV2aW91c1wiOiAgIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLm9QYWdpbmF0ZS5zUHJldmlvdXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzTmV4dFwiOiAgICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5vUGFnaW5hdGUuc05leHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzTGFzdFwiOiAgICAgICBMYW5nLmdldCgnZ2xvYmFsLmRhdGF0YWJsZS5vUGFnaW5hdGUuc0xhc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvQXJpYVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic1NvcnRBc2NlbmRpbmdcIjogIExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLm9BcmlhLnNTb3J0QXNjZW5kaW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic1NvcnREZXNjZW5kaW5nXCI6IExhbmcuZ2V0KCdnbG9iYWwuZGF0YXRhYmxlLm9BcmlhLnNTb3J0RGVzY2VuZGluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHt9LFxyXG4gICAgICAgICAgICBldnRzOnt9LFxyXG4gICAgICAgICAgICBiVW5kZXJsaW5lOiB0cnVlLFxyXG4gICAgICAgICAgICBvbkRhdGFUYWJsZUxpbmVDbGljazogZnVuY3Rpb24oKXt9XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgXHJcbiAgICAgICAgLy8gQ29waWUgZGVzIGV2dHMgcGFzc8OpcyBlbiBwYXJhbVxyXG4gICAgICAgIHRoaXMubXlFdnRzID0gXy5jbG9uZSh0aGlzLnByb3BzLmV2dHMpO1xyXG4gICAgICAgIC8vIEV2dHMgZMOpZmluaXMgcGFyIGxlIERFVi5cclxuICAgICAgICBpZih0aGlzLm15RXZ0cy5vbkNsaWNrICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJDbGljayA9IHRoaXMubXlFdnRzLm9uQ2xpY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEV2dCBvbkNsaWNrIGF2ZWMgcHJpc2UgZW4gY2hhcmdlIGRhdGFUYWJsZUJhbmRlYXUgKyBEYXRhVGFibGUgKyBERVYgY2xpY2tcclxuICAgICAgICB0aGlzLm15RXZ0cy5vbkNsaWNrID0gdGhpcy5oYW5kbGVDbGljaztcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5ld1Byb3BzKXtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uKG5ld1Byb3BzLCBuZXdTdGF0ZSl7ICAgICAgICAgXHJcbiAgICAgICAgLy8gU3VwcHJlc3Npb24gZGF0YWJsZVxyXG4gICAgICAgIHRoaXMuZGVzdHJveURhdGFUYWJsZSgpO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYmxlLCB7aWQ6IHRoaXMucHJvcHMuaWQsIGhlYWQ6IHRoaXMucHJvcHMuaGVhZCwgZGF0YTogdGhpcy5wcm9wcy5kYXRhLCBoaWRlOiB0aGlzLnByb3BzLmhpZGUsIGF0dHJpYnV0ZXM6IHRoaXMucHJvcHMuYXR0cmlidXRlcywgZXZ0czogdGhpcy5teUV2dHN9KVxyXG4gICAgICAgIClcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQXByw6hzIGxlIDFlciBhZmZpY2hhZ2VcclxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgICAgKi9cclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuYXBwbHlEYXRhVGFibGUoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQXByw6hzIGxlIDLDqCBhZmZpY2hhZ2VcclxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgICAgKi9cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBTdXBwcmVzc2lvbiBkYXRhYmxlXHJcbiAgICAgICAgdGhpcy5hcHBseURhdGFUYWJsZSgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gLypcclxuIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gfCBGT05DVElPTlMgTk9OIFJFQUNUXHJcbiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbiAgICAvKipcclxuICAgICAqIE9uIGFwcGxpcXVlIGxlIHBsdWdpbiBkYXRhVGFibGUgc3VyIGxhIFRBQkxFIEhUTUxcclxuICAgICAqL1xyXG4gICAgYXBwbHlEYXRhVGFibGU6IGZ1bmN0aW9uKCl7ICAgICAgICBcclxuICAgICAgICAvLyBBY3RpdmF0aW9uIGRhdGF0YWJsZVxyXG4gICAgICAgIHRoaXMub0RhdGFUYWJsZSA9ICQoJyMnK3RoaXMucHJvcHMuaWQpLkRhdGFUYWJsZSh0aGlzLnByb3BzLnNldHRpbmdzKTtcclxuLy8gICAgICAgIG5ldyAkLmZuLmRhdGFUYWJsZS5GaXhlZEhlYWRlciggdGhpcy5vRGF0YVRhYmxlLHtcclxuLy8gICAgICAgICAgICBcIm9mZnNldFRvcFwiOiA1MFxyXG4vLyAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERlc3RydWN0aW9uIGR1IGNvbXBvc2FudCBkYXRhVGFibGVcclxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgICAgKi9cclxuICAgIGRlc3Ryb3lEYXRhVGFibGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoISQuaXNFbXB0eU9iamVjdCh0aGlzLm9EYXRhVGFibGUpKXtcclxuICAgICAgICAgICAgdGhpcy5vRGF0YVRhYmxlLmRlc3Ryb3koKTsvLyBBVFRFTlRJT04gdHJ1ZSBwb3NlIHBiIHN1ciBmaXhlZEhlYWRlclxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIFNlbGVjdGlvbm5lIHZpc3VlbGxlbWVudCB1bmUgbGlnbmUgZGUgdGFibGVhdVxyXG4gICAgICogQHBhcmFtIHtldmVudH0gZXZ0OiBldmVuZW1lbnQganNcclxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgICAgKi9cclxuICAgIHNlbGVjdFJvdzogZnVuY3Rpb24oZXZ0KXtcclxuICAgICAgICB2YXIgdHIgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAvLyBHRVNUSU9OIFZJU1VFTExFXHJcbiAgICAgICAgaWYgKHRyLmhhc0NsYXNzKHRoaXMuY3NzTGlnbmUpKSB7XHJcbiAgICAgICAgICAgICAgICB0ci5yZW1vdmVDbGFzcyh0aGlzLmNzc0xpZ25lKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0ci5wYXJlbnQoJ3Rib2R5JykuZmluZCgndHInKS5yZW1vdmVDbGFzcyh0aGlzLmNzc0xpZ25lKVxyXG4gICAgICAgICAgICAgICAgdHIuYWRkQ2xhc3ModGhpcy5jc3NMaWduZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIC8vIExlIERFViB2ZXV0IHVuIHN1cmxpZ25hZ2Ugc3VyIGNsaWNcclxuICAgICAgICBpZih0aGlzLnByb3BzLmJVbmRlcmxpbmUpe1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFJvdyhlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRXhlY3V0aW9uIGNsaWMgZGF0YSB0YWJsZSBiYW5kZWF1XHJcbiAgICAgICAgdmFyIG1vbkV2ZW5lbWVudCA9IF8uY2xvbmUoZSk7Ly8gSU1QT1JUQU5UIFZSQUkgY29waWUgZXQgbm9uIGFmZmVjdGF0aW9uIGRlIHLDqWbDqXJlbmNlc1xyXG4gICAgICAgIHRoaXMucHJvcHMub25EYXRhVGFibGVMaW5lQ2xpY2sobW9uRXZlbmVtZW50KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBFeGVjdXRpb24gY2xpYyBkw6lmaW5pIHBhciBERVZcclxuICAgICAgICB0aGlzLnVzZXJDbGljayhlKTtcclxuICAgICAgICBcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFUYWJsZVJlYWN0O1xyXG4iLCIvKipcbiAqIEBwYXJhbSBhcnJheSBoZWFkOiBhcnJheSBjb250ZW5hbnQgbCdlbnTDqnRlIGR1IHRhYmxlYXUgWydBJywgJ0InXVxuICogQHBhcmFtIGFycmF5IGRhdGE6IHRhYmxlYXUgZGUgZG9ubsOpZXMgZXg6IFt7fSx7fV1cbiAqIEBwYXJhbSBhcnJheSBoaWRlOiBsZXMgY2zDqXMgZGUgbGEgcmVxdcOqdGVzIFNRTCBBSkFYIHF1aSBuZSBzb250IHBhcyBhZmZpY2jDqWVzIGRhbnMgbGUgdGFibGVhdSBldCBwb3VyIGxlc3F1ZWxsZXMgb24gY3LDqcOpIHVuIGRhdGEtKlxuICogICAgICAgICAgICAgICAgICAgIGV4OiBsJ3VybCBBSkFYIHJldG91cm5lIGxlcyBkb25uw6llcyBzdWl2YW50ZXMgeydpZCc6MSwgJ25vbSc6J1BFUkVaJywgJ3ByZW5vbSc6J1Zpdmlhbid9XG4gKiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gWydpZCddXG4gKiBAcGFyYW0gc3RyaW5nIGlkOiBhdHRyaWJ1dCBJRCBkZSBsYSBiYWxpc2UgVEFCTEVcbiAqIEBwYXJhbSBvYmplY3Qgc2V0dGluZ3M6IG9iamV0IEpTT04gcGVybWV0dGFudCBkZSBwYXJhbcOodHJlciBkYXRhVGFibGUgdm9pciBodHRwOi8vd3d3LmRhdGF0YWJsZXMubmV0L3JlZmVyZW5jZS9vcHRpb24vXG4gKiBAcGFyYW0gb2JqZWN0IGF0dHJpYnV0ZXM6IGF0dHJpYnV0cyBIVE1MIGRlIGxhIFRBQkxFLiBleCB7YWx0Oidtb24gYWx0JywgY29sc3BhbjoyfVxuICogQHBhcmFtIG9iamVjdCBldnRzOiDDqXbDqG5lbWVudHMgc3VyIGxlcyBsaWduZXMgZGUgdGFibGVhdSB7b25DbGljazpmdW5jdGlvbih9e319IEFUVEVOVElPTjogbGVzIGNsw6lzIGNvcnJlc3BvbmRlbnQgYXV4IG5vbXMgZCfDqXbDqG5lbWVudHMgSFRNTCBjYXNlIHNlbnNpdGl2ZS5cbiAqIEBwYXJhbSBib29sZWFuIGJVbmRlcmxpbmU6IFRSVUU6IEV2ZW5lbWVudCBwYXIgZGVmYXV0IHN1ciBjbGljayBkJ3VuZSBsaWduZTogc3VybGlnbmFnZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgRkFMU0U6IHBhcyBkJ8OpdsOobmVtZW50IHBhciBkw6lmYXV0LlxuICovXG5cbnZhciBEYXRhVGFibGUgPSByZXF1aXJlKCcuL3JlYWN0X2RhdGFfdGFibGUnKTsgXG52YXIgRGF0YVRhYmxlQmFuZGVhdVJlYWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnRGF0YVRhYmxlQmFuZGVhdVJlYWN0JyxcbiAgICBcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaGVhZDogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICAgIGhpZGU6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBkYXRhOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgc2V0dGluZ3M6UmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgYXR0cmlidXRlczpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBldnRzOlJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGJVbmRlcmxpbmU6UmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIExlcyBwcm9wcyBwYXIgZMOpZmF1dFxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICAgICAgICBldnRzOnt9LFxuICAgICAgICAgICAgYlVuZGVybGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERhdGFUYWJsZSwge2lkOiB0aGlzLnByb3BzLmlkLCBoZWFkOiB0aGlzLnByb3BzLmhlYWQsIGRhdGE6IHRoaXMucHJvcHMuZGF0YSwgaGlkZTogdGhpcy5wcm9wcy5oaWRlLCBhdHRyaWJ1dGVzOiB0aGlzLnByb3BzLmF0dHJpYnV0ZXMsIGJVbmRlcmxpbmU6IHRoaXMucHJvcHMuYlVuZGVybGluZSwgZXZ0czogdGhpcy5wcm9wcy5ldnRzLCBvbkRhdGFUYWJsZUxpbmVDbGljazogQWN0aW9ucy5nbG9iYWwudGFibGVfYmFuZGVhdV9saW5lX2NsaWNrZWR9KVxuICAgICAgICApXG4gICAgfVxuICAgIFxuIC8qXG4gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gfCBGT05DVElPTlMgTk9OIFJFQUNUXG4gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbiAgICBcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFUYWJsZUJhbmRlYXVSZWFjdDtcbiIsIi8qKlxuICogQHBhcmFtIGFycmF5IGhlYWQ6IGFycmF5IGNvbnRlbmFudCBsJ2VudMOqdGUgZHUgdGFibGVhdSBbJ0EnLCAnQiddXG4gKiBAcGFyYW0gYXJyYXkgaGlkZTogbGVzIGNsw6lzIGRlIGxhIHJlcXXDqnRlcyBTUUwgQUpBWCBxdWkgbmUgc29udCBwYXMgYWZmaWNow6llcyBkYW5zIGxlIHRhYmxlYXUgZXQgcG91ciBsZXNxdWVsbGVzIG9uIGNyw6nDqSB1biBkYXRhLSpcbiAqICAgICAgICAgICAgICAgICAgICBleDogbCd1cmwgQUpBWCByZXRvdXJuZSBsZXMgZG9ubsOpZXMgc3VpdmFudGVzIHsnaWQnOjEsICdub20nOidQRVJFWicsICdwcmVub20nOidWaXZpYW4nfVxuICogICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFsnaWQnXVxuICogQHBhcmFtIHN0cmluZyBpZDogYXR0cmlidXQgSUQgZGUgbGEgYmFsaXNlIFRBQkxFXG4gKiBAcGFyYW0gb2JqZWN0IHNldHRpbmdzOiBvYmpldCBKU09OIHBlcm1ldHRhbnQgZGUgcGFyYW3DqHRyZXIgZGF0YVRhYmxlIHZvaXIgaHR0cDovL3d3dy5kYXRhdGFibGVzLm5ldC9yZWZlcmVuY2Uvb3B0aW9uL1xuICogQHBhcmFtIG9iamVjdCBhdHRyaWJ1dGVzOiBhdHRyaWJ1dHMgSFRNTCBkZSBsYSBUQUJMRS4gZXgge2FsdDonbW9uIGFsdCcsIGNvbHNwYW46Mn1cbiAqIEBwYXJhbSBvYmplY3QgZXZ0czogw6l2w6huZW1lbnRzIHN1ciBsZXMgbGlnbmVzIGRlIHRhYmxlYXUge29uQ2xpY2s6ZnVuY3Rpb24ofXt9fSBBVFRFTlRJT046IGxlcyBjbMOpcyBjb3JyZXNwb25kZW50IGF1eCBub21zIGQnw6l2w6huZW1lbnRzIEhUTUwgY2FzZSBzZW5zaXRpdmUuXG4gKiBAcGFyYW0gYm9vbGVhbiBiVW5kZXJsaW5lOiBUUlVFOiBFdmVuZW1lbnQgcGFyIGRlZmF1dCBzdXIgY2xpY2sgZCd1bmUgbGlnbmU6IHN1cmxpZ25hZ2VcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZBTFNFOiBwYXMgZCfDqXbDqG5lbWVudCBwYXIgZMOpZmF1dC5cbiAqL1xuXG52YXIgQXV0aGVudE1peGlucyA9IHJlcXVpcmUoJy4vbWl4aW5zL2NvbXBvbmVudF9hY2Nlc3MnKTtcbnZhciBEYXRhVGFibGVCYW5kZWF1ID0gcmVxdWlyZSgnLi9yZWFjdF9kYXRhX3RhYmxlX2JhbmRlYXUnKTtcbnZhciBEYXRhVGFibGVCYW5kZWF1VXRpbGlzYXRldXJSZWFjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0RhdGFUYWJsZUJhbmRlYXVVdGlsaXNhdGV1clJlYWN0JyxcbiAgICBcbiAgICBtaXhpbnM6IFtSZWZsdXguTGlzdGVuZXJNaXhpbixBdXRoZW50TWl4aW5zXSxcbiAgICBcbiAgICBtb2R1bGVfdXJsOiAndXRpbGlzYXRldXInLFxuICAgIFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBoZWFkOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgaGlkZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHNldHRpbmdzOlJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGF0dHJpYnV0ZXM6UmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgZXZ0czpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBiVW5kZXJsaW5lOlJlYWN0LlByb3BUeXBlcy5ib29sXG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBMZXMgcHJvcHMgcGFyIGTDqWZhdXRcbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgICAgICAgICAgZXZ0czp7fSxcbiAgICAgICAgICAgIGJVbmRlcmxpbmU6IHRydWVcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHtkYXRhOltdfTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEFwcsOocyBsZSAxZXIgYWZmaWNoYWdlXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odXNlclN0b3JlLCB0aGlzLnVwZGF0ZURhdGEsIHRoaXMudXBkYXRlRGF0YSk7XG4gICAgICAgIC8vIEFwcGVsIGFjdGlvblxuICAgICAgICBBY3Rpb25zLnV0aWxpc2F0ZXVyLmxvYWRfZGF0YSgpO1xuICAgIH0sXG4gICAgXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGF0YVRhYmxlQmFuZGVhdSwge2lkOiB0aGlzLnByb3BzLmlkLCBoZWFkOiB0aGlzLnByb3BzLmhlYWQsIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSwgaGlkZTogdGhpcy5wcm9wcy5oaWRlLCBhdHRyaWJ1dGVzOiB0aGlzLnByb3BzLmF0dHJpYnV0ZXMsIGJVbmRlcmxpbmU6IHRoaXMucHJvcHMuYlVuZGVybGluZSwgZXZ0czogdGhpcy5wcm9wcy5ldnRzfSlcbiAgICAgICAgKVxuICAgIH0sXG4gICAgXG4gLypcbiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB8IEZPTkNUSU9OUyBOT04gUkVBQ1RcbiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqLyAgIFxuICAgIC8qKlxuICAgICAqIE1pc2Ugw6Agam91ciBkZSBsYSBUQUJMRVxuICAgICAqIEBwYXJhbSB7dHlwZX0gZGF0YVxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgdXBkYXRlRGF0YTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAvLyBNQUogZGF0YVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVRhYmxlQmFuZGVhdVV0aWxpc2F0ZXVyUmVhY3Q7XG5cblxuLy8gQ3JlYXRlcyBhIERhdGFTdG9yZVxudmFyIHVzZXJTdG9yZSA9IFJlZmx1eC5jcmVhdGVTdG9yZSh7XG5cbiAgICAvLyBJbml0aWFsIHNldHVwXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgc3RhdHVzVXBkYXRlIGFjdGlvblxuICAgICAgICB0aGlzLmxpc3RlblRvKEFjdGlvbnMudXRpbGlzYXRldXIubG9hZF9kYXRhLCB0aGlzLmdldERhdGEpO1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgLy8gQ2FsbGJhY2tcbiAgICBnZXREYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQUpBWFxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBCQVNFX1VSSSsndXRpbGlzYXRldXIvYWxsJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIFBhc3NlIHZhcmlhYmxlIGF1eCBjb21wb3NhbnRzIHF1aSDDqWNvdXRlbnQgbCdhY3Rpb24gYWN0aW9uTG9hZERhdGFcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoZGF0YSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcbiAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7ICAgICAgIFxuICAgIH0sXG4gICAgXG4gICAgZ2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBkYXRhUmV0b3VyID0gW107XG4gICAgICAgIC8vIEFKQVhcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogQkFTRV9VUkkrJ3V0aWxpc2F0ZXVyL2FsbCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgIGFzeW5jOmZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGRhdGFSZXRvdXIgPSBkYXRhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG4gICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyAgIFxuICAgICAgICByZXR1cm4gZGF0YVJldG91cjtcbiAgICB9XG4gICAgXG4gICAgXG59KTsiLCIvKipcbiAqIEBwYXJhbSBhcnJheSBoZWFkOiBhcnJheSBjb250ZW5hbnQgbCdlbnTDqnRlIGR1IHRhYmxlYXUgWydBJywgJ0InXVxuICogQHBhcmFtIGFycmF5IGhpZGU6IGxlcyBjbMOpcyBkZSBsYSByZXF1w6p0ZXMgU1FMIEFKQVggcXVpIG5lIHNvbnQgcGFzIGFmZmljaMOpZXMgZGFucyBsZSB0YWJsZWF1IGV0IHBvdXIgbGVzcXVlbGxlcyBvbiBjcsOpw6kgdW4gZGF0YS0qIFxuICogICAgICAgICAgICAgICAgICAgIGV4OiBsJ3VybCBBSkFYIHJldG91cm5lIGxlcyBkb25uw6llcyBzdWl2YW50ZXMgeydpZCc6MSwgJ25vbSc6J1BFUkVaJywgJ3ByZW5vbSc6J1Zpdmlhbid9XG4gKiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gWydpZCddICAgXG4gKiBAcGFyYW0gYXJyYXkgZGF0YTogdGFibGVhdSBkZSBkb25uw6llcyBleDogW3t9LHt9XVxuICogQHBhcmFtIG9iamVjdCBhdHRyaWJ1dGVzOiBBdHRyaWJ1dHMgSFRNTCBUQUJMRVxuICogQHBhcmFtIG9iamVjdCBldnRzOiDDqXbDqG5lbWVudHMgc3VyIGxlcyBsaWduZXMgZGUgdGFibGVhdSB7b25DbGljazpmdW5jdGlvbih9e319IEFUVEVOVElPTjogbGVzIGNsw6lzIGNvcnJlc3BvbmRlbnQgYXV4IG5vbXMgZCfDqXbDqG5lbWVudHMgSFRNTCBjYXNlIHNlbnNpdGl2ZS5cbiAqL1xuXG52YXIgVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdUYWJsZScsXG4gICAgXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGhlYWQ6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgICBoaWRlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgZGF0YTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICAgIGF0dHJpYnV0ZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGV2dHM6UmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogTGVzIHByb3BzIHBhciBkw6lmYXV0XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHthdHRyaWJ1dGVzOnt9LCBldnRzOnt9fTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFZhcmlhYmxlc1xuICAgICAgICAgICAgdmFyIGNvcnBzID0gW107XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFBhcmNvdXJzIGRlcyBsaWduZXMgZHUgdGFibGVhdVxuICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0YUxpbmUsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgLy8gQWpvdXQgZHUgVFJcbiAgICAgICAgICAgICAgICBjb3Jwcy5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFibGVUciwge2tleTogaW5kZXgsIGRhdGE6IGRhdGFMaW5lLCBoaWRlOiB0aGF0LnByb3BzLmhpZGUsIGV2dHM6IHRoYXQucHJvcHMuZXZ0c30pKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIElEXG4gICAgICAgICAgICB2YXIgaWQgPSB7fTtcbiAgICAgICAgICAgIGlmKHRoaXMucHJvcHMuaWQhPXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWQgPSB7J2lkJzp0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVEFCTEVcbiAgICAgICAgICAgICByZXR1cm4oIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwgUmVhY3QuX19zcHJlYWQoe2NsYXNzTmFtZTogXCJkaXNwbGF5IHJlc3BvbnNpdmUgbm8td3JhcFwiLCB3aWR0aDogXCIxMDAlXCJ9LCAgaWQsICB0aGlzLnByb3BzLmF0dHJpYnV0ZXMpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYmxlSGVhZGVyLCB7aGVhZDogdGhpcy5wcm9wcy5oZWFkfSksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLCBjb3JwcylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICB9XG59KTtcbm1vZHVsZS5leHBvcnRzID0gVGFibGU7XG5cbi8qKlxuICogQHBhcmFtIGFycmF5IGhlYWQ6IGFycmF5IGNvbnRlbmFudCBsJ2VudMOqdGUgZHUgdGFibGVhdSBbJ0EnLCAnQiddXG4gKi9cbnZhciBUYWJsZUhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1RhYmxlSGVhZGVyJyxcbiAgICBcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaGVhZDogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWRcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBWYXJpYWJsZXNcbiAgICAgICAgICAgIHZhciBlbnRldGUgPSBbXTtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gRW50ZXRlXG4gICAgICAgICAgICB0aGlzLnByb3BzLmhlYWQuZm9yRWFjaChmdW5jdGlvbihjb2wsaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBlbnRldGUucHVzaChSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2tleTogaW5kZXh9LCBjb2wpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsIGVudGV0ZSkpO1xuICAgICAgICAgICAgXG4gICAgfVxufSk7XG5cbi8qKlxuICogQHBhcmFtIGpzb24gZGF0YTogb2JqZXQgSlNPTi4gZXg6IHtpZDoxLCBuYW1lOnRvdG99XG4gKiBAcGFyYW0gYXJyYXkgaGlkZTogbGVzIGNsw6lzIGRlIGxhIHJlcXXDqnRlcyBTUUwgQUpBWCBxdWkgbmUgc29udCBwYXMgYWZmaWNow6llcyBkYW5zIGxlIHRhYmxlYXUgZXQgcG91ciBsZXNxdWVsbGVzIG9uIGNyw6nDqSB1biBkYXRhLSogXG4gKiAgICAgICAgICAgICAgICAgICAgZXg6IGwndXJsIEFKQVggcmV0b3VybmUgbGVzIGRvbm7DqWVzIHN1aXZhbnRlcyB7J2lkJzoxLCAnbm9tJzonUEVSRVonLCAncHJlbm9tJzonVml2aWFuJ31cbiAqICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBbJ2lkJ10gICBcbiAqL1xudmFyIFRhYmxlVHIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdUYWJsZVRyJyxcbiAgICBcbiAgICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGRhdGE6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgICAgaGlkZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICAgIGV2dHM6UmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gVmFyaWFibGVzXG4gICAgICAgICAgICB2YXIgdHIgPSBbXTtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBhdHRyID0ge307XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFBhcmNvdXJzIGRlcyBkYXRhXG4gICAgICAgICAgICAgXy5lYWNoKHRoaXMucHJvcHMuZGF0YSxmdW5jdGlvbih2YWwsa2V5KSB7XG4gICAgICAgICAgICAgICAgIC8vIENoYW1wIGNhY2jDqSwgb24gY3LDqcOpIHVuIGRhdGEta2V5XG4gICAgICAgICAgICAgICAgIGlmKHRoYXQucHJvcHMuaGlkZS5sZW5ndGggPiAwICYmIF8uaW5kZXhPZih0aGF0LnByb3BzLmhpZGUsa2V5KT4tMSl7XG4gICAgICAgICAgICAgICAgICAgICBhdHRyWydkYXRhLScra2V5XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAvLyBDZWxsdWxlIGRlIHRhYmxlXG4gICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgdHIucHVzaChSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2tleTogdGhhdC5wcm9wcy5kYXRhLmlkK2tleX0sIHZhbCkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgIC8vIEFqb3V0IGR1IHRyXG4gICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGF0dHIsICB0aGlzLnByb3BzLmV2dHMpLCB0cilcbiAgICAgICAgICAgXG4gICAgIFxuICAgIH0sXG4gICAgXG4gICAgLypcbiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB8IEZPTkNUSU9OUyBOT04gUkVBQ1RcbiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG59KTsiLCIvLyBDcmVhdGVzIGEgRGF0YVN0b3JlXG52YXIgaXNFZHRpdGFibGVTdG9yZSA9IFJlZmx1eC5jcmVhdGVTdG9yZSh7XG5cbiAgICAvLyBJbml0aWFsIHNldHVwXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgc3RhdHVzVXBkYXRlIGFjdGlvblxuICAgICAgICB0aGlzLmxpc3RlblRvKEFjdGlvbnMuZ2xvYmFsLnRhYmxlX2JhbmRlYXVfbGluZV9jbGlja2VkLCB0aGlzLm91dHB1dFRhYmxlKTtcbiAgICB9LFxuXG4gICAgLy8gQ2FsbGJhY2tcbiAgICBvdXRwdXRUYWJsZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBUUlxuICAgICAgICB2YXIgdHIgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIC8vIEdldCBJRFxuICAgICAgICB2YXIgaXNFZGl0YWJsZSA9ICQodHIpLmhhc0NsYXNzKCdyb3dfc2VsZWN0ZWQnKTtcblxuICAgICAgICAvLyBQYXNzIG9uIHRvIGxpc3RlbmVyc1xuICAgICAgICB0aGlzLnRyaWdnZXIoaXNFZGl0YWJsZSk7XG4gICAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0VkdGl0YWJsZVN0b3JlOyJdfQ==
