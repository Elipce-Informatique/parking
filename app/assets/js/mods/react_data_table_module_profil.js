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

var AuthentMixins              = require('./mixins/component_access');
var DataTable                  = require('./composants/tableau/react_data_table');
var ReactGroupRadioBoots       = require('./composants/formulaire/react_radio');
var DataTableModuleProfilReact = React.createClass({

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
            bUnderline: true
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
        this.listenTo(moduleProfilStore, this.updateData, this.updateData);
        // Appel action
        Actions.profil.profil_load();
    },

    render: function() {
        return (
            <DataTable id={this.props.id} head={this.props.head} data={this.state.data} hide={this.props.hide} attributes={this.props.attributes} bUnderline={this.props.bUnderline} evts={this.props.evts}/>
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
    updateData: function(data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState({
            data: data
        });
    }
});

module.exports = DataTableModuleProfilReact;


/* Création du store du tableau profil       */
/* On a abonné le composant tableau au store */
var moduleProfilStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.profil.profil_select, this.getDataModuleProfil);

    },

    /* Charge les données à chaque évènement load_profil */
    getDataModuleProfil: function(evt) {
        if($(evt.currentTarget).hasClass('row_selected')) {
            var idProfil = $(evt.currentTarget).data('id');
            //$("#tabModule").show();

            // AJAX
            $.ajax({
                url: BASE_URI + 'profils/' + idProfil + '/modules', /* correspond au module url de la BDD */
                dataType: 'json',
                context: this,
                success: function (data) {
                    var aLibelle = new Array(Lang.get('administration.profil.visu'), Lang.get('administration.profil.modif'), Lang.get('administration.profil.aucun'));
                    var aName    = new Array('btnVisu', 'btnModif', 'btnAucun');
                    var aChecked = new Array();
                    var newData  = new Array();
                    var indice = 0;

                    // Gestion des radio boutons
                    data.forEach(function(lg) {
                        aChecked[0] = (lg['etat'] == 'visu' ?true:false);
                        aChecked[1] = (lg['etat'] == 'modif'?true:false);
                        aChecked[2] = (lg['etat'] == 'null' ?true:false);

                        lg['etat'] = <ReactGroupRadioBoots name={aName} libelle={aLibelle} checked={aChecked}/>;

                        newData[indice++] = lg;
                        console.log(newData);
                    });

                    // Passe variable aux composants qui écoutent le store profilStore
                    this.trigger(newData);
                },
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                    this.trigger([]);
                }
            });
        }
        else{
            //$("#tabModule").hide();
            this.trigger([]);
        }
    }
});