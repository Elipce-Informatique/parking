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

var AuthentMixins    = require('./mixins/component_access');
var DataTableBandeau = require('./composants/tableau/react_data_table_bandeau'); /* Pour le bandeau de la page profil */
var DataTableBandeauProfilReact = React.createClass({

    mixins: [Reflux.ListenerMixin,AuthentMixins],

    propTypes: {
        head:      React.PropTypes.array.isRequired,
        hide:      React.PropTypes.array.isRequired,
        id:        React.PropTypes.string.isRequired,
        settings:  React.PropTypes.object,
        attributes:React.PropTypes.object,
        evts:      React.PropTypes.object,
        bUnderline:React.PropTypes.bool
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function() {

        return {
            attributes: {},
            evts:{},
            bUnderline: true,
            module_url: 'profils' /* correspond au module url de la BDD, pour les droits */
        };
    },

    getInitialState: function(){
        return {data:[]};
    },

    /**
     * Avant le 1er affichage
     * Abonne le composant au store "profilStore"
     * @returns {undefined}
     */
    componentWillMount: function(){

        /* Ecoute le store profilStore qui se charge de mettre à jour les données */
        this.listenTo(profilStore, this.updateProfil, this.updateProfil);

        /* Charge les données */
        Actions.profil.profil_update();
    },

    render: function() {
        return (
            <DataTableBandeau id={this.props.id} head={this.props.head} data={this.state.data} hide={this.props.hide} attributes={this.props.attributes} bUnderline={this.props.bUnderline} evts={this.props.evts}/>
        )
    },

    /*
     |--------------------------------------------------------------------------
     | FONCTIONS NON REACT
     |--------------------------------------------------------------------------
     */
    /**
     * Mise à jour de la TABLE
     * @param {type} data
     * @returns {undefined}
     */
    updateProfil: function(data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState({
            data: data
        });
    }
});

module.exports = DataTableBandeauProfilReact;

/*********************************************************************/
/*                              PROFILSTORE                          */
/*              Store associé au tableau des profils                 */
/*********************************************************************/
var profilStore = Reflux.createStore({

    // Initial setup
    init: function() {

        /* Sur l'action "profil_update" on charge les données */
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

module.exports.Store = profilStore;