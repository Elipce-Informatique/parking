var React = require('react/addons');
/**
 * Composant permettant d'afficher le libelle du profil avec le tableau des modules correspondant
 *
 *
 *
 *
 *
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


/*********************************************/
/* Composant input pour le libelle du profil */
var React = require('react/addons');
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var Form = Field.Form;

var AuthentMixins = require('./mixins/component_access');
var DataTable = require('./composants/tableau/react_data_table');
var DataTableModuleReact = React.createClass({

    mixins: [Reflux.ListenerMixin, AuthentMixins],

    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        id: React.PropTypes.string.isRequired,  // id du tableau
        idProfil: React.PropTypes.number.isRequired, // profil.id
        nameProfil: React.PropTypes.string.isRequired, // libelle profil
        editable: React.PropTypes.bool.isRequired,
        settings: React.PropTypes.object,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        bUnderline: React.PropTypes.bool,
        reactElements: React.PropTypes.object
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function () {

        return {
            attributes: {},
            evts: {},
            bUnderline: true,
            reactElements: {},
            module_url: 'profils'
        };
    },

    getInitialState: function () {
        return {
            data: [],
            libelle: this.props.nameProfil,
            validationLibelle: {} // Validation métier libelle
        };
    },

    /**
     * Avant le 1er affichage
     * Abonne le composant au store "profilStore"
     * @returns {undefined}
     */
    componentWillMount: function () {

        // Ecoute le store profilStore qui se charge de mettre à jour les données
        this.listenTo(moduleStore, this.majState);

        // Récupère les modules du profil
        Actions.profil.module_update(this.props.idProfil, this.props.nameProfil);
    },

    componentWillReceiveProps: function (newProps) {

        // Récupère les modules du profil
        Actions.profil.module_update(newProps.idProfil, newProps.nameProfil);
    },

    /**
     * Mise à jour de la TABLE
     * @param {type} data
     * @returns {undefined}
     */
    majState: function (data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    render: function () {

        // Attributs du libellé
        var attrs = {
            label: Lang.get('administration.profil.profil'),
            required: true, name: "libelle",
            value: this.state.libelle,
            wrapperClassName: 'col-md-4',
            labelClassName: 'col-md-1',
            groupClassName: 'row'
        };

        // Key du datatable
        var attrTable = {key: "tab_modules"};//+ Math.random()};// TODO trouver l'update

        // On traite les vérifications métiers
        if (this.state.validationLibelle.style != undefined) {
            var attrs2 = {
                bsStyle: this.state.validationLibelle.style,
                'data-valid': this.state.validationLibelle.isValid,
                help: this.state.validationLibelle.tooltip
            };
            attrs = _.merge(attrs, attrs2);

            // Verif false
            if (!this.state.validationLibelle.isValid) {
                // Rechargement du datatable pour le fixedheader car le tooltip (en bas) décale l'en-tête de tableau
                attrTable = {key: Math.random()};
            }
        }

        //console.log('RENDER FORM %o', _.cloneDeep(this.state));
        return (
            <Form
                ref="form_profil"
                attributes  = {{id: 'form_profil'}}
            >
                <InputTextEditable
                    ref="libelle"
                    attributes={attrs}
                    editable={this.props.editable}
                />
                <DataTable
                {...attrTable}
                    id={this.props.id}
                    head={this.props.head}
                    data={this.state.data}
                    hide={this.props.hide}
                    attributes={this.props.attributes}
                    bUnderline={this.props.bUnderline}
                    evts={this.props.evts}
                    reactElements={this.props.reactElements}
                    editable={this.props.editable}/>
            </Form>
        );
    }
});
module.exports.composant = DataTableModuleReact;

/****************************************************************/
/*                          MODULESTORE                         */
/*          Store associé au tableau des modules                */
/****************************************************************/
var moduleStore = Reflux.createStore({
    idProfil: 0,
    libelleInitial: '',
    storeLocal: {
        libelle: '', // libelle du profil
        data: [], // modules du profil
        validationLibelle: {} // Validation métier du champ libelle
    },

    // Initial setup
    init: function () {
        // Charge les données du tableau module à chaque évènement "profil_select"
        this.listenTo(Actions.profil.module_update, this.updateModule);

        // Ecoute de tous les evts validation
        this.listenToMany(Actions.validation);
    },

    /**
     * Calcule les modules associés au profil
     * @param idProfil : ID du profil sélectionné
     */
    updateModule: function (idProfil, libelleProfil) {

        // Mise à jour du state local
        this.idProfil = idProfil;
        this.libelleInitial = libelleProfil
        this.storeLocal.libelle = this.libelleInitial;

        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/' + this.idProfil + '/modules',
            dataType: 'json',
            context: this,
            async: false,
            success: function (dataFromBdd) {

                // Maj state du store
                this.storeLocal.data = dataFromBdd;
                this.storeLocal.validationLibelle = {};

                // Envoi des données au composant react
                this.trigger(this.storeLocal);
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },

    /**
     * onChange de n'importe quel élément du FORM
     * @param obj: {name, value, form}
     */
    onForm_field_changed: function (obj) {
        // Mise à jour du state local
        if (obj.name == 'libelle') {
            this.storeLocal.libelle = obj.value;
        }
    },

    /**
     * Vérifications métier
     * @param obj: {name: .., value: ..., form: ...}
     */
    onForm_field_verif: function (obj) {

        // L'utilisateur est sorti du champ libellé
        if (obj.name == 'libelle') {

            // Le libellé a changé
            if (obj.value != this.libelleInitial) {

                // Param en fonction du mode en édition ou création
                var paramUrl = this.idProfil === 0 ? '' : '/' + this.idProfil;

                // AJAX
                $.ajax({
                    url: BASE_URI + 'profils/libelle/' + obj.value + paramUrl,
                    dataType: 'json',
                    context: this,
                    async: true,
                    success: function (bool) {

                        // Le libellé n'existe pas
                        if (!bool) {
                            // Vert
                            this.storeLocal.validationLibelle = {
                                isValid: true,
                                style: 'success',
                                tooltip: ''
                            }
                        }
                        // Le libellé existe
                        else {
                            // Rouge
                            this.storeLocal.validationLibelle = {
                                isValid: false,
                                style: 'error',
                                tooltip: Lang.get('administration.profil.profilExist')
                            }
                        }

                        // Envoi de data
                        this.trigger(this.storeLocal);
                    },

                    error: function (xhr, status, err) {
                        console.error(status, err.toString());
                    }
                });
            }
        }
    },
    onVerify_form_save: function(){

    },
    onSubmit_form: function(){

    }
});
module.exports.Store = moduleStore;