/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 * @param array data: tableau de données ex: [{},{}]
 * @param function beforeUpdate: Fonction de callback executée avant la mise à jour des données
 * @param function afterUpdate: Fonction de callback executée après la mise à jour des données
 * @param object attributes: Attributs HTML TABLE
 * @param object evts: evenements sur les lignes de tableau {onclick:Action 1}
 */

var Table = React.createClass({
    
    mixins: [Reflux.ListenerMixin],
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        data: React.PropTypes.array.isRequired,
        beforeUpdate: React.PropTypes.func,
        afterUpdate: React.PropTypes.func,
        attributes: React.PropTypes.object,
        evts:React.PropTypes.object
    },
    
    getInitialState: function() {
//        console.log('initialize')
        return {data: this.props.data};
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {beforeUpdate:function(){}, afterUpdate:function(){}, attributes:{}, evts:{}};
    },
    
    componentWillMount: function(){           
    },
    
    componentDidMount: function() {
        // Indication que la mise à jour des données a été réalisée
        this.props.afterUpdate();
    },
    
    componentWillReceiveProps: function(){
    },
    
    componentWillUpdate: function(){
        // callback avant mise à jour données
        this.props.beforeUpdate();
    },
    
    componentDidUpdate: function() {
        // Indication que la mise à jour des données a été réalisée
        this.props.afterUpdate();
    },
    
    /**
     * Mise à jour des données via AJAX
     */
//    refreshData: function(){
//        
//        // AJAX
//         $.ajax({
//        url: this.props.url,
//        dataType: 'json',
//        context: this,
//        success: function(data) {
//          this.setState({'data': data});
//        },
//        error: function(xhr, status, err) {
//          console.error(this.props.url, status, err.toString());
//        }
//      });
//    },

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
//            console.log('TABLE render')
            // TABLE
             return( 
              <div className="table-responsive">
                <table className="table" {...id} {...this.props.attributes} {...this.props.evts}>
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