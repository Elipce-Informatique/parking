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

### Environnement de dev Front End 
###### - Installation de **node js** : http://nodejs.org/
- Si la commande ```npm``` affiche une erreur "ENOENT" dans powershell, il faut créer un dossier npm vide dans %appdata%

###### - Installation de **Gulp** en global
```sh
install --global gulp
```

###### - Installation de **Browserify** en global
```sh
npm install -g browserify
```

###### - Installation des dépendences nodes depuis le package.json
lancer la commande : ```npm update``` depuis la racine du projet

