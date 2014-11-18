var dest = "./public/js";
var src = './app/assets/js';
var fs = require('fs');
var _ = require('underscore');

module.exports = {
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: ['.js'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: function(){

        // Fichiers globaux
        var globFiles = fs.readdirSync(src+'/global');
        globFiles = _.filter(globFiles, function(file){
            return file.indexOf('app.js') > -1;
        });
        globFiles = _.map(globFiles, function(file){
            return {
                entries : src+'/global/'+file,
                dest : dest+'/global',
                outputName : file
            };
        });

        // Fichiers spécifiques
        var appFiles = fs.readdirSync(src);

        // Filtre *app.js dans un tableau de nom de fichier
        appFiles = _.filter(appFiles, function(file){
            return file.indexOf('app.js') > -1;
        });

        // Création du tableau d'objet en fonction du nom de fichier
        appFiles = _.map(appFiles, function(file){
            return {
                entries : src+'/'+file,
                dest : dest,
                outputName : file
            };
        });

        var bundles = _.union(globFiles, appFiles);
//        console.log(bundles);

        return bundles;
    }
  }
};

var temp = [{
    entries: src + '/javascript/app.coffee',
    dest: dest,
    outputName: 'app.js'
}, {
    entries: src + '/javascript/head.coffee',
    dest: dest,
    outputName: 'head.js'
}]