// GULP REQUIREMENT
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');

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
var JS_ALL_SRC = 'app/assets/js/**/*.js';
var JS_LIBS_SRC = 'app/assets/js/libs/*.js';
var JS_LIBS_DEST = 'public/js/libs';
var JS_BUNDLE_SRC = 'app/assets/js/**/*app.js';
var JS_BUNDLE_DEST = 'public/js';

// Manipulation des CSS
gulp.task('css', ['stylus', 'css_natif']);

// Manipulation des JS
gulp.task('js', ['browserify', 'libs_js_statiques']);


// BROWSERIFY (*app.js)
gulp.task('browserify', function(){
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        b.transform(reactify).on('error', function(err){
            gutil.log('ERREUR : '+err);
            this.end();
        });
        return b.bundle();
    });

    return gulp.src(JS_BUNDLE_SRC)
        .pipe(browserified)
        //.pipe(uglify()).on('error', gutil.log)
        .pipe(gulp.dest(JS_BUNDLE_DEST))
        .pipe(notify({message: 'Browserify task completed.'}));
});

// LIBS JS (/libs/*.js)
gulp.task('libs_js_statiques', function(){
    return gulp.src(JS_LIBS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(JS_LIBS_DEST))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest(JS_LIBS_DEST))
        .pipe(notify({message: 'Static JS task completed.'}));
});

// STYLUS (*.styl)
gulp.task('stylus', function(){
    return gulp.src(STYL_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(CSS_DEST))
        .pipe(stylus())
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST))
        .pipe(notify({message: 'Stylus task completed.'}));
});

// CSS NATIF (*.css)
gulp.task('css_natif', function(){
    return gulp.src(CSS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(CSS_DEST))
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST))
        .pipe(notify({message: 'CSS natif task completed.'}));
});


// SETUP DES WATCHERS
gulp.task('watch', function () {
    // Watch des CSS
    gulp.watch(CSS_SRC, ['css_natif']);
    gulp.watch(STYL_SRC, ['stylus']);
    // Watch des JS
    gulp.watch(JS_ALL_SRC, ['browserify', 'libs_js_statiques']);
});

/**
 * Tâche par défaut appellée quand on tape la commande 'gulp'
 * - Lance les tâches suivantes a l'init
 *      - CSS
 * - Lance les watchers pour les taches suivantes:
 *      - CSS
 */
gulp.task('default', ['css', 'js', 'watch']);
