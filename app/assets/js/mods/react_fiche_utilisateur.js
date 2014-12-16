var Input = require('./composants/formulaire/react_input');
var InputTextEditable = Input.InputTextEditable;
var InputMailEditable = Input.InputMailEditable;
var PhotoEditable = require('./react_photo');
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var Glyphicon = ReactB.Glyphicon;
var AuthentMixins = require('./mixins/component_access');
// TEST
var InputRadioEditable = Input.InputRadioEditable;


/**
 * Fiche utilisateur
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var FicheUser = React.createClass({

    mixins: [Reflux.ListenerMixin,AuthentMixins],

    propTypes: {
        editable:React.PropTypes.bool.isRequired,
        idUser: React.PropTypes.number
    },

    getInitialState: function(){
        return {data:{}};
    },

    componentWillMount: function(){
        this.listenTo(ficheStore, this.updateData, this.updateData);
        // Appel action
        Actions.utilisateur.display_user(this.props.idUser);
    },

    render: function() {
        //console.log('STATE FICHE USER %o',this.state);
        var boutons = '';
        if(this.props.editable){

            boutons =
                (<Row>
                    <Col md={8} className="text-left">
                        <ButtonToolbar>
                            <Button bsStyle="primary" bsSize="xsmall"><Glyphicon glyph="floppy-saved"/>{Lang.get('global.save')}</Button>
                            <Button bsSize="xsmall"><Glyphicon glyph="arrow-left"/>{Lang.get('global.back')}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
                )
        }

        return (
            <div>
                {boutons}
                <Row>
                    <Col md={6} className="text-center">
                        <h2>{Lang.get('administration.utilisateur.fiche')+this.state.data.nom+' '+this.state.data.prenom}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={1} mdOffset={2} className="photo">
                        <PhotoEditable src={BASE_URI+this.state.data.photo} editable={this.props.editable}/>
                        <InputTextEditable attributes={{label:Lang.get('administration.utilisateur.tableau.nom'),name:"nom", value:this.state.data.nom, wrapperClassName:'col-md-4',labelClassName:'col-md-2 text-right',groupClassName:'row'}} editable={this.props.editable} />
                        <InputTextEditable attributes={{label:Lang.get('administration.utilisateur.tableau.prenom'),name:"prenom", value:this.state.data.prenom, wrapperClassName:'col-md-4',labelClassName:'col-md-2 text-right',groupClassName:'row'}} editable={this.props.editable} />
                        <InputMailEditable attributes={{label:Lang.get('administration.utilisateur.tableau.email'),name:"email", value:this.state.data.email, wrapperClassName:'col-md-4',labelClassName:'col-md-2 text-right',groupClassName:'row'}} editable={this.props.editable} />
                        <InputRadioEditable attributes={{label:'Radio',name:"rad", value:"test", wrapperClassName:'col-md-4',labelClassName:'col-md-2 text-right',groupClassName:'row'}} editable={this.props.editable} />
                    </Col>
                </Row>
            </div>
        );
    },

    /**
     * Mise à jour des données utilisateur
     * @param {object} data
     */
    updateData: function(data) {
        // MAJ data
        this.setState({
            data: data
        });
    }
});
module.exports = FicheUser;


// Creates a DataStore
var ficheStore = Reflux.createStore({

    // Initial setup
    init: function() {
        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.display_user, this.getInfosUser);

    },

    // Callback
    getInfosUser: function(idUser) {
        //console.log('STORE id '+idUser);
        // AJAX
        $.ajax({
            url: BASE_URI+'utilisateur/'+idUser,
            dataType: 'json',
            context: this,
            success: function(data) {
                // Passe variable aux composants qui écoutent l'action actionLoadData
                this.trigger(data);
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
                this.trigger({});
            }
        });
    }
});