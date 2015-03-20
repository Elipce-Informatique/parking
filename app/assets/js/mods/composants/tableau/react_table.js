var React = require('react/addons');
var RadioGroup = ReactB.RadioGroup;
var Field                       = require('../formulaire/react_form_fields');
var InputRadioBootstrapEditable = Field.InputRadioBootstrapEditable;
var InputRadioEditable          = Field.InputRadioEditable;

/*********************/
/* Composant couleur */
var react_color = require('../react_color');
var ColorPicker = react_color.ColorPicker;

/*******************/
/* Composant image */
var react_photo = require('../react_photo');
var Image       = react_photo.Photo;

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

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
                corps.push(
                    <TableTr
                        key={index}
                        data={dataLine}
                        hide={that.props.hide}
                        evts={that.props.evts}
                        reactElements={that.props.reactElements}
                        editable={that.props.editable} />)
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
*        indiceColonne: {
            type: 'RadioBts',
            names: ['visu', 'modif', 'null'],
            libelles : [libVisu, libModif, LibNull],
            values : 'id',
            checked : 'visu'
            onClick: handleClickRadio
        }
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
        return {reactElements:null};
    },

    render: function() {
            // Variables
            var tr        = [];
            var attr      = {};
            var indiceCol = 0;

            // Parcours des data
             _.each(this.props.data,function(val,key) {
                 // Champ caché, on créé un data-key
                 if(this.props.hide.length > 0 && _.indexOf(this.props.hide,key)>-1){
                     attr['data-'+key] = val;
                 }
                 // Cellule de la ligne
                 else{
                     /* Cellule contenant un élément React */
                     if(_.isPlainObject(this.props.reactElements[indiceCol.toString()])){
                         // Element react en cours de traitement
                         var reactEltCourant = this.props.reactElements[indiceCol.toString()];
                         // Variable radio bootstrap
                        var isRadioBts = true;
                         // Les différents types
                        switch(reactEltCourant.type){
                            case 'Couleur':
                                tr.push(<td key={this.props.data.id + key}>
                                            <ColorPicker color={val} />
                                        </td>);
                                break;
                            case 'Image':
                                var img = '';
                                var src = this.props.reactElements[indiceCol.toString()][1] + val;
                                if(val != '') {
                                    var splitterStyle = {
                                        height: "20px",
                                        width: "20px"
                                    };
                                    img = <div style={splitterStyle}>
                                        <Image src={src} />
                                    </div>;
                                }

                                tr.push(<td key={this.props.data.id + key}>
                                            {img}
                                        </td>);
                                break;
                            case 'Radio':
                                isRadioBts = false;
                            case 'RadioBts':
                                var radios   = [];
                                var indice   = 0;

                                // Parcours des names
                                _.each(reactEltCourant.names, function(name, key){
                                    var libelle  = reactEltCourant.libelles.key;

                                    // Btn Radio clasique
                                    if(!isRadioBts) {
                                        var attributes = {
                                            'data-id':this.props.data.id,
                                            'data-etat':etat,
                                            value:etat};

                                        var attrs = {
                                            label:libelle,
                                            name:"InputRadioEditable[]",
                                            wrapperClassName:'col-md-4',
                                            labelClassName:'col-md-2',
                                            groupClassName:'row'};

                                        // Merge des attributs
                                        _.extend(attrs, attributes);
                                        radios.push(<InputRadioEditable key={'IR' + this.props.data.id + key}
                                                                        evts={this.props.reactElements[indiceCol.toString()][2]}
                                                                        editable={this.props.editable}
                                                                        attributes={attrs} />);
                                    }
                                    // Btn Radio Bootstrap
                                    else{
                                        var classBtn = '';

                                        // Le radio coché
                                        var checked = (reactEltCourant.checked == reactEltCourant.name);
                                        // Attributs du radio
                                        var attributes = {
                                            value : this.props.data[reactEltCourant.values],
                                            checked : checked};

                                        // Ajout du radio
                                        var reactRadio = (
                                            <InputRadioBootstrapEditable
                                                key={name+'_'+key}
                                                evts={{onClick : reactEltCourant.onClick}}
                                                editable={this.props.editable}
                                                attributes={attributes}>

                                            {libelle}
                                            </ InputRadioBootstrapEditable>
                                        );
                                        //radios.push(reactRadio);
                                    }
                                }.bind(this));

                                // Ajout du TD au TR
                                var monTd = (
                                    <td key={this.props.data.id + key}>
                                        <RadioGroup attributes={{name: "bootstrap"}} bootstrap={true}>
                                            <InputRadioBootstrapEditable
                                                key={'bt1'}
                                                editable={true}
                                                attributes={{
                                                    checked: true,
                                                    value: 'btn1'
                                                }}
                                            >
                                                Btn 1
                                            </ InputRadioBootstrapEditable>
                                            <InputRadioBootstrapEditable
                                                key={'bt2'}
                                                editable={true}
                                                attributes={{
                                                    value: 'btn2'
                                                }}
                                            >
                                                Btn 2
                                            </ InputRadioBootstrapEditable>
                                        </RadioGroup>
                                    </td>
                                );
                                console.log('mon td %o',monTd);
                                tr.push(monTd);
                                break;

                            // Le type d'element react est inconnu
                            default :
                                tr.push(<td key={this.props.data.id+key}>
                                            Objet React --{reactEltCourant.type}-- non défini
                                        </td>);
                                break;
                        }
                     }
                     /* Cellule "normale", un champ texte */
                     else {
                         tr.push(<td key={this.props.data.id + key}>{val}</td>);
                     }
                     indiceCol++;
                  }
             }.bind(this));
             // Ajout du tr
             var retour = (
                 <tr
                    {...attr}
                    {...this.props.evts}
                 >
                    {tr}
                 </tr>
             );
        console.log('TR %o', retour);
            return retour;
    }
    /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */

});