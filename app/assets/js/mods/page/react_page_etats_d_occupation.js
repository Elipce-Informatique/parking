/**
 * Created by Pierre on 21/01/2015.
 */

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

/********************************************/
/* Gestion de la modification et des droits */
var AuthentMixins = require('../mixins/component_access'); /* Pour le listenTo           */
var MixinGestMod  = require('../mixins/gestion_modif');    /* Pour la gestion des modifs */

/*****************************************************************/
/* Pour récupérer les datas du formulaire avant l'envoie en Ajax */
var form_data_helper  = require('../helpers/form_data_helper');

/***************************/
/* Composant react Bandeau */
var BandeauVisu      = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition   = require('../composants/bandeau/react_bandeau_edition');
var BandeauListe     = require('../composants/bandeau/react_bandeau_liste');
var BandeauGenerique = require('../composants/bandeau/react_bandeau_generique');

/************************************************************************************************/
/*                                                                                              */
/*                         COMPOSANT REACT PAGE : "Etats d'occupation                           */
/*                                                                                              */
/************************************************************************************************/
var ReactPageEtatsDoccupation  = React.createClass({

    /* Ce composant gère les droits d'accès et les modifications */
    mixins: [Reflux.ListenerMixin,AuthentMixins,MixinGestMod],

    /**
     * Les props par défaut
     */
    getDefaultProps: function() {

        return {
            module_url: 'etats_d_occupation'
        };
    },

    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {

        return {
            titrePageIni: Lang.get('menu.side.etats_d_occupation'), /* Titre initial : Etats d'occupation              */
            etatPage:     'liste',                                  /* Affichage initial, liste des etats d'occupation */
            name: '',                                               /* Nom de l'état d'occupation sélectionné          */
            id:0
        };
    },

    /**
     * Avant le premier Render()
     */
    componentWillMount: function () {
        /* On abonne ReactPageEtatsDoccupation au store "pageEtatsDoccupationStore" : */
        this.listenTo(pageEtatsDoccupationStore, this.updateState, this.updateState);
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
     * Retour du store "pageEtatsDoccupationStore", met à jour le state de la page
     * @param data
     */
    updateState: function(data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    getComponentSwitchState: function(){

        var mode = 1;

        var attrBandeau = {bandeauType:this.state.etatPage,
                           module_url:this.props.module_url,
                           titre:this.state.titrePageIni,
                           sousTitre:this.state.name};

        /* Selon l'état de la page */
        switch(this.state.etatPage){

            /* On a sélectionné un etat d'occupation           */
            /* On affiche :                                    */
            /*    - le bandeau (Retour/Créer/Editer/Supprimer) */
            /*    - les infos non éditable                     */
            case 'visu':
                return <div key="rootPageEtatsDoccupation">
                    <Row>
                        <BandeauGenerique {...attrBandeau} />
                    </Row>
                    <Row>
                        <Col md={12}>
                            !!! Mode visu à faire !!!
                        </Col>
                    </Row>
                </div>;
                break;

            /* On édite/créer un états d'occupation */
            /* On affiche :                         */
            /*    - le bandeau                      */
            /*    - les infos éditable              */
            case 'creation':
                mode = 0;
            case 'edition':
                attrBandeau = _.omit(attrBandeau, 'sousTitre');
                return  <div key="rootPageEtatsDoccupation">
                    <Row>
                        <BandeauGenerique {...attrBandeau} mode={mode} />
                    </Row>
                    <Row>
                        <Col md={12}>
                            !!! Mode création ou édition à faire !!!
                        </Col>
                    </Row>
                </div>;
                break;

            /* On arrive sur la page "Etats d'occupation" */
            /* On affiche :                               */
            /*    - le bandeau (Créer)                    */
            /*    - le tableau des etats d'occupation     */
            case 'liste':
            default:
                return  <div  key="rootPageEtatsDoccupation">
                    <BandeauGenerique {...attrBandeau} />
                    <Row>
                        <Col md={12}>
                            !!! Liste des états d'occupation !!!
                        </Col>
                    </Row>
                </div>;
                break;
        }
    },

    onRetour: function(){
        this.setState({etatPage:'liste', titrePage:Lang.get('menu.side.etats_d_occupation'), name:''});
    }
});
module.exports = ReactPageEtatsDoccupation;
/************************************************************************************************/
/*                                                                                              */
/*                           FIN : COMPOSANT REACT PAGE PROFIL                                  */
/*                                                                                              */
/************************************************************************************************/


/************************************************************************/
/*                Store de la page états d'occupation                   */
/*              Store associé à la page états d'occupation              */
/************************************************************************/
var pageEtatsDoccupationStore = Reflux.createStore({
    name:'',
    idSelect:0,

    // Initial setup
    init: function() {
        this.listenTo(Actions.etats_d_occupation.select, this.select);
        this.listenTo(Actions.bandeau.creer,             this.create);
        this.listenTo(Actions.bandeau.editer,            this.editn);
        this.listenTo(Actions.bandeau.supprimer,         this.suppr);
        this.listenTo(Actions.validation.submit_form,    this.save);
    },

    getInitialState:function(){
        return {etatPage:'liste'};
    },

    select: function(evt){
        /* On a un état d'occupation de sélectionné */
        if($(evt.currentTarget).hasClass('row_selected')) {
            this.idSelect = $(evt.currentTarget).data('id');
        }

        if(this.idSelect == 0)
            this.nameEtatDoccupation = '';
        else {

            var that = this;

            // AJAX
            $.ajax({
                url: BASE_URI + 'etats_d_occupation/' + this.idSelect, /* correspond au module url de la BDD */
                dataType: 'json',
                context: that,
                async: false,
                success: function (data) {
                    that.nameEtatDoccupation = data.libelle;
                    that.trigger({id:that.idSelect, etatPage:'visu', name:that.name});
                },
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
    },

    create: function(){
        this.idEtatDoccupationSelect = 0;
        this.trigger({etatPage:'creation', name:'', id:0});
    },

    edit: function(){
        this.trigger({etatPage:'edition'});
    },

    suppr: function(){
        var that = this;

        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/' + that.idSelect, /* correspond au module url de la BDD */
            dataType: 'json',
            context: that,
            type: 'DELETE',
            data: {'_token': $('#_token').val()},
            success: function (data) {
                that.idSelect = 0;
                that.trigger({id: 0, etatPage: 'liste', name: ''});

                Actions.notif.success(Lang.get('global.notif_success'));
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());

                Actions.notif.error('AJAX : ' + Lang.get('global.notif_erreur'));
            }
        }, that);
    },

    save: function(){
        // Variables
        var url = BASE_URI+'profils/'+(this.idSelect===0?'':this.idSelect);

        var method = this.idSelect===0?'POST':'PUT';

        var fData = form_data_helper('form_etat_d_occupation', method);

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: fData,
            success: function(tab) {
                // TODO NOTIFICATION
                //Notif tab['save']
                if(tab.save == true) {
                    that.idSelect = tab.id;

                    // Passe variable aux composants qui écoutent l'action actionLoadData
                    this.trigger({id: (tab.id*1), etatPage: 'edition', name: tab.name});

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
    }
});