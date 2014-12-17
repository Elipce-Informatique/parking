// Composants REACT
// ATTENTION la majuscule est super importante
var DataTableBandeauUser = require('../react_data_table_bandeau_utilisateur').Composant;
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var Button = ReactB.Button;
var FicheUser = require('../react_fiche_utilisateur').Composant;
var AuthentMixins = require('../mixins/component_access');



/**
 * Page utilisateur
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageUser = React.createClass({

    mixins: [Reflux.ListenerMixin,AuthentMixins],

    getDefaultProps: function(){
        return { module_url: 'utilisateur'}
    },

    getInitialState: function(){
        return {etat:'liste', idUser:''};
    },

    componentWillMount: function(){
        this.listenTo(pageUserStore, this.updateData, this.updateData);
    },

    render: function() {
        return this.display();
    },
    //
    //componentWillUnmout: function(){
    //    console.log('UNMOUNT');
    //},

    display: function(){
        var react;

        switch(this.state.etat){
            case 'visu':
                react =
                    <div id="VISU">
                        <BandeauVisu titre={Lang.get('administration.utilisateur.titre')}/>
                        <FicheUser editable={true} idUser={this.state.idUser}/>
                    </div>

                break;
            case 'edition':
                break;
            case 'creation':
                react =
                    <div>
                        Mode creation
                        <DataTableBandeauUser/>
                    </div>
                break;
            default:
                react =
                    <div id="VISU">
                        <BandeauListe titre={Lang.get('administration.utilisateur.titre')}/>
                        <DataTableBandeauUser/>
                    </div>

                break;

        }
        return react;
    },

    updateData: function(obj) {
        // MAJ data
        this.setState(obj);
    }
});
module.exports.Composant = PageUser;


// Creates a DataStore
var pageUserStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.display_user, this.updateState);
        this.listenTo(Actions.bandeau.creer, this.modeCreation);


    },

    updateState: function(idUser){
        this.trigger({etat:'visu',idUser:idUser});
    },

    modeCreation: function(){
        this.trigger({etat:'creation',idUser:''});
    }
});
module.exports.Store = pageUserStore;