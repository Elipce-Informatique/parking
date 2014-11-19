###### 19/11/2014 Automatisation des langues JS
- Module de génération des langues en partant des langues Laravel: https://github.com/andywer/laravel-js-localization
- Intégration d'un watcher pour mettre à jour le cache des langues automatiquement
- Début du composant React menut top

###### 18/11/2014 Optimisation browserify
- Utilisation de watchify
- Adaptation de gulp-starter (fork ici https://github.com/Elipce-Informatique/gulp-starter )

BUILD EN 100 MS !!!!!!!!!!!!!!!!!!!!!!!

###### 15/11/2014 Grosse update gulpfile et assets
- Update gulpfile pour prendre les librairies js statiques (bootstrap)
- Update inclusion js globale (global/app.js) qui inclu obligatoirement jQuery et React à la fenetre
    - PLUS BESOIN DE REqUIRE jQuery et React
- Fix gulpfile pour ne plus arrêter l'execution des watchers lorsqu'une erreur est rencontrée.

###### 12/11/2014 Authentification en cours de dev
- Suivi du tuto sur l'authentification en cours
- Blocage sans erreur sur la validation

###### 12/11/2014 Update readme et package.json
- Update readme css
- Update package.json pour intégrer gulp-changed

###### 11/11/2014 BROWSERIFY MARCHE ENFIN !!!!!
- Intégration d'une nouvelle tache pour browserifier les JS
- Update des tests
- Test de module avec React et jsx
    
###### 10/11/2014 Essai de browserify
- Se renseigner sur les bonnes pratiques de browserify
    - Un seul fichier d'entrée ou plusieurs
    - si plusieurs Voir comment compiler vers plusieurs fichiers?
    
###### 10/11/2014 Update gulpfile
- Déplacement des js libs dans assets (Bootstrap et jQuery)
- Ajout d'un système de notification à gulp
- Ajout de Stylus à Gulp
- Création d'une tache JS
- Installation de uglify js
- Utilisation de uglify js dans la tache JS
- Switch des jquery et bootstrap .js non mini dans le dossier assets
- Passage des paths en variables de config (gulpfile)
- Utilisation de gulp-changed pour détecter les fichiers modifiés entre 2 passages

###### 10/11/2014 Mise en place css/js et gulp
- Création des dossiers pour CSS et JS sous app/assets
- Création d'une tache gulp CSS qui envoi le tout sous public/css
- Mise en place d'une tache watch avec init pour les CSS
    - TODO : Plugger les autres watchers quand on en aura besoin
- Important : mettre à jour les dependencies NPM

###### 10/11/2014 Update de la procédure d'install
- Modification du readme pour ajouter des infos d'install

###### 05/11/2014 Ajout de react JS
- Installation de react
- Update du package.json

###### 05/11/2014 MAJ du readme
- Ajout de la procédure d'installation de l'environnement de développement.

###### 05/11/2014 Ajout de bootstrap 3.3 et jQuery 2.1
- inclusion des libs frontend dans le dossier public.
- voir https://bitbucket.org/beni/laravel-4-tutorial/wiki/Add_Twitter-Bootstrap pour leur utilisation dans le moteur de template.

###### 05/11/2014 config BDD & mode debug & lang
- Configuration des langues
- Configuration du mode débug dans app.php
- Configuration de la base de données dans database.php

###### 05/11/2014 INIT gulp JS et URL rewriting
- Installation de gulp
	- Installation en globale dans node js : npm install --global gulp
	- Installation de gulp via la racine du projet : npm install --save-dev gulp
Ajout d'un .htaccess avec de l'URL rewriting pourn utiliser en local avec apache (enlève le index.php de l'url)

###### 05/11/2014 INIT backend
- Installation de Laravel
