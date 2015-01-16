// COMPOSANTS REACT
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputMailEditable = Field.InputMailEditable;
var react_photo       = require('./composants/react_photo');
var form_data_helper  = require('./helpers/form_data_helper');
var PhotoEditable     = react_photo.PhotoEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;
var FormValidationMixin = require('./mixins/form_validation');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var InputRadioEditable = Field.InputRadioEditable;
var InputPasswordEditable = Field.InputPasswordEditable;
var Form = Field.Form;

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
var aLibelle = [Lang.get('global.oui'), Lang.get('global.non')];
var aName    = ['oui', 'non'];
var aReactElements  = {};
aReactElements['1'] = [];                                    /* Colonne n°1 du tableau               */
aReactElements['1'][0] = 'RadioBts';                         /* Type de composant à ajouter          */
aReactElements['1'][1] = {'name':aName, 'libelle':aLibelle}; /* Name des radio boutons et libelle    */
aReactElements['1'][2] = {'onClick':handleClickRadio};       /* Evenement sur click des radio bouton */

/* Fonction handleClickRadio */
function handleClickRadio(evt){
    var copie = _.clone(evt);
    Actions.utilisateur.radio_change(copie);
}

var emailInitial = '';

/**
 * Fiche utilisateur
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param idUser: id de l'utilisateur affiché dans cette fiche.
 */
var FicheUser = React.createClass({

    mixins: [Reflux.ListenerMixin, FormValidationMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        userData : React.PropTypes.object,
        idUser: React.PropTypes.number,
        modeCompte: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            modeCompte: false,
            userData: {}
        }
    },

    getInitialState: function () {
        var retour = {
            nom: '',
            prenom: '',
            email: '',
            photo: 'no.gif',
            passOld: '',
            passNew: '',
            passConfirm: '',
            dataProfil: [],
            retour: {},
            passNewvalue: '',
            passConfirmvalue: '',
            passOldvalue: '',
            tabProfilHide: true
        };
        return retour;
    },

    componentWillMount: function () {
        // Liaison au store
        this.listenTo(ficheUserStore, this.updateData, this.updateData);

        // Appel du chargement
        Actions.utilisateur.set_etat_create_edit(this.props.idUser==0);
        Actions.utilisateur.set_etat_compte(this.props.modeCompte);

        if(!this.props.modeCompte) {
            Actions.utilisateur.load_user_info(this.props.idUser);
        }
        else{
            var state = {
                nom:    this.props.userData.nom,
                prenom: this.props.userData.prenom,
                email:  this.props.userData.email,
                photo:  this.props.userData.photo
            };
            Actions.utilisateur.set_initial_state(state);
            this.setState(state);
        }
    },

    changePhoto: function (evt){
        var copie = _.clone(evt);
        Actions.utilisateur.changePhoto(copie);
    },

    render: function () {
        

        emailInitial = this.state.email;

        var attrs = {
                label: Lang.get('administration.utilisateur.tableau.email'),
                name: "email",
                value: this.state.email,
                required: true,
                wrapperClassName: 'col-md-4',
                labelClassName: 'col-md-1 text-right',
                groupClassName: 'row'
        };

        // Test si besoin de forcer le style de l'email
        if(this.state.dataEmail != undefined ){
            var attrs2  = {bsStyle:this.state.dataEmail.style, 'data-valid':this.state.dataEmail.isValid, help:this.state.dataEmail.tooltip};
            attrs       = _.extend(attrs, attrs2);
        }

        var SuiteCode = '';
        var titreBis  = '';

        var fctHideShow = null;

        if(this.state.tabProfilHide == true) {
            fctHideShow = function(e) { Actions.utilisateur.updateHideShowProfil(false); };
        }else{
            fctHideShow = function(e) { Actions.utilisateur.updateHideShowProfil(true); };
        }

        /* MODE COMPTE */
        if(this.props.modeCompte == true && this.props.editable == true){

            titreBis = Lang.get('administration.utilisateur.change_password');

            /* Attributs des inputs mot de pass */
            var attrsPass = {
                wrapperClassName: 'col-md-4',
                labelClassName: 'col-md-2 text-right',
                groupClassName: 'row'
            };

            var attrsPassOld = {
                label: Lang.get('administration.utilisateur.password_old'),
                name: "passOld",
                id: "passOld",
                value: this.state.passOldvalue
            };

            var attrsPassNew = {
                label: Lang.get('administration.utilisateur.password_new'),
                name: "passNew",
                id: "passNew",
                value: this.state.passNewvalue
            };

            var attrsPassConfirm = {
                label: Lang.get('administration.utilisateur.password_confirm'),
                name: "passConfirm",
                id: "passConfirm",
                value: this.state.passConfirmvalue
            };

            // Test si besoin de forcer le style du pass de confirmation
            if(this.state.passConfirm != undefined ){
                var attrs3  = {bsStyle:this.state.passConfirm.style, 'data-valid':this.state.passConfirm.isValid, help:this.state.passConfirm.tooltip};
                _.extend(attrsPassConfirm, attrs3);
            }

            // Test si besoin de forcer le style du pass old
            if(this.state.passOld != undefined ){
                var attrs4  = {bsStyle:this.state.passOld.style, 'data-valid':this.state.passOld.isValid, help:this.state.passOld.tooltip};
                _.extend(attrsPassOld, attrs4);
            }

            // Si nouveau mot de passe, mot de passe actuel obligatoire
            if(this.state.passNewvalue != '' || this.state.passConfirmvalue != ''){
                _.extend(attrsPassOld, {required: true});
            }

            _.extend(attrsPassOld,     attrsPass);
            _.extend(attrsPassNew,     attrsPass);
            _.extend(attrsPassConfirm, attrsPass);

            /* On affiche la modification du password */
            var password = (
                <span>
                    <InputPasswordEditable attributes={attrsPassOld}     editable={this.props.editable} />
                    <InputPasswordEditable attributes={attrsPassNew}     editable={this.props.editable} />
                    <InputPasswordEditable attributes={attrsPassConfirm} editable={this.props.editable} />
                </span>);
            //tableau = <p key="uniquekey">test</p>;
            if (this.state.tabProfilHide) {
                password = {};
            }
            SuiteCode = <Row>
                <Col md={2}>
                    <h3 className="btn btn-default hand-over" onClick={fctHideShow}>
                        {titreBis}
                    </h3>
                </Col>
                <Col md={10}>
                    <ReactCSSTransitionGroup transitionName="tabprofil" key="transitionGroupTable">
                        {password}
                    </ReactCSSTransitionGroup >
                </Col>
            </Row>;
        }
        // MODE ADMIN
        else if(this.props.modeCompte == false){

            titreBis = Lang.get('administration.utilisateur.profilsAssocie');

            var tableau = <DataTable
                            id='dataTableProfils'
                            bUnderline={false}
                            head={headP}
                            data={this.state.dataProfil}
                            hide={hideP}
                            reactElements={aReactElements}
                            key="testkey"
                            editable={this.props.editable}/> ;
            //tableau = <p key="uniquekey">test</p>;
            if(this.state.tabProfilHide){
                tableau = {};
            }

            /* On affiche le tableau des profils associés */
            SuiteCode = <Row>
                            <Col md={2}>
                                <h3 className="btn btn-default hand-over" onClick={fctHideShow}>
                                    {titreBis}
                                </h3>
                            </Col>
                            <Col md={10} key="colTable">
                                <ReactCSSTransitionGroup transitionName="tabprofil" key="transitionGroupTable">
                                {tableau}
                                </ReactCSSTransitionGroup>
                            </Col>
                        </Row>;
        }

        var fAttrs = {className:"form_utilisateur", id:"form_utilisateur"};
        var srcPhoto = './app/storage/documents/photo/'+this.state.photo;
        return (
            <Form ref="form" attributes={fAttrs}>
                <Row>
                    <Col md={2} className="photo">
                        <PhotoEditable name="photo" cacheable={false} alertOn={true} src={srcPhoto} evts={{onChange:this.changePhoto}} editable={this.props.editable} />
                    </Col>
                    <Col md={10}>
                        <InputTextEditable ref="nom"
                            attributes={
                            {
                                label: Lang.get('administration.utilisateur.tableau.nom'),
                                name: "nom",
                                value: this.state.nom,
                                required: true,
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-1 text-right',
                                groupClassName: 'row'
                            }}
                            editable={this.props.editable}
                            evts={{onChange: this.test}}/>
                        <InputTextEditable attributes={{
                            label: Lang.get('administration.utilisateur.tableau.prenom'),
                            name: "prenom",
                            value: this.state.prenom,
                            required: true,
                            wrapperClassName: 'col-md-4',
                            labelClassName: 'col-md-1 text-right',
                            groupClassName: 'row'
                        }} editable={this.props.editable} />
                        <InputMailEditable
                            attributes={attrs}
                            editable={this.props.editable} />
                    </Col>
                </Row>
                {SuiteCode}
            </Form>
        );
    },

    /**
     * Mise à jour des données utilisateur
     * @param {object} data
     */
    updateData: function (data) {
        try {
            this.setState(data);
        }
        catch (e) {

        }
    }
});
module.exports.Composant = FicheUser;


// Creates a DataStore
var ficheUserStore = Reflux.createStore({

    // Variables
    dataUser: {},
    formDataState: {},
    matriceBtnRadio: {},
    isMatriceModuleModif:false,
    modeCreate:true,
    modeCompte:false,

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.load_user_info, this.getInfosUser);
        this.listenTo(Actions.utilisateur.save_user,      this.sauvegarder);
        this.listenTo(Actions.utilisateur.delete_user,    this.supprimer);
        this.listenTo(Actions.utilisateur.initMatrice,    this.initMatrice);
        this.listenTo(Actions.utilisateur.radio_change,   this.radioChange);
        this.listenTo(Actions.validation.form_field_changed,    this.formChange);
        this.listenTo(Actions.validation.form_field_verif,      this.formVerif);
        this.listenTo(Actions.utilisateur.set_etat_create_edit, this.setEtatCreateEdit);
        this.listenTo(Actions.utilisateur.updateHideShowProfil, this.updateHideShowProfil);
        this.listenTo(Actions.utilisateur.set_etat_compte,      this.set_etat_compte);
        this.listenTo(Actions.utilisateur.set_initial_state,      this.set_initial_state);
    },
    set_initial_state: function(data){
        this.formDataState = data;
    },

    set_etat_compte: function(bool){
        this.modeCompte = bool;
    },

    initMatrice: function(){
        this.matriceBtnRadio = {};
    },

    updateHideShowProfil: function(bool){
        this.trigger({tabProfilHide:bool});
    },

    setEtatCreateEdit: function(modeCreate_P){
        this.isMatriceModuleModif = false;
        this.modeCreate           = modeCreate_P;
    },

    formChange: function(e){
        var data = {};

        // Mise à jour du state
        if(e.name == 'email')
            data.email = e.value;
        else if(e.name == 'nom')
            data.nom = e.value;
        else if(e.name == 'prenom')
            data.prenom = e.value;
        else if(e.name == 'passNew')
            data.passNewvalue = e.value;
        else if(e.name == 'passOld')
            data.passOldvalue = e.value;
        else if(e.name == 'passConfirm')
            data.passConfirmvalue = e.value;
        else if(e.name == 'photo')
            data.photo = e.value;

        this.formDataState = _.extend(this.formDataState, data);
        this.trigger(this.formDataState);
    },

    /**
     * Vérifications "Métiers" du formulaire
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    formVerif: function(e){
        var data = {};

        // VÉFIR ADRESSE MAIL:
        if(e.name == 'email'){
            if(this.modeCreate)
                data = this.emailCreateChange(e.value);
            else
                data = this.emailEditChange(e.value);
        }
        else if(e.name == 'passNew')
            data = this.verifPassNew(e.value, $('#passConfirm')[0].value);
        else if(e.name == 'passOld')
            data = this.verifPassOld(e.value);
        else if(e.name == 'passConfirm')
            data = this.verifPassNew(e.value, $('#passNew')[0].value);

        this.trigger(data);
    },

    radioChange: function(evt){
        /* Récupère les données du radio bouton */
        var Etat     = $(evt.currentTarget).data('etat'); /* 'visu', 'modif' ou 'aucun' */
        var idProfil = $(evt.currentTarget).data('id');   /* id du module concerné      */

        /* Mise a jour de la matrice */
        this.matriceBtnRadio[idProfil] = Etat;

        /* Mise à jour du flag pour sauvegarder les modifications sur l'etat des modules */
        this.isMatriceModuleModif = true;
    },

    // Callback
    getInfosUser: function (idUser) {

        var that = this;
        // AJAX
        $.ajax({
            url: BASE_URI + 'utilisateur/profil/' + idUser,
            dataType: 'json',
            context: that,
            success: function (data) {
                Actions.utilisateur.initMatrice();
                if(data.nom != '' && data.prenom != ''){
                    Actions.utilisateur.updateBandeau(data.nom, data.prenom, idUser);
                }
                // Passe variable aux composants qui écoutent l'action actionLoadData
                that.trigger(data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                that.trigger({id: 0});
            }
        }, that);
    },
    /**
     * Appellé quand on clique sur le bouton sauvegarder
     * @param idUser
     */
    sauvegarder: function (idUser) {
        //console.log('FICHE USER SAVE '+idUser);
        // Variables
        var url = idUser === 0 ? '' : idUser;

        if(this.modeCompte == true)
            url = BASE_URI + 'moncompte';
        else
            url = BASE_URI + 'utilisateur/' + url;

        //console.log('SAVE '+idUser+' URL '+url);
        var method = idUser === 0 ? 'POST' : 'PUT';

        var matrice = [];
        if(this.isMatriceModuleModif) {
            var that = this;
            _.each(this.matriceBtnRadio, function (key, value) {
                matrice.push([key, value]);
            }, that);
        }

        // RÉCUPÉRATION DES DONNÉES

        // FormData
        var fData = form_data_helper('form_utilisateur', method);
        fData.append('matrice', matrice);
        fData.append('photo', $("[name=photo]")[0].files[0]);

        // Requête
        $.ajax({
            url: url,
            type: 'POST',
            data: fData,
            processData: false,
            contentType: false,
            dataType:'json',
            context: this,
            success: function (tab) {
                if(tab.save == true) {
                    Actions.notif.success(Lang.get('global.notif_success'));
                    Actions.utilisateur.saveOK(tab.idUser*1);
                    Actions.utilisateur.load_user_info(tab.idUser*1);
                }
                else if(tab.pass !== undefined)
                    Actions.notif.error(Lang.get('administration.utilisateur.oldPassConfirmError'));
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
                Actions.utilisateur.supprOK();
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.trigger(this.dataUser);
            }
        });
    },

    /**
     * Vérification de l'unicité de l'e-mail en BDD
     * @param value
     * @param edit
     * @returns {{}}
     */
    emailChange: function(value, edit){
        /* Varaible de retour */
        var retour = {};
        retour.dataEmail = {};

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
                    if(good.good == false){
                        retour.dataEmail.isValid = false;
                        retour.dataEmail.style   = 'error';
                        retour.dataEmail.tooltip = Lang.get('global.utilisateurExist');
                    }
                },

                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
        return retour;
    },

    emailEditChange: function (value){
        return this.emailChange(value, true);
    },

    emailCreateChange: function (value){
        return this.emailChange(value, false);
    },

    verifPassOld: function(value){
        var retour = {};
        retour.passOld = {};

        if(value.length >= 6) {
            // AJAX
            $.ajax({
                url: BASE_URI + 'moncompte/verifMPD/' + value, /* correspond au module url de la BDD */
                dataType: 'json',
                context: this,
                async: false,
                success: function (good) {
                    /* En vert */
                    if (good.good == false) {
                        retour.passOld.isValid = false;
                        retour.passOld.style = 'error';
                        retour.passOld.tooltip = Lang.get('administration.utilisateur.oldPassConfirmError');
                    }
                },

                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
        return retour;
    },

    verifPassNew: function(value1, value2){
        var retour = {};
        retour.passConfirm = {};
        if(value1 != value2){
            retour.passConfirm.isValid = false;
            retour.passConfirm.style   = 'error';
            retour.passConfirm.tooltip = Lang.get('administration.utilisateur.newPassConfirmError');
        }
        return retour;
    }

});
module.exports.store = ficheUserStore;
