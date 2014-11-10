// Gulp requirement
var gulp = require('gulp');
var gutil = require('gulp-util');

// Plugins requirements
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

// Manipulation des CSS
gulp.task('css', function () {
    return gulp.src('app/assets/css/**/*.css')
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'));
});

// Setup des watchers
gulp.task('watch', function(){
    // Watch des CSS
    return gulp.watch('app/assets/css/**/*.css', ['css']);
});


/**
 * Tâche par défaut appellée quand on tape la commande 'gulp'
 * - Lance les tâches suivantes a l'init
 *      - CSS
 * - Lance les watchers pour les taches suivantes:
 *      - CSS
 */
gulp.task('default', ['css', 'watch']);