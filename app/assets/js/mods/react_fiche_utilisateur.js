// COMPOSANTS REACT
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputMailEditable = Field.InputMailEditable;
var react_photo       = require('./composants/react_photo');
var PhotoEditable     = react_photo.PhotoEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;
var AuthentMixins = require('./mixins/component_access');
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
        var retour = {nom: '',
                      prenom: '',
                      email: '',
                      photo: 'no.gif',
                      passOld: '',
                      passNew: '',
                      passConfirm: '',
                      dataProfil: [],
                      retour: {},
                      passNewvalue:'',
                      passConfirmvalue:'',
                      passOldvalue:'',
                      tabProfilHide:true};
        return retour;
    },

    componentWillMount: function () {
        // Liaison au store
        this.listenTo(ficheUserStore, this.updateData, this.updateData);

        // Appel du chargement
        Actions.utilisateur.set_etat_create_edit(this.props.idUser==0);
        if(!this.props.modeCompte) {
            Actions.utilisateur.load_user_info(this.props.idUser);
        }
        else{
            var state = {
                nom:    this.props.userData.nom,
                prenom: this.props.userData.prenom,
                email:  this.props.userData.email
            };
            this.setState(state);
        }
    },

    clickPhoto: function (evt){
        var copie = _.clone(evt);
        Actions.utilisateur.changePhoto(copie);
    },

    render: function () {
        console.log('this.state : %o', this.state);

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

        /* Mode compte ou page user */
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
            SuiteCode = <Row>
                <Col md={2}>
                    <h3 className="breadcrumb hand-over">
                        {titreBis}
                    </h3>
                </Col>
                <Col md={10}>
                    <InputPasswordEditable attributes={attrsPassOld}     editable={this.props.editable} />
                    <InputPasswordEditable attributes={attrsPassNew}     editable={this.props.editable} />
                    <InputPasswordEditable attributes={attrsPassConfirm} editable={this.props.editable} />
                </Col>
            </Row>;
        }
        else if(this.props.modeCompte == false){

            titreBis = Lang.get('administration.utilisateur.profilsAssocie');

            var fctHideShow    = null;
            var transitionName = '';

            if(this.state.tabProfilHide == true) {
                console.log('hide');
                transitionName = 'hide';

                fctHideShow = function(e) {
                    Actions.utilisateur.updateHideShowProfil(false);
                };
            }else{
                console.log('show');
                transitionName = 'show';

                fctHideShow = function(e) {
                    Actions.utilisateur.updateHideShowProfil(true);
                };
            }

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
            console.log(this.state);
            if(this.state.tabProfilHide){
                tableau = {};
            }

            /* On affiche le tableau des profils associés */
            SuiteCode = <Row>
                            <Col md={2}>
                                <h3 className="breadcrumb hand-over" onClick={fctHideShow}>
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
                        <PhotoEditable name="photo" alertOn={true} src={srcPhoto} evts={{onClick:this.clickPhoto}} editable={this.props.editable} />
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
    matriceBtnRadio: {},
    isMatriceModuleModif:false,
    modeCreate:true,

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.load_user_info, this.getInfosUser);
        this.listenTo(Actions.utilisateur.save_user,      this.sauvegarder);
        this.listenTo(Actions.utilisateur.delete_user,    this.supprimer);
        this.listenTo(Actions.utilisateur.initMatrice,    this.initMatrice);
        this.listenTo(Actions.utilisateur.radio_change,   this.radioChange);
        this.listenTo(Actions.validation.form_field_changed, this.formChange);
        this.listenTo(Actions.utilisateur.set_etat_create_edit, this.setEtatCreateEdit);
        this.listenTo(Actions.utilisateur.updateHideShowProfil, this.updateHideShowProfil);
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

        if(e.name == 'email'){
            console.log('email');
            if(this.modeCreate)
                data = this.emailCreateChange(e.value);
            else
                data = this.emailEditChange(e.value);
            _.extend(data, {email:e.value});
        }
        else if(e.name == 'nom')
            data.nom = e.value;
        else if(e.name == 'prenom')
            data.prenom = e.value;
        else if(e.name == 'passNew') {
            data = this.verifPassNew(e.value, $('#passConfirm')[0].value);
            data.passNewvalue = e.value;
        }
        else if(e.name == 'passOld') {
            data = this.verifPassOld(e.value);
            _.extend(data, {passOldvalue:e.value});
        }
        else if(e.name == 'passConfirm') {
            data = this.verifPassNew(e.value, $('#passNew')[0].value);
            _.extend(data, {passConfirmvalue:e.value});
        }

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

    sauvegarder: function (idUser) {
        //console.log('FICHE USER SAVE '+idUser);
        // Variables
        var url = idUser === 0 ? '' : idUser;
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
        var data = $('#form_utilisateur').serializeArray();
        data.push({name: '_token', value:$('#_token').val()});

        // FormData
        var fData = new FormData();
        _.forIn(data, function(v,k){
            fData.append(v.name,v.value);
        });
        fData.append('matrice',matrice);
        fData.append('_method',method);
        fData.append('photo', $("[name=photo]")[0].files[0]);

        //var request = new XMLHttpRequest();
        //request.open("POST", url);
        //request.send(fData);
        // Requête
        $.ajax({
            url: url,
            type: 'POST',
            data: fData,
            processData: false,
            contentType: false,
            dataType:'json',
            success: function (tab) {
                if(tab.save == true) {
                    Actions.notif.success(Lang.get('global.notif_success'));
                    Actions.utilisateur.saveOK(tab.idUser*1);
                }
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
                        retour.dataEmail = {};
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

        if(value.length >= 6) {
            console.log('Ajax');
            // AJAX
            $.ajax({
                url: BASE_URI + 'moncompte/verifMPD/' + value, /* correspond au module url de la BDD */
                dataType: 'json',
                context: this,
                async: false,
                success: function (good) {
                    /* En vert */
                    if (good.good == false) {
                        retour.passOld = {};
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
        console.log('value1 : '+value1+', value2 : '+value2);
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
