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

var AuthentMixins        = require('./mixins/component_access');
var DataTableBandeau     = require('./composants/tableau/react_data_table_bandeau');
var DataTableModuleReact = React.createClass({

    mixins: [Reflux.ListenerMixin,AuthentMixins],

    propTypes: {
        head:          React.PropTypes.array.isRequired,
        hide:          React.PropTypes.array.isRequired,
        id:            React.PropTypes.string.isRequired,
        idProfil:      React.PropTypes.string.isRequired,
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

        /* Ecoute le store profilStore qui se charge de mettre à jour les données */
        this.listenTo(moduleStore, this.updateModule, this.updateModule);

        /* Charge les données */
        Actions.profil.profil_update();
    },

    render: function() {
        return  <div  key='divTableauModule'>
                    <Row>
                        <Col md={12}>
                            <InputTextEditable attributes={{label:Lang.get('global.profils'), name:"libelle", value:this.state.nameProfil, wrapperClassName:'col-md-4',labelClassName:'col-md-2 text-right',groupClassName:'row'}} editable={this.props.editable} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <DataTableBandeau id={this.props.id} head={this.props.head} data={this.state.data} editable={this.props.editable} hide={this.props.hide} attributes={this.props.attributes} bUnderline={this.props.bUnderline} evts={this.props.evts} reactElements={this.props.reactElements}/>
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
        this.setState({data:data.data});
    }
});
module.exports = DataTableModuleReact;

/****************************************************************/
/*                          MODULESTORE                         */
/*          Store associé au tableau des modules                */
/****************************************************************/
var moduleStore = Reflux.createStore({
    isMatriceModuleModif:   false,
    matriceIniModuleDroit : {},
    matriceModuleDroit:     {},
    idProfilSelect:         0,
    data:                   [],
    nameProfil:             '',
    isNameProfilModif:      false,

    // Initial setup
    init: function() {
        /* Charge les données du tableau module à chaque évènement "profil_select" */
        this.listenTo(Actions.profil.profil_select,  this.updateModule);
        this.listenTo(Actions.profil.libelle_change, this.libelleChange);
        this.listenTo(Actions.profil.radio_change,   this.radioChange);
        this.listenTo(Actions.bandeau.creer,         this.createProfil);
        this.listenTo(Actions.bandeau.editer,        this.editProfil);
        this.listenTo(Actions.bandeau.supprimer,     this.supprProfil);
        this.listenTo(Actions.bandeau.sauvegarder,   this.saveProfil);
    },

    /* Charge les données tout seul au début */
    getInitialState:function(){
        var dataRetour = {data:[], nameProfil:'', etatPageProfil:'liste'};

        // AJAX
        $.ajax({
            url:      BASE_URI+'profils/0/module', /* correspond au module url de la BDD */
            dataType: 'json',
            context:  this,
            async:    false,
            success:  function(data) {
                dataRetour.data = data;
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }
        });

        /* Passe "dataRetour" en paramètre au(x) composant(s) qui écoutent le store moduleStore */
        return dataRetour;
    },

    createProfil: function(){
        this.trigger({editable:true});
    },

    /**
     * Passage en mode édition
     */
    editProfil: function(){
        this.trigger({editable:true, profilName:this.nameProfil});
    },

    /**
     * Suppression du profil
     * @param idProfil
     */
    supprProfil: function(){
        console.log('Suppression du profil "'+this.nameProfil+'" à faire.');
    },

    /**
     * Sauvegarde
     */
    saveProfil: function(){
        if(this.isNameProfilModif){
            console.log('Sauvegarde du libelle du profil à faire.');
        }

        if(this.isMatriceModuleModif){
            console.log('Sauvegarde de l\'état des modules à faire.');
        }
    },

    /* Met à jour le tableau des modules */
    updateModule: function(evt) {
        var idProfil = 0;

        /* On a un profil de sélectionné, affichage complet du tableau */
        if($(evt.currentTarget).hasClass('row_selected')) {
            this.idProfilSelect = $(evt.currentTarget).data('id');
            getNameProfilByID();
        }
        console.log('idProfil : '+idProfil);
        // AJAX
        $.ajax({
            url:      BASE_URI + 'profils/' + this.idProfilSelect + '/modules', /* correspond au module url de la BDD */
            dataType: 'json',
            context:  this,
            success:  function (dataFromBdd) {
                var data = {data:dataFromBdd};

                this.matriceIniModuleDroit = {};
                this.matriceModuleDroit    = {};
                var indice = 0;

                /* Initialisation de la matrice initial */
                _.each(dataFromBdd, function(key, value){
                    this.matriceIniModuleDroit[dataFromBdd[indice]['id']] = dataFromBdd[indice]['etat'];
                    indice++;
                }, this);

                /* Initialisation de la matrice représentative de l'état de la page */
                this.matriceModuleDroit = _.clone(this.matriceIniModuleDroit);

                /* Passe "data" en paramètre au(x) composant(s) qui écoutent le store moduleStore */
                this.trigger({data:data, nameProfil:this.nameProfil, editable:false});
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                /* Passe "[]" en paramètre au(x) composant(s) qui écoutent le store profilStore */
                this.trigger([]);
            }
        });
    },

    radioChange: function(){

        Etat      = $(evt.currentTarget).data('etat');     /* 'visu', 'modif' ou 'aucun' */
        idModule  = $(evt.currentTarget).data('idModule'); /* id du module concerné      */

        /* Mise a jour de la matrice */
        this.matriceModuleDroit[idModule] = Etat;

        /* Mise à jour du flag pour sauvegarder les modifications sur l'etat des modules */
        this.isMatriceModuleModif = true;
    },

    /**
     * Modification du libelle du profil
     */
    libelleChange: function() {
        this.isNameProfilModif = true;
    },

    getNameProfilByID: function(){
        // AJAX
        $.ajax({
            url: BASE_URI+'profils/'+this.idProfilSelect, /* correspond au module url de la BDD */
            dataType: 'json',
            context: this,
            async:false,
            success: function(data) {
                this.nameProfil = data.traduction;
            },
            error: function(xhr, status, err) {
                this.nameProfil = 'Error in getNameProfilByID';
                console.error(status, err.toString());
            }
        });
    }
});
module.exports.Store = moduleStore;