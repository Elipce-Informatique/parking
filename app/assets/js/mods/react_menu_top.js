var AppName = require('./menu/react_app_name');

/**
 * Created by yann on 18/11/2014.
 * Composant de base du menu top utilisateur
 *
 * @param appName : Nom de l'application à afficher en haut à gauche
 * @param appUrl : Url associée au nom de l'application (typiquement l'accueil)
 * @param menuDataUrl : Url pour aller chercher les données contenues qui composent le menu
 *                      TODO : définir la structure de ce retour (nom, url, acces, actif)
 * @param userDataUrl : Url pour aller chercher les données de l'utilisateur
 *                      TODO : Définir la structure de ces données
 */
var MenuTop = React.createClass({
    getDefaultProps: function () {
        return {appName: "Mon Application",
                appUrl : "#",
                menuDataUrl : {},
                userData : {}
        };
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        console.log('Pass render');
        return (
            <div className="container-fluid">
                <AppName name={this.props.appName} url={this.props.appUrl} />
            </div>
        )
    }
});

module.exports = MenuTop;