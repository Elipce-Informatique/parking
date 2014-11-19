/**
 * Created by yann on 18/11/2014.
 * Composant de base du menu top utilisateur
 *
 * @param name : nom a afficher dans le composant
 */
var MenuTop = React.createClass({
    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {
        // Dans l'exemple, on garde en initial les props
        // passées lors de l'appel du composant.
        return {nom: ""};
    },
    /**
     * Callback appelé lorsque le composant est affiché.
     * C'est par exemple ici qu'on peut faire un appel ajax pour
     * charger ses données dynamiquement !
     */
    componentDidMount: function () {
        this.setState({nom: "Hack du Nom passé via setState"})
    },
    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        console.log('Pass render');
        return <div>Hello
            <strong>{this.state.nom}</strong>
        (Nom passé en propriété : {this.props.name}) !</div>
    }
});

module.exports = MenuTop;