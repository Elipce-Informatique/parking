// Composants REACT
var DataTableBandeauUser = require('../react_data_table_bandeau_utilisateur').Composant;
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var Button = ReactB.Button;
var FicheUser = require('../react_fiche_utilisateur').Composant;
var Row = ReactB.Row;
var Col = ReactB.Col;

// MIXINS
var AuthentMixins = require('../mixins/component_access');

var MixinGestMod = require('../mixins/gestion_modif');



/**
 * Page utilisateur
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageUser = React.createClass({

    mixins: [Reflux.ListenerMixin,AuthentMixins,MixinGestMod],

    getDefaultProps: function () {
        return {module_url: 'utilisateur'}
    },

    getInitialState: function () {
        return {etat: 'liste', idUser: ''};
    },

    componentWillMount: function () {
        this.listenTo(pageUserStore, this.updateData, this.updateData);
    },

    render: function () {
        var dynamic = this.display();
        return (
            <Col md={12}>
                {dynamic}
            </Col>
        )
    },

    display: function () {
        var react;

        switch (this.state.etat) {
            case 'visu':
                react =
                    <div key={this.state.etat}>
                        <BandeauVisu titre={Lang.get('administration.utilisateur.titre')}/>
                        <FicheUser editable={false} idUser={this.state.idUser}/>
                    </div>

                break;
            case 'edition':
                react =
                    <div key={this.state.etat}>
                        <BandeauEdition mode={1} titre={Lang.get('administration.utilisateur.titre')}/>
                        <FicheUser editable={true} idUser={this.state.idUser}/>
                    </div>
                break;
            case 'creation':
                react =
                    <div key={this.state.etat}>
                        <BandeauEdition mode={0} titre={Lang.get('administration.utilisateur.titre')}/>
                        <FicheUser editable={true} idUser=""/>
                    </div>
                break;
            default:
                react =
                    <div key={this.state.etat}>
                        <BandeauListe titre={Lang.get('administration.utilisateur.titre')}/>
                        <Row>
                            <Col md={12}>
                                <DataTableBandeauUser/>
                            </Col>
                        </Row>
                    </div>

                break;

        }
        return react;
    },

    updateData: function (obj) {
        console.log('UPDATE %o',obj);
        // MAJ data
        this.setState(obj);
    }
});
module.exports.Composant = PageUser;


// Creates a DataStore
var pageUserStore = Reflux.createStore({

    // Variables
    idUser: '',

    // Initial setup
    init: function () {

        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.display_user, this.modeVisu);
        this.listenTo(Actions.bandeau.creer, this.modeCreation);
        this.listenTo(Actions.bandeau.editer, this.modeEdition);
        this.listenTo(Actions.bandeau.retour, this.modeListe);


    },

    modeVisu: function (idUser) {
        this.idUser = idUser;
        this.trigger({etat: 'visu', idUser: idUser});
    },

    modeCreation: function () {
        this.idUser = '';
        this.trigger({etat: 'creation', idUser: ''});
    },

    modeEdition: function () {
        console.log('ID USER ' + this.idUser);
        this.trigger({etat: 'edition', idUser: this.idUser});
    },

    modeListe: function () {
        this.idUser = '';
        this.trigger({etat: 'liste', idUser: ''});
    }
});
console.log('PAGU UTILISATEUR STORE %o',pageUserStore);
module.exports.store = pageUserStore;