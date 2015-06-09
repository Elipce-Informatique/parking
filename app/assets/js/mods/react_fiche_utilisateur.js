// COMPOSANTS REACT
var React = require('react/addons');
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputMailEditable = Field.InputMailEditable;
var react_photo = require('./composants/react_photo');
var PhotoEditable = react_photo.PhotoEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var InputRadioEditable = Field.InputRadioEditable;
var InputPasswordEditable = Field.InputPasswordEditable;
var Form = Field.Form;
var DataTable = require('./composants/tableau/react_data_table');

// HELPERS
var form_data_helper = require('./helpers/form_data_helper');

/**
 * Fiche utilisateur
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param userData: données utilisateur {nom: ..., prenom : ..., ...}
 * @param idUser: id de l'utilisateur affiché dans cette fiche.
 * @param modeCompte: True: compte de l'utilisateur connecté. False: Page utilisateurs
 */
var FicheUser = React.createClass({

    mixins: [Reflux.ListenerMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        userData: React.PropTypes.object,
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
            passNewValue: '',
            passConfirmValue: '',
            passOldValue: '',
            tabProfilHide: true,
            dataEmail: {}// vérifications métier du champ mail
        };
        return retour;
    },

    componentWillMount: function () {
        // Liaison au store
        this.listenTo(ficheUserStore, this.updateData, this.updateData);

        // Mode compte ou page user
        Actions.utilisateur.set_etat_compte(this.props.modeCompte);

        // Page utilisateur
        if (!this.props.modeCompte) {
            // Chargement des infos de l'utilisateur sélectionné
            Actions.utilisateur.load_user_info(this.props.idUser);
        }
        // Compte utilsateur
        else {
            // les data sont passées par props
            var state = {
                nom: this.props.userData.nom,
                prenom: this.props.userData.prenom,
                email: this.props.userData.email,
                photo: this.props.userData.photo
            };
            // Maj state store
            Actions.utilisateur.set_initial_state(state);
            // Maj state composant
            this.setState(state);
        }
    },

    componentWillReceiveProps: function (newProps) {
        // Nouvel utilisateur
        if (this.props.idUser != newProps.idUser) {
            // Chargement des infos utilisateur
            Actions.utilisateur.load_user_info(newProps.idUser);
        }
    },

    /**
     * Changer la photo
     * @param evt
     */
    changePhoto: function (evt) {
        Actions.utilisateur.changePhoto(_.clone(evt));
    },

    /**
     * Mise à jour des données utilisateur
     * @param {object} data
     */
    updateData: function (data) {
        this.setState(data);

    },

    render: function () {
        var emailInitial = this.state.email;

        // Attributs du mail
        var attrs = {
            label: Lang.get('administration.utilisateur.tableau.email'),
            name: "email",
            value: this.state.email,
            required: true,
            wrapperClassName: 'col-md-4',
            labelClassName: 'col-md-1 text-right',
            groupClassName: 'row'
        };

        // Coloration de l'email en fonction des vérifications syntaxiques et métier
        if (!_.isEmpty(this.state.dataEmail)) {
            attrs = _.extend(attrs, {
                bsStyle: this.state.dataEmail.style,
                'data-valid': this.state.dataEmail.isValid,
                help: this.state.dataEmail.tooltip
            });
        }

        var SuiteCode = '';
        var titreBis = '';
        var fctHideShow = null;

        // Montrer ou cacher les profils
        fctHideShow = function (e) {
            Actions.utilisateur.updateHideShowProfil(!this.state.tabProfilHide);
        }.bind(this);


        // MODE COMPTE
        if (this.props.modeCompte && this.props.editable) {

            titreBis = Lang.get('administration.utilisateur.change_password');

            // Attributs des inputs mot de pass
            var attrsPass = {
                wrapperClassName: 'col-md-4',
                labelClassName: 'col-md-2 text-right',
                groupClassName: 'row'
            };

            // Attributs du mot de passe avant modification
            var attrsPassOld = {
                label: Lang.get('administration.utilisateur.password_old'),
                name: "passOld",
                id: "passOld",
                value: this.state.passOldValue
            };

            // Attributs du nouveau mot de passe
            var attrsPassNew = {
                label: Lang.get('administration.utilisateur.password_new'),
                name: "passNew",
                id: "passNew",
                value: this.state.passNewValue
            };

            // Attributs du mot de passe de confirmation
            var attrsPassConfirm = {
                label: Lang.get('administration.utilisateur.password_confirm'),
                name: "passConfirm",
                id: "passConfirm",
                value: this.state.passConfirmValue
            };

            // Coloration du mot de passe confirmé
            if (!_.isEmpty(this.state.passConfirm)) {
                _.extend(attrsPassConfirm, {
                    bsStyle: this.state.passConfirm.style,
                    'data-valid': this.state.passConfirm.isValid,
                    help: this.state.passConfirm.tooltip
                });
            }

            // Coloration du mot de passe avant modification
            if (!_.isEmpty(this.state.passOld)) {
                _.extend(attrsPassOld, {
                    bsStyle: this.state.passOld.style,
                    'data-valid': this.state.passOld.isValid,
                    help: this.state.passOld.tooltip
                });
            }

            // Si nouveau mot de passe, mot de passe actuel obligatoire
            if (this.state.passNewValue != '' || this.state.passConfirmValue != '') {
                _.extend(attrsPassOld, {required: true});
            }

            // Attributs par défaut à tous les champs mot de passe
            _.extend(attrsPassOld, attrsPass);
            _.extend(attrsPassNew, attrsPass);
            _.extend(attrsPassConfirm, attrsPass);

            // On affiche la modification du password
            var password = (
                <span
                    key="span">
                    <InputPasswordEditable
                        key={1}
                        attributes={attrsPassOld}
                        editable={this.props.editable} />
                    <InputPasswordEditable
                        key={2}
                        attributes={attrsPassNew}
                        editable={this.props.editable} />
                    <InputPasswordEditable
                        key={3}
                        attributes={attrsPassConfirm}
                        editable={this.props.editable} />
                </span>);

            // Mot de passes cachés
            if (this.state.tabProfilHide) {
                password = '';
            }
            // Affichage des mots de passe
            SuiteCode = (
                <span>
                    <Row key={1}>
                        <Col md={2}>
                            <h3
                                className="btn btn-default hand-over"
                                onClick={fctHideShow}>
                                {titreBis}
                            </h3>
                        </Col>
                    </Row>
                    <Row
                        key={2}
                        className="marge">
                        <Col md={12}>
                            <ReactCSSTransitionGroup
                                transitionName="tabprofil">
                                {password}
                            </ReactCSSTransitionGroup >
                        </Col>
                    </Row>
                </span>
            );
        }
        // MODE ADMIN
        else if (!this.props.modeCompte) {
            titreBis = Lang.get('administration.utilisateur.profilsAssocie');
            // Radio boutons oui / non dans le tableau de profils
            var aReactElements =
            {
                '1': {
                    type: 'RadioBts',
                    name_prefix: 'profil_',
                    name_dynamic: 'id',
                    libelles: [Lang.get('global.oui'), Lang.get('global.non')],
                    values: ['oui', 'non'],
                    onClick: this.handleClickRadio,
                    checked: 'profil'
                }
            }
            var tableau = <DataTable
                id='dataTableProfils'
                bUnderline={false}
                head={[Lang.get('global.profil'), Lang.get('global.droits')]}
                data={this.state.dataProfil}
                hide={['id']}
                reactElements={aReactElements}
                key="testkey"
                editable={this.props.editable}/>;

            // Tableau des profils caché
            if (this.state.tabProfilHide) {
                tableau = {};
            }

            // On affiche le tableau des profils associés
            SuiteCode = (
                <span>
                    <Row
                        key={1}>
                        <Col md={2}>
                            <h3 className="btn btn-default hand-over" onClick={fctHideShow}>
                                {titreBis}
                            </h3>
                        </Col>
                    </Row>
                    <Row
                        key={2}>
                        <Col md={12} key="colTable">
                            <ReactCSSTransitionGroup
                                transitionName="tabprofil"
                                key="transitionGroupTable">
                            {tableau}
                            </ReactCSSTransitionGroup>
                        </Col>
                    </Row>
                </span>
            );
        }

        // Attributs du formulaire
        var fAttrs = {
            className: "form_utilisateur",
            id: "form_utilisateur"
        };
        // URL de la photo
        var srcPhoto = './app/storage/documents/photo/' + this.state.photo;
        return (
            <Form ref="form" attributes={fAttrs}>
                <Row key="row">
                    <Col md={2}
                        className="photo text-center">
                        <PhotoEditable
                            name="photo"
                            cacheable={false}
                            alertOn={true}
                            src={srcPhoto}
                            evts={{onChange: this.changePhoto}}
                            editable={this.props.editable} />
                    </Col>
                    <Col md={10}>
                        <InputTextEditable
                            key={1}
                            ref="nom"
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
                        <InputTextEditable
                            key={2}
                            attributes={{
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
    }
});
module.exports.Composant = FicheUser;


// Creates a DataStore
var ficheUserStore = Reflux.createStore({

    // Variables
    storeState: {
        nom: '',
        prenom: '',
        email: '',
        photo: 'no.gif',
        passNewValue: '',
        passOldValue: '',
        passConfirmValue: ''
    },
    modeCompte: false,
    emailInitial: '',
    idUser: 0,

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.load_user_info, this.getInfosUser);
        this.listenTo(Actions.utilisateur.save_user, this.sauvegarder);// Envoyé de PageUser sur submit_form
        this.listenTo(Actions.utilisateur.delete_user, this.supprimer);
        this.listenTo(Actions.utilisateur.updateHideShowProfil, this.updateHideShowProfil);
        this.listenTo(Actions.utilisateur.set_etat_compte, this.set_etat_compte);
        this.listenTo(Actions.utilisateur.set_initial_state, this.set_initial_state);

        this.listenTo(Actions.validation.form_field_changed, this.formChange);
        this.listenTo(Actions.validation.form_field_verif, this.formVerif);
    },

    set_initial_state: function (data) {
        this.storeState = data;
        this.emailInitial = data['email'];
        //console.log('this.emailInitial : %o', this.emailInitial);
    },

    set_etat_compte: function (bool) {
        this.modeCompte = bool;
    },

    updateHideShowProfil: function (bool) {
        this.trigger({tabProfilHide: bool});
    },

    formChange: function (e) {
        var data = {};

        // Mise à jour du state
        switch (e.name) {

            case 'email':
                data.email = e.value;
                break;
            case 'nom':
                data.nom = e.value;
                break;
            case 'prenom':
                data.prenom = e.value;
                break;
            case 'passNew':
                data.passNewValue = e.value;
                break;
            case 'passOld':
                data.passOldValue = e.value;
                break;
            case 'passConfirm':
                data.passConfirmValue = e.value;
                break;
            case 'photo':
                //data.photo = e.value;
                break;
            default:
                break;
        }

        this.storeState = _.extend(this.storeState, data);
        this.trigger(this.storeState);
    },

    /**
     * Vérifications "Métiers" du formulaire
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    formVerif: function (e) {
        var data = {};

        // VÉFIR ADRESSE MAIL:
        if (e.name == 'email') {
            data = this.emailChange(e.value);
        }
        else if (e.name == 'passNew') {
            data = this.verifPassNew(e.value, $('#passConfirm')[0].value);
        }
        else if (e.name == 'passOld') {
            data = this.verifPassOld(e.value);
        }
        else if (e.name == 'passConfirm') {
            data = this.verifPassNew(e.value, $('#passNew')[0].value);
        }

        // Maj state local
        this.storeState = _.extend(this.storeState, data);
        // Envoi data au comosant react
        this.trigger(this.storeState);
    },

    // Callback
    getInfosUser: function (idUser) {

        this.idUser = idUser;
        // Etat par défaut
        this.storeState = {
            nom: '',
            prenom: '',
            email: '',
            photo: 'no.gif',
            passNewValue: '',
            passOldValue: '',
            passConfirmValue: ''
        };
        this.emailInitial = '';

        // AJAX
        $.ajax({
            url: BASE_URI + 'utilisateur/profil/' + this.idUser,
            dataType: 'json',
            context: this,
            success: function (data) {
                // Merge des data et du store local
                this.storeState = _.extend(this.storeState, data);
                //console.log('STOR %o',this.storeState);
                this.emailInitial = data.email;
                // Nom et prénom renseignés
                if (data.nom != '' && data.prenom != '') {
                    // Mise à jour du bandeau de la Page Utilisateur
                    Actions.utilisateur.updateBandeau(data.nom, data.prenom, this.idUser);
                }
                // Data user + profils
                this.trigger(this.storeState);
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.trigger({id: 0});
            }
        }, this);
    },

    /**
     * Appellé quand on clique sur le bouton sauvegarder
     * @param idUser
     */
    sauvegarder: function (idUser) {
        // Variables
        var url = idUser === 0 ? '' : idUser;

        // Page compte
        if (this.modeCompte) {
            url = BASE_URI + 'moncompte';
        }
        // Page utilisateur
        else {
            url = BASE_URI + 'utilisateur/' + url;
        }

        //console.log('SAVE '+idUser+' URL '+url);
        var method = idUser === 0 ? 'POST' : 'PUT';

        // RÉCUPÉRATION DES DONNÉES
        var fData = form_data_helper('form_utilisateur', method);
        fData.append('photo', $("[name=photo]")[0].files[0]);

        // Requête
        $.ajax({
            url: url,
            type: 'POST',
            data: fData,
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            success: function (tab) {
                // Sauvegarde OK
                if (tab.save) {
                    // Notifiction verte
                    Actions.notif.success(Lang.get('global.notif_success'));

                    Actions.utilisateur.saveOK(parseInt(tab.idUser));
                    Actions.utilisateur.load_user_info(parseInt(tab.idUser));
                }
                // Mots de passes différents
                else if (tab.pass !== undefined) {
                    Actions.notif.error(Lang.get('administration.utilisateur.oldPassConfirmError'));
                }
                // Erreur SQL
                else {
                    Actions.notif.error(Lang.get('global.notif_erreur'));
                }
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error('AJAX : ' + Lang.get('global.notif_erreur'));
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
                // Notifiction verte
                Actions.notif.success(Lang.get('global.notif_success'));
                Actions.utilisateur.supprOK();
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.trigger({});
            }
        });
    },

    /**
     * Vérification de l'unicité de l'e-mail en BDD
     * @param value: email saisi par le user
     * @returns {{}}
     */
    emailChange: function (value) {

        var retour = {dataEmail: {}};
        // Email supérieur à 6 caractères + pas de modification du mail
        if (value.length >= 6 && value != this.emailInitial) {

            // Mode édition => ne pas prendre en compte le mail du user actuel
            var url = this.idUser === 0 ? '' : '/' + this.idUser;

            // AJAX
            $.ajax({
                url: BASE_URI + 'utilisateur/email/' + value + url,
                dataType: 'json',
                context: this,
                async: false,
                success: function (mailExists) {
                    // Mail unique
                    if (!mailExists) {
                        // Champ vert
                        retour.dataEmail = {
                            isValid: true,
                            style: 'success',
                            tooltip: ''
                        };
                    }
                    // Mail existe déjà
                    else {
                        // Champ rouge
                        retour.dataEmail = {
                            isValid: false,
                            style: 'error',
                            tooltip: Lang.get('global.utilisateurExist')
                        };
                    }
                },
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
        return retour
    },

    verifPassOld: function (value) {
        var retour = {passOld: {}};

        if (value.length >= 6) {
            // AJAX
            $.ajax({
                url: BASE_URI + 'moncompte/verifMPD/' + value, /* correspond au module url de la BDD */
                dataType: 'json',
                context: this,
                async: false,
                success: function (bool) {
                    // Mot de passe erroné
                    if (!bool) {
                        retour.passOld = {
                            isValid: false,
                            style: 'error',
                            tooltip: Lang.get('administration.utilisateur.oldPassConfirmError')
                        };
                    }
                    // Mot de passe OK
                    else {
                        // Vert
                        retour.passOld = {
                            isValid: true,
                            style: 'success',
                            tooltip: ''
                        };
                    }
                },

                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
        return retour;
    },

    verifPassNew: function (value1, value2) {
        var retour = {passConfirm: {}};
        // Mot de passe vide
        if (value1 === '' || value2 === '') {
            retour.passConfirm = {
                isValid: false,
                style: 'default',
                tooltip: ''
            }
        }
        // Mot de passe de confirmation différent de la confirmation
        else if (value1 != value2) {
            // Attributs de validation du mot de passe de confirmation
            retour.passConfirm = {
                isValid: false,
                style: 'error',
                tooltip: Lang.get('administration.utilisateur.newPassConfirmError')
            }
        }
        // Mot de passe de confirmation identique
        else {
            retour.passConfirm = {
                isValid: true,
                style: 'success',
                tooltip: ''
            }
        }
        return retour;
    }

});
module.exports.store = ficheUserStore;
