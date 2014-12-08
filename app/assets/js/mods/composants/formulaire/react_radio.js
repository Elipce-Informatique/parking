/**
 * Created by Pierre on 08/12/2014.
 */

/**
 *  Composant React correspondant à un radio bouton avec style bootstrap
 */
var ReactRadioBoots = React.createClass({

    /**
     *  Propriétés
     */
    propTypes: {
        name:    React.PropTypes.string.isRequired, /* Name du radio bouton               */
        libelle: React.PropTypes.string.isRequired, /* libelle à afficher                 */
        checked: React.PropTypes.bool,              /* true : Checked, false :not Checked */
        id:      React.PropTypes.string             /* ID du radio bouton                 */
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        return {checked:false, id:''};
    },

    render: function() {
        var classBtn = 'btn btn-primary';
        var checked  = {};

        /* Etat du radio bouton */
        if(this.props.checked == true){
            classBtn += ' active';
            checked  = {checked:true};
        }

        /* ID */
        var id = {};
        if(this.props.id != '')
            id = {id:this.props.id};

        /* Code HTML */
        return (
            <label className={classBtn}>
                <input type="radio" name={this.props.name} {...id} autocomplete="off" {...checked} /> {this.props.libelle}
            </label>
        );
    }
});

/**
 *   Composant React correspondant à un groupe de radio bouton avec style bootstrap
 */
var ReactGroupRadioBoots = React.createClass({

    /**
    *  Propriétés
    */
    propTypes: {
        name:    React.PropTypes.array.isRequired, /* Name des radios boutons            */
        libelle: React.PropTypes.array.isRequired, /* libelles à afficher                */
        checked: React.PropTypes.array,            /* true : Checked, false :not Checked */
        id:      React.PropTypes.array             /* ID du radio bouton                 */
    },

    /**
    * Les props par défaut
    */
    getDefaultProps: function() {

        return {
            checked:{},
            id:{}
        };
    },

    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {
        return {};
    },

    render: function() {
        /* Erreur dans le nombre de paramètres */
        if(this.props.name.length != this.props.libelle.length)
            return 'error';
        else{
            var radios = "";

            /* Création des radios boutons */
            this.props.name.forEach(function(element, i){
                var check = (this.props.checked.length>0?this.props.checked[i]:false);
                var id_   = (this.props.id.length     >0?{id:this.props.id[i]}:{});
                radios   += <ReactRadioBoots name={element} libelle={this.props.libelle[i]} checked={check} {...id_}/>;
            }, this);

            /* Code HTML */
            return (
                <div class="btn-group" data-toggle="buttons">
                    {radios}
                </div>
            );
        }
    }
});

module.exports = ReactGroupRadioBoots;