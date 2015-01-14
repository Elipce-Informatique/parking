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
/**
 * Vérification de l'unicité de l'e-mail en BDD
 * @param value
 * @param edit
 * @returns {{}}
 */
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
                if(good.good == false){
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
        var retour = {nom: '', prenom: '', email: '', photo: 'no.gif', dataProfil: [], retour: {}, tabProfilHide:true};
        return retour;
    },

    componentWillMount: function () {
        // Liaison au store
        this.listenTo(ficheUserStore, this.updateData, this.updateData);

        // Appel du chargement
        Actions.utilisateur.set_etat_create_edit(this.props.idUser==0);
        if(!this.props.modeCompte) {
            Actions.utilisateur.load_user_info(this.props.idUser);
        }else{
            console.log('PASS SETSTATE:');
            var state = {
                nom: this.props.userData.nom,
                prenom: this.props.userData.prenom,
                email: this.props.userData.email
            };
            console.log(state);
            this.setState(state);
        }
    },

    clickPhoto: function (evt){
        var copie = _.clone(evt);
        Actions.utilisateur.changePhoto(copie);

        /* Ouvrir une boite de dialogue de sélection d'un fichier */

        /* Partir en ajax pour sauvegarder */

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
        if(this.state.retour.style != undefined ){
            var attrs2  = {bsStyle:this.state.retour.style, 'data-valid':this.state.retour.isValid, help:this.state.retour.tooltip};
            console.log('Attrs2 %o', attrs2);
            attrs       = _.extend(attrs, attrs2);
        }

        var SuiteCode = '';
        /* Mode compte ou page user */
        if(this.props.modeCompte == true){

            /* On affiche la modification du password */
            SuiteCode = <div>
                            A faire
                        </div>
        }
        else{

            var titreBis = Lang.get('administration.utilisateur.profilsAssocie');

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

            /* On affiche le tableau des profils associés */
            SuiteCode = <Row>
                            <Col md={2}>
                                <h3 className="breadcrumb hand-over" onClick={fctHideShow}>
                                    {titreBis}
                                </h3>
                            </Col>
                            <Col md={10}>
                                <ReactCSSTransitionGroup transitionName="example">
                                        <DataTable
                                            id='dataTableProfils'
                                            bUnderline={false}
                                            head={headP}
                                            data={this.state.dataProfil}
                                            hide={hideP}
                                            reactElements={aReactElements}
                                            editable={this.props.editable}/>
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
                                wrapperClassName: 'col-md-4', labelClassName: 'col-md-1 text-right', groupClassName: 'row'
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
        this.listenTo(Actions.utilisateur.changePhoto,    this.changePhoto);
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
        console.log('updateHideShowProfil');
        this.trigger({tabProfilHide:bool});
    },

    setEtatCreateEdit: function(modeCreate_P){
        isMatriceModuleModif = false;
        this.modeCreate = modeCreate_P;
    },

    formChange: function(e){
        var data = {};

        if(e.name == 'email'){
            console.log('email');
            if(this.modeCreate)
                data.retour = emailCreateChange(e.value);
            else
                data.retour = emailEditChange(e.value);
            data.email = e.value;
        }
        else if(e.name == 'nom')
            data.nom = e.value;
        else if(e.name == 'prenom')
            data.prenom = e.value;
        this.trigger(data);
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

        console.log('DATA %o',_.cloneDeep(fData));

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

    changePhoto: function(evt){
        console.log('clickImage, evt : %o', evt);
    }
});
module.exports.store = ficheUserStore;

