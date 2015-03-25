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
 * @param object reactElements: voire composant react 'TableTr'
 */
var React = require('react/addons');
var Table = require('./react_table');
var DataTableReact = React.createClass({

    oDataTable: {},

    cssLigne: 'row_selected',
    myEvts: {},
    userClick: function () {
    },

    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        id: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired,
        settings: React.PropTypes.object,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        bUnderline: React.PropTypes.bool,
        onDataTableLineClick: React.PropTypes.func,
        reactElements: React.PropTypes.object,
        editable: React.PropTypes.bool
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function () {

        return {
            settings: {
                destroy: true,
                editable: false,
                responsive: true,
                "language": {
                    "sProcessing": Lang.get('global.datatable.sProcessing'),
                    "sSearch": Lang.get('global.datatable.sSearch'),
                    "sLengthMenu": Lang.get('global.datatable.sLengthMenu'),
                    "sInfo": Lang.get('global.datatable.sInfo'),
                    "sInfoEmpty": Lang.get('global.datatable.sInfoEmpty'),
                    "sInfoFiltered": Lang.get('global.datatable.sInfoFiltered'),
                    "sInfoPostFix": Lang.get('global.datatable.sInfoPostFix'),
                    "sLoadingRecords": Lang.get('global.datatable.sLoadingRecords'),
                    "sZeroRecords": Lang.get('global.datatable.sZeroRecords'),
                    "sEmptyTable": Lang.get('global.datatable.sEmptyTable'),
                    "oPaginate": {
                        "sFirst": Lang.get('global.datatable.oPaginate.sFirst'),
                        "sPrevious": Lang.get('global.datatable.oPaginate.sPrevious'),
                        "sNext": Lang.get('global.datatable.oPaginate.sNext'),
                        "sLast": Lang.get('global.datatable.oPaginate.sLast')
                    },
                    "oAria": {
                        "sSortAscending": Lang.get('global.datatable.oAria.sSortAscending'),
                        "sSortDescending": Lang.get('global.datatable.oAria.sSortDescending')
                    }
                }
            },
            attributes: {},
            evts: {},
            bUnderline: true,
            onDataTableLineClick: function () {
            },
            reactElements: {}
        };
    },

    componentWillMount: function () {

        // Copie des evts passés en param
        this.myEvts = _.clone(this.props.evts);
        // Evts définis par le DEV.
        if (this.myEvts.onClick !== undefined) {
            this.userClick = this.myEvts.onClick;
        }
        // Evt onClick avec prise en charge dataTableBandeau + DataTable + DEV click
        this.myEvts.onClick = this.handleClick;
    },

    componentWillReceiveProps: function (newProps) {

    },

    componentWillUpdate: function (newProps, newState) {
        // Suppression datable
        this.destroyDataTable();
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        //console.log('EGAL TABLE %o', !(_.isEqual(nextProps, this.props)));
        return !(_.isEqual(nextProps, this.props));
    },

    render: function () {
        //console.log('RENDER DATATABLE PROPS %o',_.clone(this.props));
        return (
            <div className="datatable-root" key="dataTableRoot">
                <Table
                    id={this.props.id}
                    head={this.props.head}
                    data={this.props.data}
                    hide={this.props.hide}
                    attributes={this.props.attributes}
                    evts={this.myEvts}
                    reactElements={this.props.reactElements}
                    editable={this.props.editable} />
            </div>
        )
    },

    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentDidMount: function () {
        this.applyDataTable();
    },

    /**
     * Après le 2è affichage
     * @returns {undefined}
     */
    componentDidUpdate: function () {
        // Suppression datable
        this.applyDataTable();
    },

    componentWillUnmount: function () {

        /* Suppresion datatable OBLIGATOIRE
        Lorsqu'un composant datatable est inclus dans un autre composant et qu'il possède plus de 10 lignes
        seulement 10 lignes existent dans le DOM, les autres lignes sont supprimées. Lors d'un setState()
        lorsque REACT compare ses 2 renders, il lui manque des lignes et il affiche une FATAL ERROR
        Le fait de supprimer le plugin JQuery lors du unMount règle le problème */
        this.destroyDataTable();
    },
    /*
     |--------------------------------------------------------------------------
     | FONCTIONS NON REACT
     |--------------------------------------------------------------------------
     */
    /**
     * On applique le plugin dataTable sur la TABLE HTML
     */
    applyDataTable: function () {
        // Activation datatable
        this.oDataTable = $('#' + this.props.id).DataTable(this.props.settings);
        // Tableau à entete fixe
        new $.fn.dataTable.FixedHeader(this.oDataTable, {
            "offsetTop": 50
        });

        // Supression du data-reactid
        $('.fixedHeader table').removeAttr('data-reactid');
    },

    /**
     * Destruction du composant dataTable
     * @returns {undefined}
     */
    destroyDataTable: function () {
        if (!$.isEmptyObject(this.oDataTable)) {
            this.oDataTable.destroy();
            this.oDataTable.clear();// HYPER IMPORTANT clear() après destroy()
            // suppression fixed header
            $('.fixedHeader').remove();
        }
    },
    /**
     * Selectionne visuellement une ligne de tableau
     * @param {event} evt: evenement js
     * @returns {undefined}
     */
    selectRow: function (evt) {
        var tr = $(evt.currentTarget);
        // GESTION VISUELLE
        if (tr.hasClass(this.cssLigne)) {
            tr.removeClass(this.cssLigne);
        } else {
            tr.parent('tbody').find('tr').removeClass(this.cssLigne);
            tr.addClass(this.cssLigne);
        }
    },

    handleClick: function (e) {
        // Le DEV veut un surlignage sur clic
        if (this.props.bUnderline) {
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