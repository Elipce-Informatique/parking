/**
 * @param array data: données du tableau
 */
var React = require('react/addons');
var AuthentMixins = require('./mixins/component_access');
var DataTableBandeau = require('./composants/tableau/react_data_table_bandeau');

var DataTableBandeauJourReact = React.createClass({

    mixins: [Reflux.ListenerMixin, AuthentMixins],

    head: [Lang.get('calendrier.jours.tableau.nom'), Lang.get('calendrier.jours.tableau.ouvert'), Lang.get('calendrier.jours.tableau.fermer'), Lang.get('calendrier.jours.tableau.couleur')],
    hide: ['id'],
    aReactElements: {
        '3': {type: 'Couleur'}
    },
    // evts ne pas mettre ici car this.displayJours n'est pas encore connu


    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function () {

        return {
            module_url: 'calendrier_jours'
        };
    },


    render: function () {

        return (
            <DataTableBandeau
                id="tab_jours"
                head={this.head}
                reactElements={this.aReactElements}
                data={this.props.data}
                hide={this.hide}
                attributes={this.attributes}
                bUnderline={true}
                evts={{onClick: this.displayJours}}/>
        )
    },

    /*
     |--------------------------------------------------------------------------
     | FONCTIONS NON REACT
     |--------------------------------------------------------------------------
     */
    /**
     * Mise à jour de la TABLE
     * @param {type} data
     * @returns {undefined}
     */
    updateData: function (data) {
        // MAJ data
        this.setState({
            data: data
        });
    },

    displayJours: function (e) {
        // Ligne du tableau
        var id = $(e.currentTarget).data('id');
        Actions.jours.display_detail_jour(id);
    }
});

module.exports.Composant = DataTableBandeauJourReact;