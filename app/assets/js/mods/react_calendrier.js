// COMPOSANTS REACT
var React = require('react/addons');
var Row = ReactB.Row;
var Col = ReactB.Col;
var {Calendar, Month, Week, Day} = require('react-calendar/react-calendar');
var ButtonGroup = ReactB.ButtonGroup;
var Button = ReactB.Button;

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
        editable: React.PropTypes.bool.isRequired
    },


    handleClick: function (scope, m, e) {
        if(scope == 'Day'){
            $(e.currentTarget).addClass('bg-success');
        }
    },

    render: function () {

        return (
            <Row >
                <Col md={12}>
                    <Row>
                        <Col md={12}>
                            <ButtonGroup>
                                <Button>Left</Button>
                                <Button>Middle</Button>
                                <Button>Right</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Calendar
                                firstMonth={1}
                                date={moment("2015-01-01")}
                                weekNumbers={true}
                                size={12}
                                locale = "fr">
                                <Day onClick={this.handleClick} />
                                <Month date={moment()}
                                    modifiers={{current: true}}/>
                                <Day
                                    date={moment()}
                                    modifiers={{current: true}}
                                    onClick={this.handleClick}/>
                            </Calendar>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }


});
module.exports.Composant = Calendrier;
