/**
 * Composant permettant d'afficher le libelle du profil avec le tableau des modules correspondant
 *
 *
 *
 *
 *
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

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

/*********************************************/
/* Composant input pour le libelle du profil */
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;

var AuthentMixins        = require('./mixins/component_access');
var DataTable            = require('./composants/tableau/react_data_table');
var DataTableModuleReact = React.createClass({

    mixins: [Reflux.ListenerMixin,AuthentMixins],

    propTypes: {
        head:          React.PropTypes.array.isRequired,
        hide:          React.PropTypes.array.isRequired,
        id:            React.PropTypes.string.isRequired,
        idProfil:      React.PropTypes.number.isRequired,
        nameProfil:    React.PropTypes.string.isRequired,
        editable:      React.PropTypes.bool.isRequired,
        settings:      React.PropTypes.object,
        attributes:    React.PropTypes.object,
        evts:          React.PropTypes.object,
        bUnderline:    React.PropTypes.bool,
        reactElements: React.PropTypes.object
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function() {

        return {
            attributes: {},
            evts:{},
            bUnderline: true,
            reactElements:{}
        };
    },

    getInitialState: function(){
        return {data:[], nameProfil:''};
    },

    /**
     * Avant le 1er affichage
     * Abonne le composant au store "profilStore"
     * @returns {undefined}
     */
    componentWillMount: function(){

        /* Ecoute le store profilStore qui se charge de : */
        /*    - Mettre à jour les données                 */
        this.listenTo(moduleStore, this.updateModule, this.updateModule);

        /* Défini l'id profil dans le store */
        Actions.profil.setIdProfil(this.props.idProfil);

        /* Met à jour les données */
        Actions.profil.module_update();
    },

    render: function() {
        return  <div  key='divTableauModule'>
                    <Row>
                        <Col md={12}>
                            <InputTextEditable attributes={{label:Lang.get('global.profils'), name:"libelle", value:this.props.nameProfil, wrapperClassName:'col-md-4',labelClassName:'col-md-2 text-right',groupClassName:'row'}} editable={this.props.editable} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <DataTable id={this.props.id} head={this.props.head} data={this.state.data} hide={this.props.hide} attributes={this.props.attributes} bUnderline={this.props.bUnderline} evts={this.props.evts} reactElements={this.props.reactElements} editable={this.props.editable}/>
                        </Col>
                    </Row>
                </div>;
    },

    /**
     * Mise à jour de la TABLE
     * @param {type} data
     * @returns {undefined}
     */
    updateModule: function(data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    }
});
module.exports.composant = DataTableModuleReact;

/****************************************************************/
/*                          MODULESTORE                         */
/*          Store associé au tableau des modules                */
/****************************************************************/
var moduleStore = Reflux.createStore({
    idProfil:0,

    // Initial setup
    init: function() {
        /* Charge les données du tableau module à chaque évènement "profil_select" */
        this.listenTo(Actions.profil.module_update, this.updateModule);
        this.listenTo(Actions.profil.setIdProfil,   this.setIdProfil);
    },

    /* Charge les données tout seul au début */
    getInitialState:function(){
        return {};
    },

    /* Met à jour le tableau des modules */
    updateModule: function(evt) {

        // AJAX
        $.ajax({
            url:      BASE_URI + 'profils/'+this.idProfil+'/modules', /* correspond au module url de la BDD */
            dataType: 'json',
            context:  this,
            success:  function (dataFromBdd) {
                Actions.profil.initMatrice(dataFromBdd);

                /* Passe "data" en paramètre au(x) composant(s) qui écoutent le store moduleStore */
                this.trigger({data:dataFromBdd});
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                /* Passe "[]" en paramètre au(x) composant(s) qui écoutent le store profilStore */
                this.trigger({data:[]});
            }
        });
    },

    setIdProfil: function(idProfil_P){
        this.idProfil = idProfil_P;
    }
});
module.exports.Store = moduleStore;