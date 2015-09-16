/********************************************/
var React = require('react');
var TreeView = require('react-bootstrap-treeview/dist/js/react-bootstrap-treeview');
var Simulator = require('../simulator/react_simulator');
var supervision_helper = require('../helpers/supervision_helper');
var BootstrapMenu = require('bootstrap-menu');

// COMPOSANTS NÉCESSAIRES:
var Collapse = require('../composants/react_collapse').Collapse;
var CollapseBody = require('../composants/react_collapse').CollapseBody;
var CollapseSidebar = require('../composants/react_collapse').CollapseSidebar;
var ParkingMap = require('../composants/maps/supervision_parking_map');
var TestD3 = require('../charts/test_d3');
var ZoneTempsReel = require('../composants/react_supervision_temps_reel');
var TableauBord = require('../composants/react_supervision_tableau_bord').tab_bord;
var PanelLogos = require('../composants/react_supervision_tableau_bord').panel_logos;

var Col = ReactB.Col;
var Row = ReactB.Row;
var Jumbotron = ReactB.Jumbotron;
var PageHeader = ReactB.PageHeader;
var Glyphicon = ReactB.Glyphicon;

/* Gestion de la modification et des droits */
var AuthentMixins = require('../mixins/component_access');
/* Pour le listenTo           */
var MixinGestMod = require('../mixins/gestion_modif');
/* Pour la gestion des modifs */
// HELPERS
var pageState = require('../helpers/page_helper').pageState;
var mapHelper = require('../helpers/map_helper');


/************************************************************************************************/
/*                                                                                              */
/*                               COMPOSANT REACT PAGE                                           */
/*                                                                                              */
/************************************************************************************************/

var Page = React.createClass({
    mixins: [Reflux.ListenerMixin, AuthentMixins, MixinGestMod],

    propTypes: {},

    getDefaultProps: function () {
        return {
            module_url: 'visualisation'
        };
    },

    /**
     * État initial des données du composant
     */
    getInitialState: function () {
        return {
            etatPage: pageState.liste,
            treeView: [],
            planId: '',
            url: false,
            parkingId: '',
            temps_reel: {
                last_id: 0,
                last_alerte_id: 0,
                journal: [],
                alertes: []
            }
        };
    },

    componentWillMount: function () {
        // Listen page store
        this.listenTo(store, this.updateState, this.updateState);
    },

    componentDidUpdate: function (pp, ps) {

        //console.log('DidUpdate %o, %o', _.cloneDeep(ps.treeView), _.cloneDeep(this.state.treeView));
        // TreeView update
        //if (!_.isEqual(ps.treeView, this.state.treeView)) { // ATTENTION ne fonctionne pas les state sont identiques, laissez commenté
        var libs = {};
        //console.log('treeview modifié');
        // Parcours 1er étage du treeview
        this.state.treeView.forEach(function (item, index) {
            // Libellé des items
            libs = this.getLibelleFromEtatParking(item.etat);

            // Menu click droit
            new BootstrapMenu('[data-id=' + item.id + ']:not([data-parking-id])', {
                fetchElementData: function ($rowElem) {
                    //console.log('dans fetch : %o, %o',$('[data-id=' + item.id + ']:not([data-parking-id])').data('etat'), $rowElem.data('etat'));
                    return {
                        id: $rowElem.data('id'),
                        //etat: $rowElem.data('etat') // Les modifications du DOM par le state sont BIEN pas prises en compte. Ce pendant la fonction .data() renvoie la 1ere valeur du DOM
                        etat: parseInt($rowElem.attr('data-etat'))
                    };
                },
                actions: [{
                    name: libs.item1,
                    onClick: function (data) {
                        console.log('click item 1 ', data);
                        // Connexion websocket + ecoute parking state controller
                        supervision_helper.initParkingState(data.id);

                        // Envoi un message au controller en fonction de l'état actuel du parking
                        switch (data.etat) {
                            case 0: // Etat actuel ouvert
                            case 2: // etat actuel: veille
                                // TODO send message fermeture parking (ID parking= data.id)
                                if (window.modeDev) {
                                    // En attendant simulation d'une action, on attend que le listen soit fait
                                    window.setTimeout(function () {
                                        Actions.com.message_controller({
                                            messageType: "parking_state",
                                            data: {
                                                id: data.id,
                                                etat: '1'
                                            }
                                        });
                                    }, 2000);
                                }
                                // Mode production
                                else {
                                    this.swalNoCom();
                                }
                                break;
                            case 1: // etat actuel fermé
                                // TODO send message ouverture parking (ID parking= data.id)
                                if (window.modeDev) {
                                    window.setTimeout(function () {
                                        Actions.com.message_controller({
                                            messageType: "parking_state",
                                            data: {
                                                id: data.id,
                                                etat: '0'
                                            }
                                        });
                                    }, 2000);
                                }
                                // Mode production
                                else {
                                    this.swalNoCom();
                                }
                                break;
                            default:
                                console.log('etat default ' + data.etat);
                                break;
                        }
                    }.bind(this)
                }, {
                    name: libs.item2,
                    onClick: function (data) {
                        console.log('click item 2 ', data);
                        // Connexion websocket + ecoute parking state controller
                        supervision_helper.initParkingState(data.id);

                        switch (data.etat) {
                            case 0: // Etat actuel ouvert
                            case 1: // etat actuel: fermé
                                // TODO send message veille parking (ID parking= data.id)
                                if (window.modeDev) {
                                    window.setTimeout(function () {
                                        // En attendant simulation d'une action
                                        Actions.com.message_controller({
                                            messageType: "parking_state",
                                            data: {
                                                id: data.id,
                                                etat: '2'
                                            }
                                        });
                                    }, 2000);
                                }
                                // Mode production
                                else {
                                    this.swalNoCom();
                                }
                                break;
                            case 2: // etat actuel veille
                                // TODO send message ouverture parking (ID parking= data.id)
                                if (window.modeDev) {
                                    window.setTimeout(function () {
                                        Actions.com.message_controller({
                                            messageType: "parking_state",
                                            data: {
                                                id: data.id,
                                                etat: '0'
                                            }
                                        });
                                    }, 2000);
                                }
                                // Mode production
                                else {
                                    this.swalNoCom();
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }]
            });
        }, this);
        //}
    },

    swalNoCom: function () {
        swal({
            html: true,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: Lang.get('global.annuler'),
            title: Lang.get('supervision.commandes.placeholder'),
            text: '<div id="circularG"> <div id="circularG_1" class="circularG"></div><div id="circularG_2" class="circularG"></div><div id="circularG_3" class="circularG"></div><div id="circularG_4" class="circularG"></div><div id="circularG_5" class="circularG"></div><div id="circularG_6" class="circularG"></div><div id="circularG_7" class="circularG"></div><div id="circularG_8" class="circularG"></div></div>'
        });
    },

    /**
     * Retour du store, met à jour le state de la page
     * @param data : les nouvelles données venant du store
     */
    updateState: function (data) {
        // MAJ data automatique, lifecycle "UPDATE"
        //console.log('UPDATE STATE %o', _.cloneDeep(data));
        this.setState(data);
    },

    onRetour: function () {
        // Actions a effectuer sur click bouton retour
    },

    /**
     * Crée la page en mode carte
     * @returns {XML}
     */
    modeCarte: function () {

        // CRÉATION TREEVIEW
        var treeView = '';
        if (this.state.treeView.length) {
            var data = this.state.treeView;
            treeView = (<TreeView
                key="tree"
                data={data}
                levels={3}
                color="#555555"
                selectedColor="#222222"
                selectedBackColor='#eeeeee'
                onLineClicked={Actions.map.plan_selected}
                isSelectionExclusive={true}
                underlineLeafOnly={true}
                treeNodeAttributes={{
                    'data-id': 'id',
                    'data-is-plan': 'is-plan',
                    'data-plan-id': 'plan-id',
                    'data-parking-id': 'parking-id',
                    'data-url': 'url',
                    'data-logo': 'logo',
                    'data-etat': 'etat'
                }}
                nodeIcon= "glyphicon glyphicon-eye-close small"
                nodeIconSelected= "glyphicon glyphicon-eye-open small"
                enableLinks={false}
                expandIcon= "glyphicon glyphicon-folder-close small"
                collapseIcon= "glyphicon glyphicon-folder-open small"
                classText="small"
                showTags={true}/>);
        }

        // CRÉATION MAP
        var map = (
            <Jumbotron className="jumbo-selection" bsStyle='warning'>
                <h1>
                    <Glyphicon glyph='hand-up' /> {Lang.get('global.selection')}
                </h1>
                <p>{Lang.get('supervision.carte.selection_plan')}</p>
            </Jumbotron>
        );
        if (this.state.url) {

            map = <ParkingMap
                imgUrl={this.state.url}
                parkingId={this.state.parkingId}
                planId={this.state.planId}
                divId="div_carte"
                key={'map-' + this.state.planId}
            />
        }

        // Création panel temps réel right
        var zoneTr = (
            <ZoneTempsReel
                plan_id={parseInt(this.state.planId)}
                vertical={true}
                data={this.state.temps_reel}
                key={'ztr-' + this.state.planId}
            />);

        return (
            <Col md={12} className="full-height flex-wrapper">
                <Row id="row_reporting" className="flex-header" key={1}>
                    <Col id="zone_reporting" className="full-height" md={12}>
                        <TableauBord
                            parkingId={this.state.parkingId}
                            panelLogos={<PanelLogos
                                urlParking={DOC_URI + 'logo_parking/' + this.state.logo}
                            />}
                        />
                    </Col>
                </Row>

                <Row id="page_test" className="flex-body" key={2}>
                    <Col md={12} id="visualisation_parking" className="full-height" style={{position: 'absolute'}}>
                        <Collapse align="left" sideWidth={2}>
                            <CollapseBody>
                                <Collapse isCollapsed={true} align="right" sideWidth={3}>
                                    <CollapseBody>
                                        {map}
                                    </CollapseBody>
                                    <CollapseSidebar title="Journal">
                                    {zoneTr}
                                    </CollapseSidebar>
                                </Collapse>
                            </CollapseBody>
                            <CollapseSidebar title="Sélection">
                                {treeView}
                            </CollapseSidebar>
                        </Collapse>
                    </Col>
                </Row >
            </Col>
        );
    },

    /**
     * Change le libellé des items de menu clic droit en fonction de l'état du parking
     * @param etat: 0,1,2 champ parking.etat
     */
    getLibelleFromEtatParking: function (etat) {

        var retour = {};
        switch (etat) {
            case '0': // Ouvert
                retour = {
                    item1: Lang.get('supervision.commandes.fermeture_parking'),
                    item2: Lang.get('supervision.commandes.veille_parking')
                }
                break;
            case '1': // Fermé
                retour = {
                    item1: Lang.get('supervision.commandes.ouverture_parking'),
                    item2: Lang.get('supervision.commandes.veille_parking')
                }
                break;
            case '2': // Veille éco
                retour = {
                    item1: Lang.get('supervision.commandes.fermeture_parking'),
                    item2: Lang.get('supervision.commandes.eveil_parking')
                }
                break;
            default:
                break;
        }
        return retour;
    },

    render: function () {
        var retour = '';

        // Switch la structure de la page en fonction de l'état courant
        switch (this.state.etatPage) {
            case pageState.liste:
                retour = this.modeCarte();
                break;
            default:
                retour = <div>Hello World !</div>;
        }
        return retour;
    }
});

module.exports = Page;

/************************************************************************************************/
/*                                                                                              */
/*                               STORE REFLUX PAGE                                              */
/*                                                                                              */
/************************************************************************************************/
var store = Reflux.createStore({
    _inst: {
        treeView: [],
        planId: 0,
        url: '',
        parkingId: 0,
        logo: '',
        temps_reel: {
            last_id: 0,
            last_alerte_id: 0,
            journal: [],
            alertes: []
        }
    },
    getInitialState: function () {
        var retour = {};
        return retour;
    },
    // Initial setup
    init: function () {
        this.listenTo(Actions.map.plan_selected, this._plan_selected);

        this.listenTo(Actions.supervision.temps_reel_update_journal, this._update_temps_reel_journal);
        this.listenTo(Actions.supervision.temps_reel_update_alertes, this._update_temps_reel_alertes);
        this.listenTo(Actions.supervision.parking_state_update, this._parking_state_update);

        // Init du treeView
        mapHelper.initTreeviewParkingAjax(function (data) {
            var dataTableau = mapHelper.recursiveTreeViewParking(data, 0);
            //console.log('treeview: %o', dataTableau);
            this._inst.treeView = dataTableau;
            this.trigger({treeView: dataTableau});
        }, this);
    },

    /**
     * Quand un item du treeview est cliqué
     * @param evt :
     * @private
     */
    _plan_selected: function (evt) {
        var $elt = $(evt.currentTarget);

        // ON EST SUR UN ELT DE TYPE PLAN !
        if ($elt.data('is-plan')) {
            var data = $elt.data();

            supervision_helper.destroyTimerPlaces();
            supervision_helper._abortAjax();
            //Simulator.init(data.id);

            this._inst = _.extend(this._inst, {
                planId: data.id,
                url: DOC_URI + 'plans/' + data.url,
                parkingId: data.parkingId,
                logo: data.logo,
                temps_reel: {
                    last_id: 0,
                    journal: [],
                    alertes: []
                }
            });

            this.trigger(this._inst);

            // Init de toutes les données temps réel
            this._init_temps_reel(data.id);
            // Init données tableau de bord
            Actions.supervision.tableau_bord_update(this._inst.parkingId);

        } else {
            // Rien à faire dans ce cas
        }
    },

    /**
     * INITIALISATION DE TOUTES LES DONNÉES TEMPS REEL
     * Récupère le last ID en base
     * Clear les données présentes
     * Lance le rafraichissement des données
     * - de la map
     * - Du tableau de bord
     * - Du volet temps réel
     * @param planId
     * @private
     */
    _init_temps_reel: function (planId) {
        var journalId, journalAlerteId;
        var url = BASE_URI + 'parking/journal_equipement/last/' + planId;
        var $1 = $.ajax({
            type: 'GET',
            url: url,
            processData: false,
            contentType: false,
            context: this,
            global: false
        })
            .done(function (data) {
                // on success use return data here
                if (!isNaN(data)) {
                    this._inst.temps_reel.last_id = data;
                }
                // On envoi du bois
                this.trigger(this._inst);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });

        var $2 = $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/journal_alerte/last/' + this._inst.planId,
            processData: false,
            contentType: false,
            context: this,
            global: false
        })
            .done(function (data) {
                // on success use return data here
                if (!isNaN(data)) {
                    this._inst.temps_reel.last_alerte_id = data;
                }
                // On envoi du bois
                this.trigger(this._inst);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });

        // ATTENTE DES DEUX REQUÊTES POUR ENVOYER LE PATHÉ EN CROUTE
        $.when($1, $2).done(function () {
            //console.log('PASS FIN DES 2 REQUETES');
            supervision_helper.destroyTimerPlaces();
            supervision_helper.init(
                this._inst.planId,
                this._inst.temps_reel.last_id,
                this._inst.parkingId,
                this._inst.temps_reel.last_alerte_id,
                function OK(clientWs) {
                    console.log('Connecté');
                }.bind(this),
                function KO(err) {
                    console.error('ERREUR WS : %o', err);
                }.bind(this)
            );
        }.bind(this));
    },

    /**
     * Met à jour le journal avec les données reçues.
     * Maximum de 100 éléments dans les tableaux
     * @param data
     * @private
     */
    _update_temps_reel_journal: function (data) {
        Array.prototype.push.apply(this._inst.temps_reel.journal, data);
        if (this._inst.temps_reel.journal.length > 100) {
            var count = this._inst.temps_reel.journal.length - 100;
            _.each(_.range(count), function () {
                this._inst.temps_reel.journal.shift();
            }, this);
        }

        this.trigger(this._inst);
    },

    /**
     * Met à jour les alertes avec les données reçues
     * @param data
     * @private
     */
    _update_temps_reel_alertes: function (data) {

        Array.prototype.push.apply(this._inst.temps_reel.alertes, data);
        if (this._inst.temps_reel.alertes.length > 100) {
            var count = this._inst.temps_reel.alertes.length - 100;
            _.each(_.range(count), function () {
                this._inst.temps_reel.alertes.shift();
            }, this);
        }

        this.trigger(this._inst);
    },

    /**
     * Action clic droit sur le treeview
     * @param data {save, errorBdd, model}
     * @private
     */
    _parking_state_update: function (data) {
        // Parse treeview
        this._inst.treeView.forEach(function (item, index) {
            //console.log('item %o',item);
            //console.log('model %o',data.model);
            // Parking updated
            if (item.id == data.model.id) {
                this._inst.treeView[index]['etat'] = data.model.etat
            }
        }, this);

        // MAJ affichage
        //console.log('TRIGGER %o', this._inst);
        this.trigger(this._inst);
    }
});