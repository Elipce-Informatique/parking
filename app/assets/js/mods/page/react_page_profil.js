/**
 * Created by Pierre on 16/12/2014.
 */

/* Composant react Bandeau */
var Bandeau = require('../composants/bandeau/react_bandeau');

/****************************************************************/
/*          Composant react_data_table_bandeau_profil           */

var DataTableBandeauProfil = require('../react_data_table_bandeau_profil');

/* Paramètres du composant react_data_table_bandeau_profil      */
/* Entête(s) du tableau : "Profils"                             */
/* Champ(s) caché(s)    : "id"                                  */
/* Sur clic d'une ligne, déclenche l'action "handleClickProfil" */
var headP = [Lang.get('global.profil')];
var hideP = ['id'];
var evtsP = {'onClick':handleClickProfil};

/* Fonction handleClickProfil */
function handleClickProfil(evt){
    var copie = _.clone(evt);
    Actions.profil.profil_select(copie);
}
/*       FIN : Composant react_data_table_bandeau_profil        */
/****************************************************************/

/****************************************************************/
/*          Composant react_data_table_bandeau_module           */

var DataTableBandeauModule = require('../react_data_table_module_profil');

/* Paramètres du composant react_data_table_module_profil            */
/* Entête(s) du tableau : "Module, Droits                            */
/* Champ(s) caché(s)    : "idModule"                                 */
var headMP = [Lang.get('global.module'), Lang.get('global.droits')];
var hideMP = ['idModule'];

/* Paramètres pour les radios Boutons                                */
/* Libelles : "Visu, Modif, Aucun"                                   */
/* Name     : "btnVisu, btnModif, btnAucun                           */
/* Sur clic d'un radio bouton, déclenche l'action "handleClickRadio" */
var aLibelle = new Array(Lang.get('administration.profil.visu'), Lang.get('administration.profil.modif'), Lang.get('administration.profil.aucun'));
var aName    = new Array('btnVisu', 'btnModif', 'btnAucun');
var aReactElements  = {};
aReactElements['1'] = new Array();                           /* Colonne n°1 du tableau               */
aReactElements['1'][0] = 'Radio';                            /* Type de composant à ajouter          */
aReactElements['1'][1] = {'name':aName, 'libelle':aLibelle}; /* Name des radio boutons et libelle    */
aReactElements['1'][2] = {'onClick':handleClickRadio};       /* Evenement sur click des radio bouton */

/* Fonction handleClickRadio */
function handleClickRadio(evt){
    var copie = _.clone(evt);
    Actions.profil.radio_change(copie);
}
/*      FIN : Composant react_data_table_bandeau_module         */
/****************************************************************/


/************************************************************************************************/
/*                                                                                              */
/*                               COMPOSANT REACT PAGE PROFIL                                    */
/*                                                                                              */
/************************************************************************************************/
var ReactPageProfil  = React.createClass({

    /**
     * État initial des données du composant
     * isNameProfilModif    : pas de modification sur le nom du profil
     * isMatriceModuleModif : pas de modification de la matrice des droits des modules
     * matriceModuleDroit   : matrice correspondant à la base de donnée lors du chargement serveur
     * @returns les données de l'état initial
     */
    getInitialState: function () {
        /* Création de la matrice qui associe      */
        /* pour chaque module ses droits           */
        /* A chaque clic sur un radio bouton       */
        /* on va venir mettre à jour cette matrice */
        var aoMatrice = {};

        return {
            matriceIniModuleDroit : aoMatrice,
            matriceModuleDroit    : aoMatrice,
            etatPageProfil        : 'profils',
            dataProfil            : [],
            dataModule            : []
        };
    },

    /**
     * Avant le premier Render()
     */
    componentWillMount: function () {
        /* On abonne ReactPageProfil aux stores :     */
        /*     - pageProfilStore, déclenché par :     */
        /*                           - profil_create  */
        /*                           - profil_edit    */
        /*                           - profil_suppr   */
        /*                           - profil_retour  */
        /*                           - profil_save    */
        /*                  , ecoute les stores :     */
        /*                           - profilStore    */
        /*                           - moduleStore    */
        this.listenTo(pageProfilStore, this.retourPageProfilStore, this.retourPageProfilStore);
    },

    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        return GetComponentSwitchState(this.state.etatPageProfil);
    },

    /**
     * Retour du store "pageProfilStore"
     * @param data
     */
    retourPageProfilStore: function(data) {
        var newState = {};

        /* Modification de la matrice */
        if('radioChange' in data){
            newState['isMatriceModuleModif'] = true;
            newState['matriceModuleDroit']   = this.state.matriceModuleDroit;
            newState.matriceModuleDroit[data.radioChange[0]] = data.radioChange[1];
        }
        /* Mise à jour du tableau des profils */
        else if('dataProfil' in data){
            newState['dataProfil'] = data.dataProfil;
        }
        /* Mise à jour du tableau des modules */
        else if('dataModule' in data){
            newState['dataModule'] = data.dataModule;
        }
        else if('libelleChange' in data){
            newState['isNameProfilModif'] = true;
        }

        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    }
});
/************************************************************************************************/
/*                                                                                              */
/*                           FIN : COMPOSANT REACT PAGE PROFIL                                  */
/*                                                                                              */
/************************************************************************************************/


/**********************************************************************************************/
/*                                                                                            */
/*                                       FONCTIONS SPECIFIQUES                                */
/*                                                                                            */
/**********************************************************************************************/
function GetComponentSwitchState(etatPageProfil){

    var titrePage = Lang.get('global.profils');

    switch(etatPageProfil){

        /* On arrive sur la page "Profils" */
        /* On affiche :                    */
        /*    - le bandeau (Créer)         */
        /*    - le tableau des profils     */
        case 'profils':
            return  <div id="containerPageProfil">
                <Row>
                    <Bandeau titre={titrePage} />
                </Row>
                <Row>
                    <DataTableBandeauProfil head={headP} hide={hideP} donnees={donnees} evts={evtsP} />
                </Row>
            </div>
            break;

        /* On a sélectionné un profil                      */
        /* On affiche :                                    */
        /*    - le bandeau (Retour/Créer/Editer/Supprimer) */
        /*    - le nom du profil NON éditable              */
        /*    - le tableau des modules NON éditable        */
        case 'module/visu':
            titrePage += 'Nom du profil sélectionné';
            var NomProfil = Lang.get('global.profils') + ' ' + 'Nom du profil sélectionné';

            return  <div id="containerPageProfil">
                <Row>
                    <Bandeau titre={titrePage} />
                </Row>
                <Row>
                    <p>{NomProfil}</p>
                </Row>
                <Row>
                    <DataTableBandeauModule head={headMP} hide={hideMP} id="tab_module_profil" bUnderline={false} reactElements={aReactElements} />
                </Row>
            </div>
            break;

        /* On édite un profil                   */
        /* On affiche :                         */
        /*    - le bandeau                      */
        /*    - le nom du profil EDITABLE       */
        /*    - le tableau des modules EDITABLE */
        case 'module/edition':

            break;

        /* On créer un profil                   */
        /* On affiche :                         */
        /*    - le bandeau                      */
        /*    - le nom du profil EDITABLE       */
        /*    - le tableau des modules EDITABLE */
        case 'module/création':
            titrePage += Lang.get('global.creation');

            break;
        default:
            return <div>Erreur dans le render de react_page_profil.js</div>
            break;
    }
}
/**********************************************************************************************/
/*                                                                                            */
/*                                  FIN : FONCTIONS SPECIFIQUES                               */
/*                                                                                            */
/**********************************************************************************************/


/**************************************************************************************************************/
/*                                                                                                            */
/*                                        STORES                                                              */
/*                                                                                                            */
/**************************************************************************************************************/

/************************************************************************/
/*                          PAGEPROFILSTORE                             */
/*              Store associé à la page profil                          */
/************************************************************************/
var pageProfilStore = Reflux.createStore({
    isMatriceModuleModif:   false,
    isNameProfilModif:      false,
    matriceIniModuleDroit : {},
    matriceModuleDroit:     {},

    // Initial setup
    init: function() {

        this.listenTo(Actions.bandeau.creer,         this.createProfil);  /* Action */
        this.listenTo(Actions.bandeau.editer,        this.editProfil);    /* Action */
        this.listenTo(Actions.bandeau.supprimer,     this.supprProfil);   /* Action */
        this.listenTo(Actions.bandeau.retour,        this.retourProfil);  /* Action */
        this.listenTo(Actions.bandeau.sauvegarder,   this.saveProfil);    /* Action */
        this.listenTo(Actions.profil.radio_change,   this.radioChange);   /* Action */
        this.listenTo(Actions.profil.libelle_change, this.libelleChange); /* Action */
        this.listenTo(profilStore, this.updateProfil); /* Store  */
        this.listenTo(moduleStore, this.updateModule); /* Store  */
    },

    createProfil: function(){

    },

    editProfil: function(){

    },

    supprProfil: function(){

    },

    retourProfil: function(){

    },

    saveProfil: function(){

    },

    updateProfil: function(dataProfil){
        this.trigger({dataProfil:dataProfil});
    },

    updateModule: function(dataModule){
        this.trigger({dataModule:dataModule});
    },

    radioChange: function(evt){
        Etat      = $(evt.currentTarget).data('etat');     /* 'visu', 'modif' ou 'aucun' */
        idModule  = $(evt.currentTarget).data('idModule'); /* id du module concerné      */

        this.isMatriceModuleModif = true;
    },

    libelleChange: function(){
        this.isNameProfilModif = true;
    }
});

/*********************************************************************/
/*                              PROFILSTORE                          */
/*              Store associé au tableau des profils                 */
/*********************************************************************/
var profilStore = Reflux.createStore({

    // Initial setup
    init: function() {
        // Register statusUpdate action
        this.listenTo(Actions.profil.profil_update, this.updateProfil);
    },

    /* Charge les données à chaque évènement "profil_update" */
    updateProfil: function() {
        // AJAX
        $.ajax({
            url: BASE_URI+'profils/all', /* correspond au module url de la BDD */
            dataType: 'json',
            context: this,
            success: function(data) {
                /* Passe "data" en paramètre au(x) composant(s) qui écoutent le store profilStore */
                this.trigger(data);
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
                this.trigger({});
            }
        });
    },

    /* Charge les données tout seul au début */
    getInitialState:function(){
        var dataRetour = [];
        // AJAX
        $.ajax({
            url: BASE_URI+'profils/all', /* correspond au module url de la BDD */
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
        /* Passe "dataRetour" en paramètre au(x) composant(s) qui écoutent le store profilStore */
        return dataRetour;
    }
});

/****************************************************************/
/*                          MODULESTORE                         */
/*          Store associé au tableau des modules                */
/****************************************************************/
var moduleStore = Reflux.createStore({

    // Initial setup
    init: function() {
        /* Charge les données du tableau module à chaque évènement "profil_select" */
        this.listenTo(Actions.profil.profil_select, this.updateModule);
    },

    /* Met à jour le tableau des modules */
    updateModule: function(evt) {
        var idProfil = 0;

        /* On a un profil de sélectionné, affichage complet du tableau */
        if($(evt.currentTarget).hasClass('row_selected'))
            idProfil = $(evt.currentTarget).data('id');
        console.log('idProfil : '+idProfil);
        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/' + idProfil + '/modules', /* correspond au module url de la BDD */
            dataType: 'json',
            context: this,
            success: function (data) {
                /* Passe "data" en paramètre au(x) composant(s) qui écoutent le store moduleStore */
                this.trigger(data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                /* Passe "[]" en paramètre au(x) composant(s) qui écoutent le store profilStore */
                this.trigger([]);
            }
        });
    },

    /* Charge les données tout seul au début */
    getInitialState:function(){
        var dataRetour = [];
        // AJAX
        $.ajax({
            url: BASE_URI+'profils/0/module', /* correspond au module url de la BDD */
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
        /* Passe "dataRetour" en paramètre au(x) composant(s) qui écoutent le store moduleStore */
        return dataRetour;
    }
});
/**************************************************************************************************************/
/*                                                                                                            */
/*                                            FIN : STORES                                                    */
/*                                                                                                            */
/**************************************************************************************************************/
