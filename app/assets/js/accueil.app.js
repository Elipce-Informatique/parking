/**
 * Created by yann on 02/12/2014.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 */
var BlockAccueil = require('./mods/react_block_accueil');

React.render(<BlockAccueil titre={Lang.get('menu.top.administration')}
    texte={Lang.get('accueil.block_admin')}
    bouton={Lang.get('accueil.bouton_admin')} module_url="administration"/>,
    document.getElementById('block_admin'));