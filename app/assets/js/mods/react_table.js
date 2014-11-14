/**
 * Exemple ultra basique de développement en modules Common JS avec React.
 * Ce module crée un composant écrivant Hello {param} dans un div.
 */
var React = require('react/addons');

module.exports = React.createClass({

    render: function() {
//        return <div>Hello, {this.props.name}!</div>
        return <div class="table-responsive">
                <table class="table">
                  for(var i in data){
                    <tr>
                    for(var j in data[i]){
                        <td>data[i][j]</td>
                    }
                    </tr>
                }
                </table>
              </div>
    }
});