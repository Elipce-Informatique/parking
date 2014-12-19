/**
 * Created by Pierre on 16/12/2014.
 */

var Row = ReactB.Row;
var Col = ReactB.Col;

var AuthentMixins = require('../mixins/component_access'); /* Pour le listenTo           */
var MixinGestMod  = require('../mixins/gestion_modif');    /* Pour la gestion des modifs */

/* Composant input pour le libelle du profil */
var InputTextEditable = Field.InputTextEditable;

/* Composant react Bandeau */
var BandeauVisu    = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var BandeauListe   = require('../composants/bandeau/react_bandeau_liste');

/****************************************************************/
/*          Composant react_data_table_bandeau_profil           */

var DataTableBandeauProfil = require('../react_data_table_bandeau_profil');

/* Paramètres du composant react_data_table_bandeau_profil      */
/* Entête(s) du tableau : "Profils"                             */
/* Champ(s) caché(s)    : "id"                                  */
/* Sur clic d'une ligne, déclenche l'action "handleClickProfil" */
var headP = [Lang.get('global.profils')];
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

var DataTableBandeauModule = require('../react_data_table_bandeau_module');

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

    mixins: [Reflux.ListenerMixin,AuthentMixins,MixinGestMod],

    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {

        return {
            titrePage  : Lang.get('global.profils'),
            profilName : '',
            etatPageProfil:'liste'
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
        return this.getComponentSwitchState();
    },

    /**
     * Retour du store "pageProfilStore", met à jour le state de la page
     * @param data
     */
    retourPageProfilStore: function(data) {
        console.log('MAJ-- du state du composant : "ReactPageProfil" --MAJ');
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    getComponentSwitchState: function(){

        switch(this.state.etatPageProfil){

            /* On a sélectionné un profil                      */
            /* On affiche :                                    */
            /*    - le bandeau (Retour/Créer/Editer/Supprimer) */
            /*    - le nom du profil NON éditable              */
            /*    - le tableau des modules NON éditable        */
            case 'visu':
                console.log('getComponentSwitchState --> Visu');
                return
                break;

            /* On édite/créer un profil             */
            /* On affiche :                         */
            /*    - le bandeau                      */
            /*    - le nom du profil EDITABLE       */
            /*    - le tableau des modules EDITABLE */
            case 'edition':
                console.log('getComponentSwitchState --> Edition/Création');
                return <div key={this.state.etatPageProfil}>
                    <Row>
                        <BandeauEdition mode={1} titre={this.state.titrePage} />
                    </Row>
                    <Row>
                        <DataTableBandeauModule head={headMP} hide={hideMP} id="tab_module" data={this.state.dataModule} bUnderline={false} reactElements={aReactElements} />
                    </Row>
                </div>;
                break;
            case 'création':
                return  <div key={this.state.etatPageProfil}>
                            <Row>
                                <BandeauEdition mode={0} titre={this.state.titrePage} />
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
            success: function (dataFromBdd) {
                var data = {idProfil:idProfil, dataModule:dataFromBdd};
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
