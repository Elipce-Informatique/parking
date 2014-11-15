/**
 * Exemple ultra basique de développement en modules Common JS avec React.
 * Ce module crée un composant écrivant Hello {param} dans un div.
 */
module.exports = React.createClass({

    render: function() {
        return <div>Hello, {this.props.name}!</div>
    }
});