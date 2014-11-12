# Elipce Workflow
Nouveau WorkFlow pour les développements web d'Elipce.
- Basé sur **Laravel** côté serveur, on va utiliser **Gulp** comme task runner
- **Flux** et **React** comme Frontend engineering lib
Puis jQuery et Bootstrap comme utilitaires.


## INIT de l'environnement de développement

### Environnement de dev backend
- Installation de composer (https://getcomposer.org/download/)
- Installation de Laravel en global
	- Doc écrite: http://laravel.com/docs/4.2/quick
	- Doc vidéo : https://laracasts.com/lessons/laravel-installation-for-newbs
- Ajout du dossier ```C:\Users\*********\AppData\Roaming\Composer\vendor\bin``` au path
- Installation des dépendences (se placer dans le dossier du projet) : 
```composer update```

### Environnement de dev Front End
###### - Installation de **node js** : http://nodejs.org/
- Si la commande ```npm``` affiche une erreur "ENOENT" dans powershell, il faut créer un dossier npm vide dans %appdata%

###### - Installation de **Gulp** en global
```nmp install --global gulp```

###### - Installation de **Browserify** en global
```npm install -g browserify```

###### - Installation des dépendences nodes depuis le package.json
lancer la commande : ```npm update``` depuis la racine du projet

## Conventions de développement
#### JavaScript
Le workflow JavaScript est très automatisé. Les fichiers de développement sont placés sous app/assets/js.
- A la racine de ce dossier, on met tous les js spécifiques à une page (accueil.js, login.js, utilisateur.js etc...)
- Dans app/assets/js/libs on met toutes les libs **NON COMMON JS** à inclure sur toutes les pages 
- Dans le dossier mods, on met tous nos modules **COMMON JS** perso.
    - Qu'est-ce qu'un module COMMON JS ? https://egghead.io/lessons/nodejs-what-are-commonjs-modules

Les fichiers à inclure dans les pages sont placés automatiquement par gulp dans **public/js**