/**
 * Created by Pierre on 16/12/2014.
 */

/* Composant react Bandeau */
var Bandeau = require('../composants/react_bandeau');

/****************************************************************/
/*          Composant react_data_table_bandeau_profil           */

var DataTableBandeauProfil = require('../react_data_table_bandeau_profil');

/* Paramètres du composant react_data_table_bandeau_profil      */
/* Entête(s) du tableau : "Profils"                             */
/* Champ(s) caché(s)    : "id"                                  */
/* Sur clic d'une ligne, déclenche l'action "handleClickProfil" */
var headP = [Lang.get('global.profil')];
var hideP = ['id'];
var evtsP = {'onClick':handleClickProfil};

/* Fonction handleClickProfil */
function handleClickProfil(evt){
    var copie = _.clone(evt);
    Actions.profil.profil_select(copie);
}
/*       FIN : Composant react_data_table_bandeau_profil        */
/****************************************************************/

/****************************************************************/
/*          Composant react_data_table_bandeau_module           */

var DataTableBandeauModule = require('../react_data_table_module_profil');

/* Paramètres du composant react_data_table_module_profil            */
/* Entête(s) du tableau : "Module, Droits                            */
/* Champ(s) caché(s)    : "idModule"                                 */
var headMP = [Lang.get('global.module'), Lang.get('global.droits')];
var hideMP = ['idModule'];

/* Paramètres pour les radios Boutons                                */
/* Libelles : "Visu, Modif, Aucun"                                   */
/* Name     : "btnVisu, btnModif, btnAucun                           */
/* Sur clic d'un radio bouton, déclenche l'action "handleClickRadio" */
var aLibelle = new Array(Lang.get('administration.profil.visu'), Lang.get('administration.profil.modif'), Lang.get('administration.profil.aucun'));
var aName    = new Array('btnVisu', 'btnModif', 'btnAucun');
var aReactElements  = {};
aReactElements['1'] = new Array();                           /* Colonne n°1 du tableau               */
aReactElements['1'][0] = 'Radio';                            /* Type de composant à ajouter          */
aReactElements['1'][1] = {'name':aName, 'libelle':aLibelle}; /* Name des radio boutons et libelle    */
aReactElements['1'][2] = {'onClick':handleClickRadio};       /* Evenement sur click des radio bouton */

/* Fonction handleClickRadio */
function handleClickRadio(evt){
    var copie = _.clone(evt);
    Actions.profil.radio_change(copie);
}
/*      FIN : Composant react_data_table_bandeau_module         */
/****************************************************************/

/**
 * Created by Pierre on 16/12/2014.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param //
 */
var ReactPageProfil  = React.createClass({
    /**
     * Vérification éventuelle des types des propriétés
     */
    propTypes: {},
    /**
     * Méthode appellée à la création du composant,
     * initialise les propriétés non définies lors de l'appel avec les valeurs retournées
     * @returns object
     */
    getDefaultProps: function () {

    },

    /**
     * État initial des données du composant
     * isNameProfilModif : pas de modification sur le nom du profil
     * isMatriceModuleModif : pas de modification de la matrice des droits des modules
     * matriceModuleDroit : matrice correspondant à la base de donnée lors du chargement serveur
     * @returns les données de l'état initial
     */
    getInitialState: function () {
        /* Création de la matrice qui associe      */
        /* pour chaque module ses droits           */
        /* A chaque clic sur un radio bouton       */
        /* on va venir mettre à jour cette matrice */
        var aoMatrice = {};
        var indice = 0;
        _.each(this.props.dataModule, function(val, key){
            aoMatrice.push({'id':    this.props.dataModule[indice]['id'],
                            'etat':  this.props.dataModule[indice++]['etat']});
        });

        return {
            isNameProfilModif    : false,
            isMatriceModuleModif : false,
            matriceModuleDroit   : aoMatrice,
            etatPageProfil       : 'profils'
        };
    },
    /**
     * Callback appelé lorsque le composant est affiché.
     * C'est par exemple ici qu'on peut faire un appel ajax pour
     * charger ses données dynamiquement !
     */
    componentDidMount: function () {

    },
    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        return GetComponentSwitchState(this.state.etatPageProfil);
    }
});

function GetComponentSwitchState(etatPageProfil){

    var titrePage = Lang.get('global.profils');

    switch(etatPageProfil){

        /* On arrive sur la page "Profils" */
        /* On affiche :                    */
        /*    - le bandeau (Créer)         */
        /*    - le tableau des profils     */
        case 'profils':
            return  <div id="containerPageProfil">
                <Row>
                    <Bandeau titre={titrePage} />
                </Row>
                <Row>
                    <DataTableBandeauProfil head={headP} hide={hideP} id="tab_profil" evts={evtsP} />
                </Row>
            </div>
            break;

        /* On a sélectionné un profil                      */
        /* On affiche :                                    */
        /*    - le bandeau (Retour/Créer/Editer/Supprimer) */
        /*    - le nom du profil NON éditable              */
        /*    - le tableau des modules NON éditable        */
        case 'module/visu':
            titrePage += 'Nom du profil sélectionné';
            var NomProfil = Lang.get('global.profils') + ' ' + 'Nom du profil sélectionné';

            return  <div id="containerPageProfil">
                <Row>
                    <Bandeau titre={titrePage} />
                </Row>
                <Row>
                    <p>{NomProfil}</p>
                </Row>
                <Row>
                    <DataTableBandeauModule head={headMP} hide={hideMP} id="tab_module_profil" bUnderline={false} reactElements={aReactElements} />
                </Row>
            </div>
            break;

        /* On édite un profil                   */
        /* On affiche :                         */
        /*    - le bandeau                      */
        /*    - le nom du profil EDITABLE       */
        /*    - le tableau des modules EDITABLE */
        case 'module/edition':

            break;

        /* On créer un profil                   */
        /* On affiche :                         */
        /*    - le bandeau                      */
        /*    - le nom du profil EDITABLE       */
        /*    - le tableau des modules EDITABLE */
        case 'module/création':
            titrePage += Lang.get('global.creation');

            break;
        default:
            return <div>Erreur dans le render de react_page_profil.js</div>
            break;
    }
}