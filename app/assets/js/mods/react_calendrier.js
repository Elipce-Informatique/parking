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
        data: React.PropTypes.array.isRequired
    },


    /**
     * Click sur un element de calendrier
     * @param scope: Week, Moth, Day
     * @param momentDate: date au format moment
     * @param e: event
     */
    handleClick: function (scope, momentDate, e) {
        //Actions.calendrier.add_days()
        console.log('scope %o , moment %o', scope, momentDate);
        if (scope == 'Day') {
            $(e.currentTarget).addClass('bg-success');
            e.stopPropagation();
        }
        else
        if (scope == 'Week') {
            $(e.currentTarget).addClass('bg-error');
            e.stopPropagation();
        }
        else
        if (scope == 'Month') {
            console.log($(e.currentTarget).attr('class'));
            // Attention au week day
            if($(e.currentTarget).hasClass('rc-Month-header'))
            {
                console.log('UUU');
                $(e.currentTarget).addClass('bg-warning');
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
