# Elipce Workflow
Nouveau WorkFlow pour les développements web d'Elipce.
- Basé sur **Laravel** côté serveur, on va utiliser **Gulp** comme task runner et une architecture **RESTFUL**
- **Flux** et **React** comme Frontend engineering lib
Puis jQuery et Bootstrap comme utilitaires.


## INIT de l'environnement de développement
- **Si les commandes composer et npm ne sont pas reconues, il faut sans doute ajouter leur chemin dans le path local**
- Les commandes en consoles sont à lancer depuis un **powershell** de préférence
- Il est fortement conseillé d'installer Cmder pour avoir un meilleur shell sous Windows : http://bliker.github.io/cmder/

### Environnement de dev backend
- Installation de composer (https://getcomposer.org/download/)
- Ajout du dossier ```C:\Users\*********\AppData\Roaming\Composer\vendor\bin``` au path
- Installation de Laravel en global
	- Doc vidéo : https://laracasts.com/lessons/laravel-installation-for-newbs (Recommandée)
	- Doc écrite: http://laravel.com/docs/4.2/quick (section "Via Laravel Installer")
- Clonner le projet github dans un dossier local (typiquement dans le dossier www de easyphp)
- Installation des **dépendences Laravel** en ligne de commande (se placer dans le dossier du projet) : 
```composer update```
- les langues sont définies dans des fichiers par thèmes (app/lang/fr)
    - Pour les utiliser en JS il faut les déclarer dans la config package/andywer/js-localization
    - Pour les appeller en JS on fait ```Lang.get('fichier.constante')```;
    
### Environnement de dev Front End
- Installation de **node js** : http://nodejs.org/
    - Si la commande ```npm``` affiche une erreur "ENOENT" dans powershell, il faut créer un dossier npm vide dans %appdata%/Roaming
- Installation de **Gulp** en global
```nmp install --global gulp```
- Installation de **Browserify** en global
```npm install -g browserify```
- Installation des dépendences nodes depuis le package.json
lancer la commande : ```npm update``` depuis la racine du projet

## Conventions de développement
- ON NE DOIT RIEN METTRE MANUELLEMENT DANS LE DOSSIER **public**
- Template par défaut utilisé sur la majorité des pages pompé de bootstrap : http://getbootstrap.com/examples/dashboard/

#### PHP
- Utilisation des routes de type 'resource' au MAXIMUM pour être RESTFUL
- Template structuré de la manière suivante
```
    /views
        - structure.blade
    /layouts
        - login.blade
        - default.blade
    /pages
        - page1.blade
        - page2.blade
        - ...
```
Chaque page hérite d'un layout, le layout défault contient la structure d'une page classique de l'appli.
Pour les structures plus fantaisistes, on en crée d'autres comme le layout login utilisé par la page login.

#### JavaScript
Le workflow JavaScript est très automatisé. Les fichiers de développement sont placés sous app/assets/js.
- A la racine de ce dossier, on met tous les js spécifiques à une page (accueil.js, login.js, utilisateur.js etc...)
- Dans app/assets/js/libs on met toutes les libs **NON COMMON JS** à inclure sur toutes les pages 
- Dans le dossier mods, on met tous nos modules **COMMON JS** perso.
    - Qu'est-ce qu'un module COMMON JS ? https://egghead.io/lessons/nodejs-what-are-commonjs-modules

Les fichiers à inclure dans les pages sont placés automatiquement par gulp dans **public/js**
- /!\ IMPORTANT /!\
    - EN JAVASCRIPT LA COPIE D'OBJETS DOIT ÊTRE EXPLICITE ! UNE AFFECTATION SIMPLE PASSE UNE RÉFÉRENCE !!!
- Pour tester le type d'une variable, on utilise l'opérateur **typeof** :
```javascript
    typeof []; // object
    typeof {}; // object
    typeof ''; // string
    typeof new Date() // object
    typeof 1; // number
    typeof function () {}; // function
    typeof /test/i; // object
    typeof true; // boolean
    typeof null; // object
    typeof undefined; // undefined
    
    // Example : 
    if(typeof foo == 'undefined'){
        bar = true;
    }
```

#### CSS
Les fichier CSS sont écrits avec le langage Stylus (http://learnboost.github.io/stylus/)
- Les fichiers de développenent en Stylus sont dans ```app/assets/css```
- Les fichiers compilés en CSS natif sont placés dans ```public/css```
- Les **tailles de polices** sont à définir en **%** pour le meilleur rendu possible en responsive

## Liste des libs disponnibles

### Javascript
- Voir le [package.json](package.json) section **"dependencies"**
- Pour avoir un aperçu de ce qui est **dispo globalement** dans toutes les pages (pas besoin de require), voir [app.js](app/assets/js/global/app.js)
- Pour les autres libs, il faut les **require** selon le besoin si elles sont installées via NPM Sinon, les inclure dans le template php
dans la section scripts : ```@section('scripts')```

### PHP
- Voir le [package.json](package.json) section **"require"**
