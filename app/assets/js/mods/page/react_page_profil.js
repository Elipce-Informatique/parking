/**
 * Created by Pierre on 16/12/2014.
 */

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

/********************************************/
/* Gestion de la modification et des droits */
var AuthentMixins = require('../mixins/component_access'); /* Pour le listenTo           */
var MixinGestMod  = require('../mixins/gestion_modif');    /* Pour la gestion des modifs */

/***************************/
/* Composant react Bandeau */
var BandeauVisu    = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var BandeauListe   = require('../composants/bandeau/react_bandeau_liste');

/*********************************************/
/* Composant react_data_table_bandeau_profil */

var DataTableBandeauProfil = require('../react_data_table_bandeau_profil');

/* Paramètres du composant react_data_table_bandeau_profil      */
/* Entête(s) du tableau : "Profils"                             */
/* Champ(s) caché(s)    : "id"                                  */
/* Sur clic d'une ligne, déclenche l'action "handleClickProfil" */
var headP = [Lang.get('global.profils')];
var hideP = ['id'];
var evtsP = {'onClick':handleClickProfil};

/* Fonction handleClickProfil                                   */
/* On passe par un handle pour faire la copie de l'objet cliqué */
function handleClickProfil(evt){
    var copie = _.clone(evt);
    Actions.profil.profil_select(copie);
}
/*       FIN : Composant react_data_table_bandeau_profil        */
/****************************************************************/

/****************************************************************/
/*          Composant react_data_table_bandeau_module           */

var DataTableModule = require('../react_data_table_module').composant;

/* Paramètres du composant react_data_table_module_profil            */
/* Entête(s) du tableau : "Module, Droits                            */
/* Champ(s) caché(s)    : "idModule"                                 */
var headMP = [Lang.get('administration.profil.module'), Lang.get('global.droits')];
var hideMP = ['id'];

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

    /* Ce composant gère les droits d'accès et les modifications */
    mixins: [Reflux.ListenerMixin,AuthentMixins,MixinGestMod],

    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {

        return {
            titrePageIni:    Lang.get('global.profils'), /* Titre initial : Profils               */
            nameProfil :    '',                         /* Pas de profil de sélectionné          */
            idProfil:       0,                          /* Id NULL au début                      */
            etatPageProfil: 'liste'                     /*  Affichage initial, liste des profils */
        };
    },

    /**
     * Avant le premier Render()
     */
    componentWillMount: function () {
        /* On abonne ReactPageProfil au store "pageProfilStore" : */
        /*     - pageProfilStore, déclenché par :                 */
        /*                           - profil_create              */
        /*                           - profil_edit                */
        /*                           - profil_suppr               */
        /*                           - profil_retour              */
        /*                           - profil_save                */
        this.listenTo(pageProfilStore, this.updateState, this.updateState);
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
        return this.getComponentSwitchState();
    },

    /**
     * Retour du store "pageProfilStore", met à jour le state de la page
     * @param data
     */
    updateState: function(data) {
        console.log('MAJ-- du state du composant : "ReactPageProfil" --MAJ');
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    getComponentSwitchState: function(){

        var mode = 1;

        /* Selon l'état de la page */
        switch(this.state.etatPageProfil){

            /* On a sélectionné un profil                      */
            /* On affiche :                                    */
            /*    - le bandeau (Retour/Créer/Editer/Supprimer) */
            /*    - le nom du profil NON éditable              */
            /*    - le tableau des modules NON éditable        */
            case 'visu':
                console.log('VISU');
                return <div key={this.state.etatPageProfil}>
                            <Row>
                                <BandeauVisu titre={this.state.titrePageIni+'/'+this.state.nameProfil} />
                            </Row>
                            <Row>
                                <DataTableModule head={headMP} hide={hideMP} idProfil={this.state.idProfil} nameProfil={this.state.nameProfil} editable={false} id="tab_module" bUnderline={false} reactElements={aReactElements} />
                            </Row>
                        </div>;
                break;

            /* On édite/créer un profil             */
            /* On affiche :                         */
            /*    - le bandeau                      */
            /*    - le nom du profil EDITABLE       */
            /*    - le tableau des modules EDITABLE */
            case 'create':
                console.log('CREATE');
                mode = 0;
            case 'edit':
                console.log('EDIT');
                return  <div key={this.state.etatPageProfil}>
                            <Row>
                                <BandeauEdition mode={mode} titre={this.state.titrePageIni+'/'+this.state.nameProfil} />
                            </Row>
                            <Row>
                                <DataTableModule head={headMP} hide={hideMP} editable={true} idProfil={this.state.idProfil} nameProfil={this.state.nameProfil}  id="tab_module" bUnderline={false} reactElements={aReactElements} />
                            </Row>
                        </div>;
                break;

            /* On arrive sur la page "Profils" */
            /* On affiche :                    */
            /*    - le bandeau (Créer)         */
            /*    - le tableau des profils     */
            case 'liste':
                console.log('LISTE');
            default:
                console.log('getComponentSwitchState --> Profils');
                return  <div  key={this.state.etatPageProfil}>
                            <BandeauListe titre={this.state.titrePageIni} />
                            <Row>
                                <Col md={12}>
                                    <DataTableBandeauProfil id="tableProfils" head={headP} hide={hideP} evts={evtsP} />
                                </Col>
                            </Row>
                        </div>;
                break;
        }
    },

    onRetour: function(){
        this.setState({etatPageProfil:'liste', titrePage:Lang.get('global.profils'), idProfil:0, nameProfil:''});
    }
});
module.exports = ReactPageProfil;
/************************************************************************************************/
/*                                                                                              */
/*                           FIN : COMPOSANT REACT PAGE PROFIL                                  */
/*                                                                                              */
/************************************************************************************************/


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
    idProfilSelect:0,
    nameProfil:'',
    isNameProfilModif:false,
    matriceBtnRadio: {},
    isMatriceModuleModif:false,

    // Initial setup
    init: function() {
        this.listenTo(Actions.profil.profil_select, this.profilSelect);
        this.listenTo(Actions.profil.initMatrice,   this.initMatrice);
        this.listenTo(Actions.bandeau.creer,        this.createProfil);
        this.listenTo(Actions.bandeau.editer,       this.editProfil);
        this.listenTo(Actions.bandeau.supprimer,    this.supprProfil);
        this.listenTo(Actions.bandeau.sauvegarder,  this.saveProfil);
    },

    getInitialState:function(){
        return {etatPageProfil:'liste'};
    },

    initMatrice: function(data){
        var indice = 0;

        _.each(data, function(val, key){
            this.matriceBtnRadio[data[indice]['id']] = data[indice]['etat'];
            indice++;
        }, this);
    },

    profilSelect: function(evt){
        /* On a un profil de sélectionné */
        if($(evt.currentTarget).hasClass('row_selected')) {
            this.idProfilSelect = $(evt.currentTarget).data('id');
        }

        if(this.idProfilSelect == 0)
             this.nameProfil = '';
        else {

            var that = this;

            // AJAX
            $.ajax({
                url: BASE_URI + 'profils/' + this.idProfilSelect, /* correspond au module url de la BDD */
                dataType: 'json',
                context: that,
                async: false,
                success: function (data) {
                    that.nameProfil = data.traduction;
                    that.trigger({idProfil:that.idProfilSelect, etatPageProfil:'visu', nameProfil:that.nameProfil});
                },
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
    },

    createProfil: function(){
        return {etatPageProfil:'create', nameProfil:Lang.get('global.create'), idProfil:0};
    },

    editProfil: function(){
        this.trigger({etatPageProfil:'edit'});
    },

    supprProfil: function(){
        console.log('--> Suppression du profil id \''+this.idProfilSelect+'\' à faire <--');
    },

    saveProfil: function(){
        console.log('--> Sauvegarde du profil id \''+this.idProfilSelect+'\' à faire <--');
    },

    radioChange: function(){

        /* Récupère les données du radio bouton */
        Etat      = $(evt.currentTarget).data('etat');     /* 'visu', 'modif' ou 'aucun' */
        idModule  = $(evt.currentTarget).data('idModule'); /* id du module concerné      */

        /* Mise a jour de la matrice */
        this.matriceBtnRadio[idModule] = Etat;

        /* Mise à jour du flag pour sauvegarder les modifications sur l'etat des modules */
        this.isMatriceModuleModif = true;
    },

    /**
     * Modification du libelle du profil
     */
    libelleChange: function() {
        this.isNameProfilModif = true;
    }
});
/**************************************************************************************************************/
/*                                                                                                            */
/*                                            FIN : STORES                                                    */
/*                                                                                                            */
/**************************************************************************************************************/
