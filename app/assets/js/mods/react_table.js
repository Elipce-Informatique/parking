/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 * @param array data: tableau de données ex: [{},{}]
 * @param object attributes: Attributs HTML TABLE
 * @param object evts: évènements sur les lignes de tableau {onClick:function(}{}} ATTENTION: les clés correspondent aux noms d'évènements HTML case sensitive.
 */

var Table = React.createClass({
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        data: React.PropTypes.array.isRequired,
        attributes: React.PropTypes.object,
        evts:React.PropTypes.object,
        onDataTableLineClick: React.PropTypes.func
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {attributes:{}, evts:{}, onDataTableClick:{}};
    },

    render: function() {
            // Variables
            var corps = [];
            var that = this;
            
            // Parcours des lignes du tableau
            this.props.data.forEach(function(dataLine, index) {
                // Ajout du TR
                corps.push(<TableTr key={index} data={dataLine} hide={that.props.hide} evts={that.props.evts} onDataTableClick={that.props.onDataTableLineClick}/>)
            });
            
            // ID
            var id = {};
            if(this.props.id!=undefined){
                id = {'id':this.props.id}
            }
            // TABLE
             return( 
              <div className="table-responsive">
                <table className="table" {...id} {...this.props.attributes} >
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
        hide: React.PropTypes.array.isRequired,
        evts:React.PropTypes.object,
        onDataTableClick:React.PropTypes.func
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
             return <tr {...attr} {...this.props.evts} onClick={this.handleClick}>{tr}</tr>
           
     
    },
    
    /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */
    handleClick: function(e){
        console.log('tr.handleClick');
        // Appel du click
        this.props.onDataTableClick(e);
    }
});