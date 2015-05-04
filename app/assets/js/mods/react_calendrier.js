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
        treeView: React.PropTypes.array.isRequired,
        jours: React.PropTypes.array.isRequired
    },


    handleClick: function (scope, m, e) {
        if (scope == 'Day') {
            $(e.currentTarget).addClass('bg-success');
        }
    },

    render: function () {
        // Création Treeview
        var treeView = {};
        if (this.props.treeView.length) {
            treeView = (
                <TreeView
                    key="tree"
                    data={this.props.treeView}
                    levels={1}
                    color="#555555"
                    selectedColor="#222222"
                    selectedBackColor='#eeeeee'
                    onLineClicked={Actions.calendrier.parking_selected}
                    isSelectionExclusive={true}
                    treeNodeAttributes={{
                        'data-id': 'parking-id'
                    }}/>);
        }


        return (
            <Collapse isCollapsed={false} align="left" sideWidth={2}>
                <CollapseBody>
                    <Col md={12}>
                        <Row >
                            <Col md={12}>
                                <Row>
                                    <Col md={12}>
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
                    </Col>
                </CollapseBody>
                <CollapseSidebar title="Toto la gouutee">
                {treeView}
                </CollapseSidebar>
            </Collapse>
        );
    }


});
module.exports.Composant = Calendrier;
