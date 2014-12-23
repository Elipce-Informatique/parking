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

/*********************************************/
/* Composant input pour le libelle du profil */
var Field = require('../composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;


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

var DataTableBandeauModule = require('../react_data_table_bandeau_module').composant;
var moduleStore            = require('../react_data_table_bandeau_module').Store;

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
            titrePage  : Lang.get('global.profils'), /* Titre initial : Profils               */
            profilName : '',                         /* Pas de profil de sélectionné          */
            etatPageProfil:'liste'                   /*  Affichage initial, liste des profils */
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
                return <div key={this.state.etatPageProfil}>
                            <Row>
                                <BandeauVisu titre={this.state.titrePage} />
                            </Row>
                            <Row>
                                <p>{Lang.get('global.profils')+' '+this.state.profilName}</p>
                            </Row>
                            <Row>
                                <DataTableBandeauModule head={headMP} hide={hideMP} id="tab_module" data={this.state.dataModule} bUnderline={false} reactElements={aReactElements} />
                            </Row>
                        </div>;
                break;

            /* On édite/créer un profil             */
            /* On affiche :                         */
            /*    - le bandeau                      */
            /*    - le nom du profil EDITABLE       */
            /*    - le tableau des modules EDITABLE */
            case 'création':
                mode = 0;
                this.state.profilName = '';
            case 'edition':
                return  <div key={this.state.etatPageProfil}>
                            <Row>
                                <BandeauEdition mode={mode} titre={this.state.titrePage} />
                            </Row>
                            <Row>
                                <p>{Lang.get('global.profils')+' '+this.state.profilName}</p>
                            </Row>
                            <Row>
                                <DataTableBandeauModule head={headMP} hide={hideMP} id="tab_module" data={this.state.dataModule} bUnderline={false} reactElements={aReactElements} />
                            </Row>
                        </div>;
                break;

            /* On arrive sur la page "Profils" */
            /* On affiche :                    */
            /*    - le bandeau (Créer)         */
            /*    - le tableau des profils     */
            case 'liste':
            default:
                console.log('getComponentSwitchState --> Profils');
                return  <div  key={this.state.etatPageProfil}>
                            <BandeauListe titre={this.state.titrePage} />
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
        this.setState({etatPageProfil:'liste'});
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

    // Initial setup
    init: function() {
        this.listenTo(moduleStore, this.updateModule);
    },

    getInitialState:function(){
        return {etatPageProfil:'liste'};
    },

    getInitialDataProfil: function(data){
        this.trigger({etatPageProfil:data.etatPageProfil});
    }
});
/**************************************************************************************************************/
/*                                                                                                            */
/*                                            FIN : STORES                                                    */
/*                                                                                                            */
/**************************************************************************************************************/
