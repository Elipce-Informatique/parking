var Row = ReactB.Row;
var Col = ReactB.Col;
var Panel = ReactB.Panel;

/**
 * Created by yann on 20/02/2015.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 */
var ZoneTempsReel = React.createClass({

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var title = 'Header panel';
        return (
            <Row>
                <Col md={3}>
                    <Panel header={title} bsStyle="primary">
                        Panel content
                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel header={title} bsStyle="primary">
                        Panel content
                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel header={title} bsStyle="primary">
                        Panel content
                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel header={title} bsStyle="primary">
                        Panel content
                    </Panel>
                </Col>
            </Row>);
    }
});

module.exports = ZoneTempsReel;