/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param string url: url AJAX (recupération données)
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 */
module.exports = React.createClass({
    getInitialState: function() {
        console.log('initialize')
        return {data: []};
    },
    
    componentDidMount: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          context: this,
          success: function(data) {
              console.log('setstate')
            this.setState({'data': data});
          },
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }
        });
      },

    render: function() {
            console.log('render')
            // Variables
            var entete = [];
            var corps = [];
            var table;
            var sEntete;
            var sCorp;
            var tr;
            
            // Entete
            this.props.head.forEach(function(col) {
                entete.push(<td>{col}</td>)
            });
            sEntete = <thead><tr>{entete}</tr></thead>;
            
            // Corps
            this.state.data.forEach(function(user) {
               tr = new Array();
               // Parcours des users
                _.each(user,function(val,key) {
                    var temp = user.id+'_'+key;
                     tr.push(<td key={temp}>{val}</td>);
                });
                // Ajout du tr
                corps.push(<tr>{tr}</tr>)
            });
            sCorps = <tbody>{corps}</tbody>
//            sCorps = <tbody><tr><td>toto</td><td>titi</td></tr></tbody>
            console.log('%o',sCorps)
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

