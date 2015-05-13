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

        prefix: {
            dynamic : 'rc-Day--color-',
            static : 'rc-Day--bg',
            out : 'rc-Day--outside'
        },

        getDefaultProps: function () {
            return {
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
            // Copie de la date
            var currentDate = moment(momentDate);
            // Droit d'écrire dans le calendrier
            if (this.props.editable && !_.isEmpty(this.props.jour)) {
                // Variable
                var retour = {
                    insert: [],
                    delete: [],
                    update: []
                };

                if (scope == 'Day') {
                    // Traite le jour
                    this.processDay($(e.currentTarget), currentDate, retour);
                    e.stopPropagation();
                }
                else if (scope == 'Week' || scope == 'Month') {
                    var temp = momentDate.format();
                    // Parcours des jours de la semaine ou du mois
                    $(e.currentTarget).find('.rc-Day').each(function (index, day) {
                        // La semaine chevauche deux mois
                        if(scope == 'Week' && index === 0 && $(day).hasClass(this.prefix.out)){
                            // Mois +1
                            currentDate = currentDate.add(1, 'M');
                        }
                        // Jour dans le mois sélectionné
                        if(!$(day).hasClass(this.prefix.out)) {
                            // traite le jour
                            this.processDay($(day), currentDate, retour);
                        }
                    }.bind(this));
                    e.stopPropagation();
                }

                //console.log('Action %o', retour);
                // Envoi des infos à la page
                Actions.calendrier.add_days(retour);
            }
        },

        /**
         * Traite le click sur un jour
         * @param caseCalendrier: objet jQuery d'une case calendrier
         * @param momentDate: date au format moment
         * @param retour
         * @returns {*}
         */
        processDay: function (caseCalendrier, momentDate, retour) {
            // Jour hors mois non pris en compte
            if (!caseCalendrier.hasClass(this.prefix.out)) {

                var couleurCase = '';
                // Un jour prédéfini associé à la case
                if (caseCalendrier.hasClass(this.prefix.static)) {
                    caseCalendrier.attr('class', function (index, val) {
                        var tabTemp = val.split(this.prefix.dynamic)
                        if (tabTemp.length === 2) {
                            couleurCase = tabTemp[1];
                            return undefined;
                        }
                    }.bind(this));
                }

                // Construction date
                var temp = {
                    jour: momentDate.get('year') + '-'
                    + _.padLeft(momentDate.get('month') + 1, 2, '0') + '-'
                    + _.padLeft(caseCalendrier.find('span').text(), 2, '0'),
                    jour_calendrier_id: this.props.jour.id
                }
                //console.log('jour: '+temp.jour);

                // Déjà un jour prédéfini associé
                if (couleurCase !== '') {
                    // Même jour prédéfini
                    if (this.props.jour.couleur == couleurCase) {
                        // Suppression du background + classe static
                        var dynRm = this.prefix.dynamic + couleurCase;
                        caseCalendrier.removeClass(dynRm);
                        caseCalendrier.removeClass(this.prefix.static);
                        // Ajout au retour
                        retour.delete.push(temp);
                    }
                    // Jour différent
                    else {
                        // Modification du background
                        var dynRm = this.prefix.dynamic + couleurCase
                        caseCalendrier.removeClass(dynRm);
                        caseCalendrier.addClass(this.prefix.dynamic + this.props.jour.couleur);
                        // Ajout au retour
                        retour.update.push(temp);
                    }
                }
                // Insert
                else {
                    // Ajout background + classe static IMPORTANT d'abord static puis dynamic
                    caseCalendrier.addClass(this.prefix.static);
                    caseCalendrier.addClass(this.prefix.dynamic+this.props.jour.couleur);
                    // Ajout au retour
                    retour.insert.push(temp);
                }
            }
            return retour;
        },

        render: function () {

            // Chargement des jours du calendrier
            var days = _.map(this.props.data, function (jour, index) {
                var modif = {bg: true};
                modif['color-' + jour.calendrier_jour.couleur] = true;
                return (
                    <Day
                        date={moment(jour.jour)}
                        modifiers={modif}
                        key={index}/>
                );
            }, this);


            return (

                <Calendar
                    firstMonth={1}
                    date={moment()}
                    weekNumbers={true}
                    size={12}
                    locale = {Lang.locale()}>
                    <Month onClick={this.handleClick} />
                    <Week onClick={this.handleClick} />
                    <Day
                        onClick={this.handleClick}
                        key="jour_click" />
                {days}
                </Calendar>

            );
        }


    })
    ;
module.exports.Composant = Calendrier;
