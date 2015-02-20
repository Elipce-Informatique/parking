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
var BandeauGenerique = require('../composants/bandeau/react_bandeau_generique');

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
var aName    = new Array('visu', 'modif', 'null');
var aReactElements  = {};
aReactElements['1'] = new Array();                           /* Colonne n°1 du tableau               */
aReactElements['1'][0] = 'RadioBts';                         /* Type de composant à ajouter          */
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
     * Les props par défaut
     */
    getDefaultProps: function() {

        return {
            module_url: 'profils'
        };
    },

    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {

        return {
            titrePageIni:    Lang.get('global.profils'), /* Titre initial : Profils               */
            nameProfil :    '',                          /* Pas de profil de sélectionné          */
            idProfil:       0,                           /* Id NULL au début                      */
            etatPageProfil: 'liste'                      /*  Affichage initial, liste des profils */
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
                return <Col md={12} key="rootPageProfil">
                            <Row>
                                <Col md={12}>
                                <BandeauGenerique bandeauType={this.state.etatPageProfil} module_url="profils" titre={this.state.titrePageIni} sousTitre={this.state.nameProfil} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <DataTableModule head={headMP} hide={hideMP} idProfil={this.state.idProfil} nameProfil={this.state.nameProfil} editable={false} id="tab_module" bUnderline={false} reactElements={aReactElements} />
                                </Col>
                            </Row>
                        </Col>;
                break;

            /* On édite/créer un profil             */
            /* On affiche :                         */
            /*    - le bandeau                      */
            /*    - le nom du profil EDITABLE       */
            /*    - le tableau des modules EDITABLE */
            case 'creation':
                mode = 0;
            case 'edition':
                return  <Col md={12} key="rootPageProfil">
                            <Row>
                                <Col md={12}>
                                <BandeauGenerique bandeauType={this.state.etatPageProfil} module_url="profils" mode={mode} titre={this.state.titrePageIni} sousTitre={this.state.nameProfil} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <DataTableModule head={headMP} hide={hideMP} editable={true} idProfil={this.state.idProfil} nameProfil={this.state.nameProfil}  id="tab_module" bUnderline={false} reactElements={aReactElements} />
                                </Col>
                            </Row>
                        </Col>;
                break;

            /* On arrive sur la page "Profils" */
            /* On affiche :                    */
            /*    - le bandeau (Créer)         */
            /*    - le tableau des profils     */
            case 'liste':
            default:
                return <Col md={12}  key="rootPageProfil">
                    <Row>
                        <Col md={12}>
                            <BandeauGenerique bandeauType={this.state.etatPageProfil} module_url="profils" titre={this.state.titrePageIni} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <DataTableBandeauProfil id="tableProfils" head={headP} hide={hideP} evts={evtsP} />
                        </Col>
                    </Row>
                </Col>;
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
        this.listenTo(Actions.validation.submit_form, this.saveProfil);
        this.listenTo(Actions.profil.radio_change,  this.radioChange);
    },

    getInitialState:function(){
        return {etatPageProfil:'liste'};
    },

    initMatrice: function(data){
        var indice = 0;
        var etat   = '';
        this.matriceBtnRadio = {};

        _.each(data, function(val, key){
            etat =  data[indice]['access_level'];

            if(etat != 'visu' && etat != 'modif')
                etat = 'null';

            this.matriceBtnRadio[data[indice]['id']] = etat;
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
        this.idProfilSelect = 0;
        this.trigger({etatPageProfil:'creation', nameProfil:'', idProfil:0});
    },

    editProfil: function(){
        this.trigger({etatPageProfil:'edition'});
    },

    supprProfil: function(){
        if(this.idProfilSelect == 0)
            this.nameProfil = '';
        else {

            /* Vérification que le profil n'est pas associé à un utilisateur */
            var suppr = this.getIsProfilUse(this.idProfilSelect);

            /* Un utilisateur est associé au profil, demande de confirmation de suppression */
            if(suppr == true){
                setTimeout(function () {
                    swal({
                            title: Lang.get('global.attention'),
                            text: Lang.get('administration.profil.supprProfilAlert'),
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: Lang.get('global.oui'),
                            cancelButtonText: Lang.get('global.annuler'),
                            closeOnConfirm: true
                        },
                        function (isConfirm) {
                            if (isConfirm)
                                this.supprProfilAjax();
                        }.bind(this));
                }.bind(this), 100);
            }
            /* Pas d'utilisateur associé au profil, on peut supprimer */
            else {
                this.supprProfilAjax();
            }
        }
    },

    supprProfilAjax: function(){
        var that = this;

        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/' + that.idProfilSelect, /* correspond au module url de la BDD */
            dataType: 'json',
            context: that,
            type: 'DELETE',
            data: {'_token': $('#_token').val()},
            success: function (data) {
                that.idProfilSelect = 0;
                that.trigger({idProfil: 0, etatPageProfil: 'liste', nameProfil: ''});

                Actions.notif.success(Lang.get('global.notif_success'));
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());

                Actions.notif.error('AJAX : ' + Lang.get('global.notif_erreur'));
            }
        }, that);
    },

    getIsProfilUse: function(idProfil){
        var that = this;
        var retour = false;

        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/use/' + that.idProfilSelect, /* correspond au module url de la BDD */
            dataType: 'json',
            context: that,
            async: false,
            success: function (good) {
                retour = good.good;
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });

        return retour;
    },

    saveProfil: function(){
        // Variables
        var url = BASE_URI+'profils/'+(this.idProfilSelect===0?'':this.idProfilSelect);

        var method = this.idProfilSelect===0?'POST':'PUT';

        var matrice = [];
        var that    = this;
        var indice  = 0;
        _.each(this.matriceBtnRadio, function($key, $value){
            matrice.push([$key, $value]);
        }, that);

        var data = $('form').serializeArray();
        data.push({name:'_token',  value:$('#_token').val()});
        data.push({name:'matrice', value:matrice});

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: data,
            success: function(tab) {
                // TODO NOTIFICATION
                //Notif tab['save']
                if(tab.save == true) {
                    that.idProfilSelect = tab.idProfil;

                    // Passe variable aux composants qui écoutent l'action actionLoadData
                    this.trigger({idProfil: (tab.idProfil*1), etatPageProfil: 'edition', nameProfil: tab.nameProfil});

                    Actions.notif.success(Lang.get('global.notif_success'));
                }
                else
                    Actions.notif.error(Lang.get('global.notif_erreur'));
            },
            error: function(xhr, status, err) {
                console.error( status, err.toString());
                Actions.notif.error('AJAX : '+Lang.get('global.notif_erreur'));
            }
        }, that);
    },

    radioChange: function(evt){
        console.log('radioChange');

        /* Récupère les données du radio bouton */
        Etat      = $(evt.currentTarget).data('etat');     /* 'visu', 'modif' ou 'aucun' */
        idModule  = $(evt.currentTarget).data('id'); /* id du module concerné      */

        if(Etat != 'visu' && Etat != 'modif')
            Etat = 'null';

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
