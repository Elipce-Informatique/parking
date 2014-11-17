/**
 * Exemple ultra basique de développement en modules Common JS avec React.
 * Ce module crée un composant écrivant Hello {param} dans un div.
 */
module.exports = React.createClass({

    render: function() {
        
//        return <div>test</div> // OK chaine en dur
//        return <div>{this.props.data}</div> //OK si data est une chaine ou une variable
//        return <div class="table-responsive">
//                <table class="table">
//                 
//                     <tr>
//                        <td>{this.props.data[0]['nom']}</td>
//                        <td>{this.props.data[0]['prenom']}</td>
//                    </tr>
//                    <tr>
//                        <td>{this.props.data[1]['nom']}</td>
//                        <td>{this.props.data[1]['prenom']}</td>
//                    </tr>
//                
//                </table>
//              </div> // OK mais on perd la classe

//        return <div class="table-responsive">
//                <table class="table">
//                  for(var i in {this.props.data}){
//                    <tr>
//                    for(var j in {this.props.data[i]}){
//                        <td>{this.props.data[i][j]}</td>
//                    }
//                    </tr>
//                }
//                </table>
//              </div> // KO pas de FOR natif
            
            var corps = [];
            this.props.data.forEach(function(tr) {
                corps.push(<tr><td>{tr.nom}</td><td>{tr.prenom}</td></tr>);
            });
              return <div class="table-responsive">
                <table class="table">
                {corps}
                </table>
              </div> // KO pas de FOR natif

      // lundi voir http://facebook.github.io/react/docs/thinking-in-react.html#start-with-a-mock
    }
});

