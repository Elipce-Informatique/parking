// Gestion du temps
var React = require('react/addons');
var moment = require('moment');
require('moment/locale/fr');
moment.locale(Lang.locale());

// Chargement des composants React Bootstrap
var Row = ReactB.Row;
var Col = ReactB.Col;
var Panel = ReactB.Panel;
var Label = ReactB.Label;
var Badge = ReactB.Badge;
var Glyph = ReactB.Glyphicon;

/**
 * Created by yann on 11/06/2015.
 * ce composant ne peut être géré comme le tableau de bord car il est placé
 * dans un treeview. Il est donc détruit et réinit à chaque pliage / dépliage
 */
var ZoneTempsReel = React.createClass({
    mixins: [Reflux.ListenerMixin],

    propTypes: {
        plan_id: React.PropTypes.string.isRequired,
        vertical: React.PropTypes.bool,
        data: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {vertical: false};
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
        var md = this.props.vertical ? 12 : 3;
        var style = {};
        if (this.props.vertical) {
            style = {
                height: '50%'
            };
        }
        return (
            <Row className="row_temps_reel full-height">
                <Col md={md} style={style}>
                    <PanelJournal
                        title={Lang.get('administration_parking.treel.journal')}
                        data={this.props.data.journal}
                    />
                </Col>
                <Col md={md} style={style}>
                    <PanelAlertes
                        title={Lang.get('administration_parking.treel.alerte')}
                        data={this.props.data.alertes}
                    />
                </Col>
            {/*<Col md={md} {...style}>
             <Panel
             header={<strong>{Lang.get('administration_parking.treel.anomalie')}</strong>}
             bsStyle="default"
             className="treel-anomalie full-height">
             <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 01-03-128 ne fonctionne plus."/>
             <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 04-02-136 ne fonctionne plus."/>
             <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 01-05-037 ne fonctionne plus."/>
             <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 03-06-201 ne fonctionne plus."/>
             <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 03-00-205 ne fonctionne plus."/>
             <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 01-08-209 ne fonctionne plus."/>
             <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 02-04-204 ne fonctionne plus."/>
             </Panel>
             </Col>*/}
            </Row>
        );
    }
});

/**
 * Created by yann on 15/04/2015.
 */
var PanelJournal = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    }
    ,

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var messages = _.map(this.props.data, function (d) {
            var message = '';
            var bsStyle = '';
            var glyph = '';

            // Création du message et bsStyle
            if (d.etat_occupation.is_occupe == "1") {
                message = Lang.get('supervision.temps_reel.j_place_occupee');
                bsStyle = 'danger';
                glyph = 'minus-sign';
            }
            else {
                message = Lang.get('supervision.temps_reel.j_place_libre');
                bsStyle = 'success';
                glyph = 'ok-sign';
            }
            message = message.split('[-]');
            var libelle = <b> {d.libelle} </b>;

            // TRANSFORMATION DE LA DATE EN BDD EN DATE LOCALE
            var time = moment.utc(d.latest_journal_equipement.date_evt)
                .local()
                .format('LT');

            var retour = (
                <AlertMessage
                    bsStyle={bsStyle}
                    label={<Glyph glyph={glyph}/>}
                    datetime={time}
                    message={<span>{message[0]} {libelle} {message[1]}</span>}
                    key={d.latest_journal_equipement.id}
                />);
            return retour;

        });

        // Affichage des derniers messages en permier
        var messages = _(messages).reverse().value();

        return (
            <Panel
                header={<strong>{this.props.title}</strong>}
                bsStyle="default"
                className="treel-journal full-height" >
                    {messages}
            </Panel>);
    }
});

/**
 * Created by yann on 15/04/2015.
 *
 * TODO tout traduire et lier le state aux données réelles
 * @param name : nom a afficher dans le composant
 */
var PanelAlertes = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    }
    ,

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        //var messages = _.map(this.props.data, function (d) {
        //    // RÉCUP DU MESSAGE
        //    var message = d.alerte.message;
        //    var bsStyle = '';
        //    var glyph = '';
        //
        //    // TODO GÉNÉRATION DU STYLE
        //    switch (d.alerte.type.code) {
        //        case 'full':
        //
        //            break;
        //        case 'change':
        //
        //            break;
        //    }
        //
        //    // GÉNÉRATION DU GLYPH
        //
        //    // TRANSFORMATION DE LA DATE EN BDD EN DATE LOCALE
        //    var time = moment.utc(d.date_journal)
        //        .local()
        //        .format('LT');
        //
        //    var retour = (
        //        <AlertMessage
        //            bsStyle={bsStyle}
        //            label={<Glyph glyph={glyph}/>}
        //            datetime={time}
        //            message={<span>{message[0]} {libelle} {message[1]}</span>}
        //            key={d.latest_journal_equipement.id}
        //        />);
        //    return retour;
        //
        //});
        //console.log('DATA ALERTES = %o', this.props.data);
        //
        //
        //// Affichage des derniers messages en permier
        //var messages = _(messages).reverse().value();
        //
        return (
            <Panel
                header={<strong>{this.props.title}</strong>}
                bsStyle="default"
                className="treel-journal full-height" >
            </Panel>);
    }
});

/**
 * Created by yann on 23/02/2015.
 */
var AlertMessage = React.createClass({

    propTypes: {
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        message: React.PropTypes.string.isRequired,
        datetime: React.PropTypes.string,
        bsStyle: React.PropTypes.string
    },

    getDefaultProps: function () {

        return {
            bsStyle: "default",
            datetime: moment().format('LT')
        };
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
        return (<span className="alert-message-wrapper">
            <Label bsStyle="default">{this.props.datetime}</Label>
            <Label bsStyle={this.props.bsStyle}>{this.props.label}</Label>
            <span className="alert-message"> {this.props.message}</span>
            <br/>
        </span>);
    }
});


module.exports = ZoneTempsReel;
