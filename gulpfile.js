// NODE REQUIREMENT
var spawn = require('child_process').spawn;

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
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var _ = require('underscore');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var Q = require('Q');
var del = require('del');

// UTIL REQUIRELMENTS
var bundleLogger = require('./gulp_utils/bundleLogger');
var handleErrors = require('./gulp_utils/handleErrors');
var config = require('./gulp_utils/config').browserify;

// PATHS
var CSS_SRC = './app/assets/css/*.css';
var STYL_SRC = './app/assets/css/*.styl';
var CSS_DEST = './public/css';
var CSS_LIBS_SRC = './app/assets/css/libs/*.css';
var CSS_LIBS_DEST = './public/css/libs';
var CSS_FONTS_SRC = './app/assets/css/fonts/*';
var CSS_FONTS_DEST = './public/css/fonts';
var JS_ALL_SRC = './app/assets/js/**/*.js';
var JS_LIBS_SRC = './app/assets/js/libs/*.js';
var JS_LIBS_DEST = './public/js/libs';
var IMG_SRC = './app/assets/images/**/*.*';
var IMG_DEST = './public/images';
var LANG_SRC = './app/lang/**/*.php';

/*
 |--------------------------------------------------------------------------
 | Tache par défaut, qui lance les taches d'init et de watch
 |--------------------------------------------------------------------------
 */
gulp.task('default', ['clean'], function(){
    gulp.start('build');
});
gulp.task('build', ['watch', 'css', 'js', 'images']);

/*
 |--------------------------------------------------------------------------
 | SETUP DES WATCHERS
 |--------------------------------------------------------------------------
 */
gulp.task('watch',  function () {
    // Watch des CSS
    gulp.watch(CSS_SRC, ['css_natif']);
    gulp.watch(STYL_SRC, ['stylus']);
    gulp.watch(CSS_LIBS_SRC, ['libs_css_statiques']);
    // Watch des JS
    gulp.watch(JS_ALL_SRC, ['libs_js_statiques']);
    // Watch des IMG
    gulp.watch(IMG_SRC, ['images']);
    // Watch des LANG
    gulp.watch(LANG_SRC, ['lang_js']);

});

/*
 |--------------------------------------------------------------------------
 | CLEAN des fichiers dans public
 |--------------------------------------------------------------------------
 */
gulp.task('clean', function (cb) {

    del(['public/css', 'public/js', 'public/images'], cb);
})

/*
 |--------------------------------------------------------------------------
 | Définition des tâches de génération
 |--------------------------------------------------------------------------
 */

// MANIPULATION DES CSS
gulp.task('css', ['stylus', 'css_natif', 'libs_css_statiques', 'css_fonts']);

// MANIPULATION DES JS
gulp.task('js', ['libs_js_statiques', 'browserify', 'lang_js']);

// LIBS JS (/libs/*.js)
gulp.task('libs_js_statiques',  function () {
    return gulp.src(JS_LIBS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(JS_LIBS_DEST))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest(JS_LIBS_DEST))
        .pipe(notify({message: 'Static JS task completed.'}));
});

// STYLUS (*.styl)
gulp.task('stylus',  function () {
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
gulp.task('css_natif',  function () {
    return gulp.src(CSS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(CSS_DEST))
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST))
        .pipe(notify({message: 'CSS natif task completed.'}));
});

// LIBS CSS (/libs/*.css)
gulp.task('libs_css_statiques',  function () {
    return gulp.src(CSS_LIBS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(replace('../images/', '../../images/'))
        .pipe(minifycss())
        .pipe(concat('all.css'))
        .pipe(gulp.dest(CSS_LIBS_DEST))
        .pipe(notify({message: 'Static CSS task completed.'}));
});

// FONTS CSS (/css/fonts)
gulp.task('css_fonts',  function () {
    return gulp.src(CSS_FONTS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(CSS_FONTS_DEST))
        .pipe(gulp.dest(CSS_FONTS_DEST))
        .pipe(notify({message: 'CSS FONTS task completed.'}));
});

// IMAGES
gulp.task('images',  function () {
    return gulp.src(IMG_SRC)
        .pipe(changed(IMG_DEST))
        .pipe(gulp.dest(IMG_DEST));
});

// LANGUES
gulp.task('lang_js',  function () {
    var child = spawn("php", ["artisan", "js-localization:refresh"], {cwd: process.cwd()}),
        stdout = '',
        stderr = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        stdout += data;
        gutil.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        stderr += data;
        gutil.log(gutil.colors.red(data));
        gutil.beep();
    });

    child.on('close', function(code) {
        gutil.log("Remise en cache des langues terminée avec le code", code);
        //gutil.log("You access complete stdout and stderr from here"); // stdout, stderr
    });
})

// TACHE BROWSERIFY FONCTIONNELLE MULTI BUNDLE
gulp.task('browserify',  function (callback) {

    var bundleQueue = config.bundleConfigs().length;

    var browserifyThis = function (bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: true,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: config.extensions,
            // Enable source maps!
            debug: config.debug,
            transform: 'reactify'
        });

        var bundle = function () {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            return bundler
                .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName))
                // Specify the output destination
                .pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);
        };

        //if(global.isWatching) {
        //    // Wrap with watchify and rebundle on changes
        bundler = watchify(bundler);
        // Rebundle on update
        bundler.on('update', bundle);
        //}

        var reportFinished = function () {
            // Log when bundling completes
            bundleLogger.end(bundleConfig.outputName)

            if (bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.bundleConfigs().forEach(browserifyThis);
});
