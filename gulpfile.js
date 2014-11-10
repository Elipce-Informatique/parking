// GULP REQUIREMENT
var gulp = require('gulp');
var gutil = require('gulp-util');

// PLUGINS REQUIREMENTS
var changed = require('gulp-changed');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');

// PATHS
var CSS_SRC = 'app/assets/css/**/*.css';
var CSS_DEST = 'public/css';
var JS_SRC = 'app/assets/js/**/*.js';
var JS_DEST = 'public/js';

// Manipulation des CSS
gulp.task('css', function () {
    return gulp.src(CSS_SRC)
        .pipe(changed(CSS_DEST))
        .pipe(stylus())
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST))
        .pipe(notify({message: 'CSS task completed.'}));
});

// Manipulation des JS
gulp.task('js', function () {
    return gulp.src(JS_SRC)
        .pipe(changed(JS_DEST))
        .pipe(uglify())
        .pipe(gulp.dest(JS_DEST))
        .pipe(notify({message: 'JS task completed.'}));
});

// Setup des watchers
gulp.task('watch', function () {
    // Watch des CSS
    gulp.watch(CSS_SRC, ['css']);
    // Watch des js
    gulp.watch(JS_SRC, ['js']);
});

/**
 * Tâche par défaut appellée quand on tape la commande 'gulp'
 * - Lance les tâches suivantes a l'init
 *      - CSS
 * - Lance les watchers pour les taches suivantes:
 *      - CSS
 */
gulp.task('default', ['css', 'js', 'watch']);