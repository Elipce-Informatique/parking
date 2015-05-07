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
        //console.log('scope %o , moment '+momentDate.format()+' , couleur '+'#'+this.props.jour.couleur, scope, momentDate);
        // Droit d'écrire dans le calendrier
        if(this.props.editable && !_.isEmpty(this.props.jour)) {
            // Variable
            var dayBdd = [];

            if (scope == 'Day') {
                // Jour hors mois non pris en compte
                if(!$(e.currentTarget).hasClass('rc-Day--outside')){
                    dayBdd.push(momentDate.format());
                    $(e.currentTarget).css({'background-color': '#'+this.props.jour.couleur});
                }
                e.stopPropagation();
            }
            else if (scope == 'Week' || scope == 'Month') {
                var temp = momentDate.format();
                // Parcours des jours de la semaine
                //console.log('rrr %o',  $(e.currentTarget).find('.rc-Day:not(.rc-Day--outside)'));
                $(e.currentTarget).find('.rc-Day:not(.rc-Day--outside)').each(function(index, day){
                    // coloration
                    $(day).css('background-color', '#'+this.props.jour.couleur);
                    // Construction date
                    temp = momentDate.get('year')+'-'
                            +_.padLeft(momentDate.get('month')+1, 2, '0')+'-'
                            +_.padLeft($(day).find('span').text(), 2, '0');
                    // BDD
                    dayBdd.push(temp);
                }.bind(this));
                e.stopPropagation();
            }

            if(dayBdd.length > 0){
                console.log('Action %o', dayBdd);
                // Envoi des infos à la page
                Actions.calendrier.add_days(dayBdd);
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
