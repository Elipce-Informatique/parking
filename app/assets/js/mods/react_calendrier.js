// COMPOSANTS REACT
var React = require('react/addons');
var Row = ReactB.Row;
var Col = ReactB.Col;
var {Calendar, Month, Week, Day} = require('react-calendar/react-calendar');
var ButtonGroup = ReactB.ButtonGroup;
var Button = ReactB.Button;
// PANEL GAUCHE
var TreeView = require('react-bootstrap-treeview/dist/js/react-bootstrap-treeview');
var Collapse = require('./composants/react_collapse').Collapse;
var CollapseBody = require('./composants/react_collapse').CollapseBody;
var CollapseSidebar = require('./composants/react_collapse').CollapseSidebar;

// LIBS
var moment = require('moment');

/**
 * Formulaire de jours prédéfinis
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param idJours: ID table jour_calendrier
 */
var Calendrier = React.createClass({

    mixins: [Reflux.ListenerMixin],

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        data: React.PropTypes.array.isRequired,
        jour: React.PropTypes.object // Jour prédéfini sélectionné
    },

    getDefaultProps: function(){
        return{
            editable: false,
            data: [],
            jour: {}
        }
    },

    /**
     * Click sur un element de calendrier
     * @param scope: Week, Moth, Day
     * @param momentDate: date au format moment
     * @param e: event
     */
    handleClick: function (scope, momentDate, e) {
        console.log('scope %o , moment %o , couleur '+'#'+this.props.jour.couleur, scope, momentDate);
        console.log('%o',this.props);
        // Droit d'écrire dans le calendrier
        if(this.props.editable && !_.isEmpty(this.props.jour)) {
            //Actions.calendrier.add_days()
            if (scope == 'Day') {

                $(e.currentTarget).css({'background-color': '#'+this.props.jour.couleur});
                e.stopPropagation();
            }
            else if (scope == 'Week') {
                $(e.currentTarget).css('background-color', '#'+this.props.jour.couleur);
                e.stopPropagation();
            }
            else if (scope == 'Month') {
                $(e.currentTarget).css('background-color', '#'+this.props.jour.couleur);
            }
        }
    },

    render: function () {

        return (

            <Calendar
                firstMonth={1}
                date={moment()}
                weekNumbers={true}
                size={12}
                locale = {Lang.locale()}>
                <Month onClick={this.handleClick} />
                <Week onClick={this.handleClick} />
                <Day onClick={this.handleClick} />
            </Calendar>

        );
    }


});
module.exports.Composant = Calendrier;
