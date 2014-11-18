/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param string url: url AJAX (recupération données)
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 */
module.exports = React.createClass({
    getInitialState: function() {
//        console.log('initialize')
        return {data: []};
    },
    
    componentDidMount: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          context: this,
          success: function(data) {
//              console.log('setstate')
            this.setState({'data': data});
          },
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }
        });
      },

    render: function() {
//            console.log('render')
            // Variables
            var entete = [];
            var corps = [];
            var table;
            var sEntete;
            var sCorp;
            var tr;
            var that = this;
            
            // Entete
            this.props.head.forEach(function(col) {
                entete.push(<td>{col}</td>)
            });
            sEntete = <thead><tr>{entete}</tr></thead>;
            
            // Corps
            this.state.data.forEach(function(user) {
               tr = [];
               attr = {};
               
               // Parcours des users
                _.each(user,function(val,key) {
                    // Champ caché, ojn créé un data-key
                    if(that.props.hide.length > 0 && _.indexOf(that.props.hide,key)>-1){
                        attr['data-'+key] = val;
                    }
                    // Cellule de table
                    else{
                        var temp = user.id+'_'+key;
                         tr.push(<td key={temp}>{val}</td>);
                     }
                });
                // Ajout du tr
                corps.push(<tr {...attr}>{tr}</tr>)
            });
            sCorps = <tbody>{corps}</tbody>
            // Table
             table = 
              <div className="table-responsive">
                <table className="table">
                {sEntete}
                {sCorps}
                </table>
              </div>
            return table
    }
});

