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

/* Paramètres du tableau des profils           */
/* Entête(s) du tableau : "Profils, Accessible */
/* Champ(s) caché(s)    : "id"                 */
var DataTable = require('./composants/tableau/react_data_table');
var headP = [Lang.get('global.profil'), Lang.get('global.droits')];
var hideP = ['id'];

/* Paramètres pour les radios Boutons                                */
/* Libelles : "Visu, Modif, Aucun"                                   */
/* Name     : "btnVisu, btnModif, btnAucun                           */
/* Sur clic d'un radio bouton, déclenche l'action "handleClickRadio" */
var aLibelle = new Array(Lang.get('global.oui'), Lang.get('global.non'));
var aName    = new Array('oui', 'non');
var aReactElements  = {};
aReactElements['1'] = new Array();                           /* Colonne n°1 du tableau               */
aReactElements['1'][0] = 'Radio';                            /* Type de composant à ajouter          */
aReactElements['1'][1] = {'name':aName, 'libelle':aLibelle}; /* Name des radio boutons et libelle    */
aReactElements['1'][2] = {'onClick':handleClickRadio};       /* Evenement sur click des radio bouton */

/* Fonction handleClickRadio */
function handleClickRadio(evt){
    var copie = _.clone(evt);
    Actions.utilisateur.radio_change(copie);
}

var emailInitial = '';

function emailChange(value, edit){
    /* Varaible de retour */
    var retour = {};

    /* Est-ce que l'email est supérieur à 4 caractère (x@x.xx)? */
    if(value.length>=6 && value != emailInitial){

        // AJAX
        $.ajax({
            url:      BASE_URI + 'utilisateur/email/'+value, /* correspond au module url de la BDD */
            dataType: 'json',
            context:  this,
            async: false,
            success:  function (good) {
                /* En vert */
                if(good.good == true){
                    retour.isValid = true;
                    retour.style   = 'success';
                    retour.tooltip = '';
                }
                /* En rouge */
                else{
                    retour.isValid = false;
                    retour.style   = 'error';
                    retour.tooltip = Lang.get('global.utilisateurExist');
                }
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }
    console.log('retour : %o', retour);
    return retour;
}

function emailEditChange(value){
    return emailChange(value, true);
}

function emailCreateChange (value){
    return emailChange(value, false);
}

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
        return {nom: '', prenom: '', email: '', photo: 'app/documents/photo/no.gif', dataProfil: [], retour: {}};
    },

    componentWillMount: function () {
        // Liaison au store
        this.listenTo(ficheUserStore, this.updateData, this.updateData);

        console.log('componentWillMount');

        // Appel du chargement
        Actions.utilisateur.set_etat_create_edit(this.props.idUser==0);
        Actions.utilisateur.load_user_info(this.props.idUser);
    },

    clickPhoto: function (evt){
        var copie = _.clone(evt);
        Actions.utilisateur.changePhoto(copie);

        /* Ouvrir une boite de dialogue de sélection d'un fichier */

        /* Partir en ajax pour sauvegarder */

    },

    render: function () {
        emailInitial = this.state.email;

        var titreBis = Lang.get('administration.utilisateur.profilsAssocie');
        
        var attrs = {
                label: Lang.get('administration.utilisateur.tableau.email'),
                name: "email",
                value: this.state.email,
                required: true,
                wrapperClassName: 'col-md-4',
                labelClassName: 'col-md-2 text-right',
                groupClassName: 'row'
        };

        // Test si besoin de forcer le style de l'email
        if(this.state.retour.style != undefined ){
            var attrs2  = {bsStyle:this.state.retour.style, 'data-valid':this.state.retour.isValid, help:this.state.retour.tooltip};
            console.log('Attrs2 %o', attrs2);
            attrs       = _.extend(attrs, attrs2);
            attrs.value = this.state.retour.value;
        }

        return (
            <Form ref="form">
                <Row>
                    <Col md={1} mdOffset={2} className="photo">
                        <PhotoEditable src={this.state.photo} evts={{onClick:this.clickPhoto}} editable={this.props.editable} />
                    </Col>
                </Row>
                <InputTextEditable ref="nom"
                    attributes={
                    {
                        label: Lang.get('administration.utilisateur.tableau.nom'),
                        name: "nom",
                        value: this.state.nom,
                        required: true,
                        wrapperClassName: 'col-md-4', labelClassName: 'col-md-2 text-right', groupClassName: 'row'
                    }}
                    editable={this.props.editable}
                    evts={{onChange: this.test}}/>
                <InputTextEditable attributes={{
                    label: Lang.get('administration.utilisateur.tableau.prenom'),
                    name: "prenom",
                    value: this.state.prenom,
                    required: true,
                    wrapperClassName: 'col-md-4',
                    labelClassName: 'col-md-2 text-right',
                    groupClassName: 'row'
                }} editable={this.props.editable} />
                <InputMailEditable
                    attributes={attrs}
                    editable={this.props.editable} />
                <h2>{titreBis}</h2>
                <DataTable id='dataTableProfils'
                    bUnderline={false}
                    head={headP}
                    data={this.state.dataProfil}
                    hide={hideP}
                    reactElements={aReactElements}
                    editable={this.props.editable}/>
            </Form>
        );
    },

    /**
     * Mise à jour des données utilisateur
     * @param {object} data
     */
    updateData: function (data) {
        console.log('Fiche USER data %o',data);
        try {
            this.setState(data);
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
    matriceBtnRadio: {},
    isMatriceModuleModif:false,
    modeCreate:true,

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.load_user_info, this.getInfosUser);
        this.listenTo(Actions.utilisateur.save_user,      this.sauvegarder);
        this.listenTo(Actions.utilisateur.delete_user,    this.supprimer);
        this.listenTo(Actions.utilisateur.changePhoto,    this.changePhoto);
        this.listenTo(Actions.utilisateur.initMatrice,    this.initMatrice);
        this.listenTo(Actions.utilisateur.radio_change,   this.radioChange);
        this.listenTo(Actions.validation.form_field_changed, this.formChange);
        this.listenTo(Actions.utilisateur.set_etat_create_edit, this.setEtatCreateEdit);
    },

    initMatrice: function(){
        this.matriceBtnRadio = {};
    },

    setEtatCreateEdit: function(modeCreate_P){
        this.modeCreate = modeCreate_P;
    },

    formChange: function(e){
        console.log('formChange');
        var retour = {};

        if(e.name == 'email'){
            console.log('email');
            if(this.modeCreate)
                retour = emailCreateChange(e.value);
            else
                retour = emailEditChange(e.value);
            retour = _.merge(retour, {value:e.value});
        }

        this.trigger({retour:retour});
    },

    radioChange: function(evt){
        console.log('radioChange');
        /* Récupère les données du radio bouton */
        var Etat     = $(evt.currentTarget).data('etat'); /* 'visu', 'modif' ou 'aucun' */
        var idProfil = $(evt.currentTarget).data('id');   /* id du module concerné      */

        /* Mise a jour de la matrice */
        this.matriceBtnRadio[idProfil] = Etat;

        /* Mise à jour du flag pour sauvegarder les modifications sur l'etat des modules */
        this.isMatriceModuleModif = true;

        console.log('Matrice : %o', this.matriceBtnRadio);
    },

    // Callback
    getInfosUser: function (idUser) {
        console.log('getInfosUser');
        var that = this;
        // AJAX
        $.ajax({
            url: BASE_URI + 'utilisateur/profil/' + idUser,
            dataType: 'json',
            context: that,
            success: function (data) {
                Actions.utilisateur.initMatrice();

                // Passe variable aux composants qui écoutent l'action actionLoadData
                that.trigger(data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                that.trigger({id: 0});
            }
        }, that);
    },

    sauvegarder: function (idUser) {
        //console.log('FICHE USER SAVE '+idUser);
        // Variables
        var url = idUser === 0 ? '' : idUser;
        url = BASE_URI + 'utilisateur/' + url;
        //console.log('SAVE '+idUser+' URL '+url);
        var method = idUser === 0 ? 'POST' : 'PUT';

        var matrice = [];
        var that    = this;
        var indice  = 0;
        _.each(this.matriceBtnRadio, function($key, $value){
            matrice.push([$key, $value]);
        }, that);

        var data = $('form').serializeArray();
        data.push({name: '_token', value: $('#_token').val()});
        data.push({name:'matrice', value:matrice});

        //console.log('DATA %o',data);

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: data,
            success: function (tab) {
                if(tab.save === true)
                    Actions.notif.success(Lang.get('global.notif_success'));
                else
                    Actions.notif.error(Lang.get('global.notif_erreur'));
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error('AJAX : '+Lang.get('global.notif_erreur'));
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