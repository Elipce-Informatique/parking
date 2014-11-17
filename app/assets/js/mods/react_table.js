/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param string url: url AJAX (recupération données)
 * @param array data: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 */
module.exports = React.createClass({
    
    componentDidMount: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

    render: function() {
            
            // Variables
            var entete = [];
            var corps = [];
            var table;
            var sEntete;
            var sCorp;
            
            // Entete
            this.props.head.forEach(function(col) {
                entete.push(<td>{col}</td>)
            });
            sEntete = <thead><tr>{entete}</tr></thead>;
            
            // Corps
            
            sCorps = <tbody></tbody>
            
            // Table
             table = 
              <div className="table-responsive">
                <table className="table">
                {sEntete} 
                {sCorps}
                </table>
              </div>
            return table

      // lundi voir http://facebook.github.io/react/docs/thinking-in-react.html#start-with-a-mock
    }
});

