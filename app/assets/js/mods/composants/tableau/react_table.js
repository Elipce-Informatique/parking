/* Pour les radio boutons */
var ButtonGroup = ReactB.ButtonGroup;
var Field              = require('../formulaire/react_form_fields');
var InputRadioBootstrap         = Field.InputRadioBootstrap;
var InputRadioBootstrapEditable = Field.InputRadioBootstrapEditable;

/**
 * @param array head: array contenant l'entête du tableau ['A', 'B']
 * @param array hide: les clés de la requêtes SQL AJAX qui ne sont pas affichées dans le tableau et pour lesquelles on créé un data-* 
 *                    ex: l'url AJAX retourne les données suivantes {'id':1, 'nom':'PEREZ', 'prenom':'Vivian'}
 *                        var data = ['id']   
 * @param array data: tableau de données ex: [{},{}]
 * @param object attributes: Attributs HTML TABLE
 * @param object evts: évènements sur les lignes de tableau {onClick:function(}{}} ATTENTION: les clés correspondent aux noms d'évènements HTML case sensitive.
 * @param object reactElements: voire composant react 'TableTr'
 */

var Table = React.createClass({
    
    propTypes: {
        head: React.PropTypes.array.isRequired,
        hide: React.PropTypes.array.isRequired,
        data: React.PropTypes.array.isRequired,
        attributes: React.PropTypes.object,
        evts:React.PropTypes.object,
        reactElements: React.PropTypes.object,
        editable:React.PropTypes.bool
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {attributes:{}, evts:{}, reactElements:{}, editable:false};
    },

    render: function() {
            // Variables
            var corps = [];
            var that = this;
            
            // Parcours des lignes du tableau
            this.props.data.forEach(function(dataLine, index) {
                // Ajout du TR
                corps.push(<TableTr key={index} data={dataLine} hide={that.props.hide} evts={that.props.evts} reactElements={that.props.reactElements} editable={that.props.editable} />)
            });
            
            // ID
            var id = {};
            if(this.props.id!=undefined){
                id = {'id':this.props.id}
            }
            // TABLE
             return( 
              <p className="table-responsive">
                <table className="table display" width="100%" {...id} {...this.props.attributes} >
                <TableHeader head={this.props.head}/>
                <tbody>{corps}</tbody>
                </table>
              </p>
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
 * @param object reactElements: défini les propriétés des éléments react à afficher dans la colonne
 *                              {indiceColonne0:['NomDuComposantReact1',{paramètres du composant NomDuComposantReact1}],
 *                               indiceColonne2:['NomDuComposantReact2',{paramètres du composant NomDuComposantReact2}],
 *                               indiceColonne5:['NomDuComposantReact1',{paramètres du composant NomDuComposantReact1}]
 *                              }
 */
var TableTr = React.createClass({
    
     propTypes: {
        data: React.PropTypes.object.isRequired,
        hide: React.PropTypes.array.isRequired,
        evts: React.PropTypes.object,
        reactElements: React.PropTypes.object,
        editable:React.PropTypes.bool
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {reactElements:{}};
    },

    render: function() {
            // Variables
            var tr        = [];
            var that      = this;
            var attr      = {};
            var indiceCol = 0;

            // Parcours des data
             _.each(this.props.data,function(val,key) {
                 // Champ caché, on créé un data-key
                 if(that.props.hide.length > 0 && _.indexOf(that.props.hide,key)>-1){
                     attr['data-'+key] = val;
                 }
                 // Cellule de la ligne
                 else{
                     /* Cellule contenant un élément React */
                     if(that.props.reactElements !== 'undefined' && Array.isArray(that.props.reactElements[indiceCol.toString()])){

                        switch(that.props.reactElements[indiceCol.toString()][0]){
                            case 'Radio':
                                var radios   = [];
                                var indice   = 0;

                                _.each(that.props.reactElements[indiceCol.toString()][1]['name'], function(val2, key){
                                    var etat     = that.props.reactElements[indiceCol.toString()][1]['name'][indice];
                                    var libelle  = that.props.reactElements[indiceCol.toString()][1]['libelle'][indice++];
                                    var classBtn = '';

                                    /* Si l'état correspond à la valeur du btn, on l'active */
                                    if(val == etat || (etat == 'null' && val == null))
                                        classBtn += 'active';

                                    var attributes = {'data-id':that.props.data.id, 'data-etat':etat, 'value':etat, className:classBtn};

                                    radios.push(<InputRadioBootstrapEditable key={'IR' + that.props.data.id + key} editable={that.props.editable} attributes={attributes}>
                                                    {libelle}
                                    </ InputRadioBootstrapEditable>);
                                });
                                tr.push(<td key={that.props.data.id+key}>
                                            <ButtonGroup data-toggle="buttons" bsSize="xsmall">{radios}</ButtonGroup>
                                        </td>);
                                break;
                            default :
                                tr.push(<td key={that.props.data.id+key}>Objet React --{that.props.reactElements[indiceCol.toString()][0]}-- non défini</td>);
                                break;
                        }
                     }
                     /* Cellule "normal", un champ texte */
                     else
                        tr.push(<td key={that.props.data.id+key}>{val}</td>);
                     indiceCol++;
                  }
             });
             // Ajout du tr
             return <tr {...attr} {...this.props.evts}>{tr}</tr>
           
     
    },
    
    /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */

});