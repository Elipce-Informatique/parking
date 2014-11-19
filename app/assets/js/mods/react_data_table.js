/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param string url: url AJAX (recupération données)
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-*
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']
 */
var Table = require('./react_table');
module.exports = React.createClass({
    

    render: function() {
        return (
         <Table head={this.props.head} url={this.props.url} hide={this.props.hide}/>
         )
    }
});

