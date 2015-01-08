// COMPOSANTS REACT
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputMailEditable = Field.InputMailEditable;
var react_photo       = require('./react_photo');
var PhotoEditable     = react_photo.PhotoEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;
var AuthentMixins = require('./mixins/component_access');
var FormValidationMixin = require('./mixins/form_validation');

// TEST
var InputRadioEditable = Field.InputRadioEditable;
var Form = Field.Form

// STORES
//var storePageUser = require('./page/react_page_utilisateur');
//
//console.log('INIT STORE PAGE USER %o',storePageUser);

/**
 * Fiche utilisateur
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var FicheUser = React.createClass({

    mixins: [Reflux.ListenerMixin, AuthentMixins, FormValidationMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        idUser: React.PropTypes.number
    },

    getInitialState: function () {
        return {data: {nom: '', prenom: '', email: '', photo: 'app/documents/photo/no.gif'}};
    },

    componentDidMount: function () {
        // Liaison au store
        this.listenTo(ficheUserStore, this.updateData, this.updateData);

        // Appel du chargement
        Actions.utilisateur.load_user_info(this.props.idUser);
    },

    clickPhoto: function (evt){
        var copie = _.clone(evt);
        Actions.utilisateur.changePhoto(copie);
    },

    render: function () {

        //<PhotoEditable src={BASE_URI+this.state.data.photo} editable={this.props.editable}/>

        return (
            <Form ref="form">
                <Row>
                    <Col md={1} mdOffset={2} className="photo">
                            <PhotoEditable src='./app/assets/images/portrait_vide.gif' evts={{onClick:this.clickPhoto}} editable={this.props.editable} />
                    </Col>
                </Row>
                <InputTextEditable ref="nom"
                    attributes={
                    {
                        label: Lang.get('administration.utilisateur.tableau.nom'),
                        name: "nom",
                        value: this.state.data.nom,
                        required: true,
                        wrapperClassName: 'col-md-4', labelClassName: 'col-md-2 text-right', groupClassName: 'row'
                    }}
                    editable={this.props.editable}
                    evts={{onChange: this.test}}/>
                <InputTextEditable attributes={{
                    label: Lang.get('administration.utilisateur.tableau.prenom'),
                    name: "prenom",
                    value: this.state.data.prenom,
                    required: true,
                    wrapperClassName: 'col-md-4',
                    labelClassName: 'col-md-2 text-right',
                    groupClassName: 'row'
                }} editable={this.props.editable} />
                <InputMailEditable attributes={{
                    label: Lang.get('administration.utilisateur.tableau.email'),
                    name: "email",
                    value: this.state.data.email,
                    required: true,
                    wrapperClassName: 'col-md-4',
                    labelClassName: 'col-md-2 text-right',
                    groupClassName: 'row'
                }} editable={this.props.editable} />
            </Form>
        );
    },

    /**
     * Mise à jour des données utilisateur
     * @param {object} data
     */
    updateData: function (data) {
        //console.log('Fiche USER data %o',data);
        try {
            // MAJ data
            this.setState({
                data: data
            });
        }
        catch (e) {

        }
    },

    test: function () {
        //console.log('Change NOM %o',this.refs)
    }
});
module.exports.Composant = FicheUser;


// Creates a DataStore
var ficheUserStore = Reflux.createStore({

    // Variables
    dataUser: {},

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.load_user_info, this.getInfosUser);
        this.listenTo(Actions.utilisateur.save_user, this.sauvegarder);
        this.listenTo(Actions.utilisateur.delete_user, this.supprimer);
        this.listenTo(Actions.utilisateur.changePhoto, this.changePhoto);
    },

    // Callback
    getInfosUser: function (idUser) {
        // ID user KO
        if (idUser === 0) {
            this.trigger({id: 0, nom: '', prenom: '', email: '', photo: 'app/documents/photo/no.gif'})
        }
        // User OK
        else {
            // AJAX
            $.ajax({
                url: BASE_URI + 'utilisateur/' + idUser,
                dataType: 'json',
                context: this,
                success: function (data) {
                    // Passe variable aux composants qui écoutent l'action actionLoadData
                    this.trigger(data);
                },
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                    this.trigger({id: 0});
                }
            });
        }
    },

    sauvegarder: function (idUser) {
        //console.log('FICHE USER SAVE '+idUser);
        // Variables
        var url = idUser === 0 ? '' : idUser;
        url = BASE_URI + 'utilisateur/' + url;
        //console.log('SAVE '+idUser+' URL '+url);
        var method = idUser === 0 ? 'POST' : 'PUT';
        var data = $('form').serializeArray();
        data.push({name: '_token', value: $('#_token').val()});

        //console.log('DATA %o',data);

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: data,
            success: function (tab) {
                // TODO NOTIFICATION
                //Notif tab['save']
                this.dataUser = tab.data;
                // Passe variable aux composants qui écoutent l'action actionLoadData
                this.trigger(tab.data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.trigger(this.dataUser);
            }
        });
    },

    supprimer: function (idUser) {
        // Variables
        var url = BASE_URI + 'utilisateur/' + idUser;
        var method = 'DELETE';

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: {'_token': $('#_token').val()},
            success: function (tab) {
                // TODO NOTIFICATION
                //Notif tab['save']
                this.dataUser = tab.data;
                // Passe variable aux composants qui écoutent l'action actionLoadData
                this.trigger(tab.data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.trigger(this.dataUser);
            }
        });
    },

    changePhoto: function(evt){
        console.log('clickImage, evt : %o', evt);
    }
});
module.exports.store = ficheUserStore;