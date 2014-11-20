/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param string url: url AJAX (recupération données)
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 */
var Table = React.createClass({
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        url: React.PropTypes.string.isRequired,
        hide: React.PropTypes.array.isRequired
    },
    
    getInitialState: function() {
//        console.log('initialize')
        return {data: []};
    },
    
    componentDidMount: function() {
        this.refreshData();
    },
    
    componentDidUpdate: function() {
    },
    
    /**
     * Mise à jour des données via AJAX
     */
    refreshData: function(){
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
            // Variables
            var corps = [];
            var that = this;
            
            // Parcours des lignes du tableau
            this.state.data.forEach(function(dataLine, index) {
                // Ajout du TR
                corps.push(<TableTr key={index} data={dataLine} hide={that.props.hide}/>)
                
            });
            
            // ID
            var id = {};
            if(this.props.id!=undefined){
                id = {'id':this.props.id}
            }
            
            // TABLE
             return( 
              <div className="table-responsive">
                <table className="table" {...id}>
                <TableHeader head={this.props.head}/>
                <tbody>{corps}</tbody>
                </table>
              </div>
            )
    }
});
module.exports = Table;

/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 */
var TableHeader = React.createClass({
    
    propTypes: {
        head: React.PropTypes.array.isRequired
    },

    render: function() {
        
            // Variables
            var entete = [];
            var that = this;
            
            // Entete
            this.props.head.forEach(function(col,index) {
                entete.push(<td key={index}>{col}</td>)
            });
           return <thead><tr>{entete}</tr></thead>;
            
    }
});

/**
 * @param json data: objet JSON. ex: {id:1, name:toto}
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 */
var TableTr = React.createClass({
    
     propTypes: {
        data: React.PropTypes.object.isRequired,
        hide: React.PropTypes.array.isRequired
    },

    render: function() {
            // Variables
            var tr = [];
            var that = this;
            var attr = {};
               
            // Parcours des data
             _.each(this.props.data,function(val,key) {
                 // Champ caché, on créé un data-key
                 if(that.props.hide.length > 0 && _.indexOf(that.props.hide,key)>-1){
                     attr['data-'+key] = val;
                 }
                 // Cellule de table
                 else{
                      tr.push(<td key={that.props.data.id+key}>{val}</td>);
                  }
             });
             // Ajout du tr
             return <tr {...attr}>{tr}</tr>
           
     
    }
});