// COMPOSANTS REACT
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputMailEditable = Field.InputMailEditable;
var react_photo       = require('./composants/react_photo');
var form_data_helper  = require('./helpers/form_data_helper');
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

/**
 * Formulaire de jours prédéfinis
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param idJours: ID table jour_calendrier
 */
var FormJours = React.createClass({

    mixins: [Reflux.ListenerMixin, FormValidationMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        jourData : React.PropTypes.object,
        idJour: React.PropTypes.number
    },
    getDefaultProps: function () {
        return {
            jourData: {}
        }
    },

    getInitialState: function () {
        var retour = {
           'libelle' : '',
            'ouverture' : '',
            'fermeture' : '',
            'couleur' : ''
        };
        return retour;
    },

    componentWillMount: function () {
        // Liaison au store
        this.listenTo(ficheUserStore, this.updateData, this.updateData);

        // Appel du chargement
        Actions.utilisateur.set_etat_create_edit(this.props.idJour==0);
        Actions.utilisateur.set_etat_compte(this.props.modeCompte);

        if(!this.props.modeCompte) {
            Actions.utilisateur.load_user_info(this.props.idJour);
        }
        else{
            var state = {
                nom:    this.props.jourData.nom,
                prenom: this.props.jourData.prenom,
                email:  this.props.jourData.email,
                photo:  this.props.jourData.photo
            };
            Actions.utilisateur.set_initial_state(state);
            this.setState(state);
        }
    },

    componentWillReceiveProps: function(newProps){
        if(this.props.idJour != newProps.idJour)
            Actions.utilisateur.load_user_info(newProps.idJour);
    },

    changePhoto: function (evt){
        var copie = _.clone(evt);
        Actions.utilisateur.changePhoto(copie);
    },

    render: function () {
        

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


        return (
            <Form attributes={{id:"form_utilisateur"}}>
                    <InputTextEditable
                        attributes={{
                            label: Lang.get('calendrier.jours.tableau.nom'),
                            name: "nom",
                            value: this.state.libelle,
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
