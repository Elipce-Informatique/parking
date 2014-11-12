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
var browserify = require('browserify');
var transform = require('vinyl-transform');
var reactify = require('reactify');

// PATHS
var CSS_SRC = 'app/assets/css/**/*.css';
var STYL_SRC = 'app/assets/css/**/*.styl';
var CSS_DEST = 'public/css';
var JS_ALL = 'app/assets/js/**/*.js';
var JS_SRC = 'app/assets/js/*.js';
var JS_DEST = 'public/js';

// Manipulation des CSS
gulp.task('css', ['stylus', 'css_natif']);

// Manipulation des JS
gulp.task('js', ['browserify']);


// BROWSERIFY
gulp.task('browserify', function(){
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        b.transform(reactify);
        return b.bundle();
    });

    return gulp.src(JS_SRC)
        .pipe(browserified)
        //.pipe(uglify())
        .pipe(gulp.dest(JS_DEST))
        .pipe(notify({message: 'Browserify task completed.'}));
});

// STYLUS
gulp.task('stylus', function(){
    return gulp.src(STYL_SRC)
        .pipe(changed(CSS_DEST))
        .pipe(stylus())
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST))
        .pipe(notify({message: 'Stylus task completed.'}));
});

// STYLUS
gulp.task('css_natif', function(){
    return gulp.src(CSS_SRC)
        .pipe(changed(CSS_DEST))
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST))
        .pipe(notify({message: 'CSS natif task completed.'}));
});


// Setup des watchers
gulp.task('watch', function () {
    // Watch des CSS
    gulp.watch(CSS_SRC, ['css']);
    // Watch des js
    gulp.watch(JS_ALL, ['js']);
});

/**
 * Tâche par défaut appellée quand on tape la commande 'gulp'
 * - Lance les tâches suivantes a l'init
 *      - CSS
 * - Lance les watchers pour les taches suivantes:
 *      - CSS
 */
gulp.task('default', ['css', 'js', 'watch']);