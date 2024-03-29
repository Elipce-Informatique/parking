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
var rename = require('gulp-rename');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var del = require('del');
var bootlint = require('gulp-bootlint');
var reactify = require('reactify');

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
var JS_VENDOR_DEST = './public/js/global';
var IMG_SRC = './app/assets/images/**/*.*';
var IMG_DEST = './public/images';
var LANG_SRC = './app/lang/**/*.php';
var LANG_CONF = './app/config/packages/andywer/js-localization/config.php';

// LIBS CONFIG
var libs = [
    'react',
    'react/addons',
    'react/lib/ReactCSSTransitionGroup',
    'jquery',
    'lodash',
    'react-bootstrap',
    'datatables',
    'react-calendar/react-calendar',
    'sweetalert'
];

/*
 |--------------------------------------------------------------------------
 | Tache par défaut, qui lance les taches d'init et de watch
 |--------------------------------------------------------------------------
 */
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
gulp.task('build', ['watch', 'css', 'js', 'images']);


// Déploiement en mode réel, tout sauf le watch
gulp.task('deploy', ['clean', 'apply-prod-environment'], function () {
    gulp.start('deploy-task');
});
gulp.task('deploy-task', ['css', 'js', 'images'], function () {
    console.log('CALLBACK deploy task end process should stop');
    process.nextTick(function () {
        process.exit(0);
    });
});

gulp.task('apply-prod-environment', function () {
    process.stdout.write("Setting NODE_ENV to 'production'" + "\n");
    process.env.NODE_ENV = 'production';
    if (process.env.NODE_ENV != 'production') {
        throw new Error("Failed to set NODE_ENV to production!!!!");
    } else {
        process.stdout.write("Successfully set NODE_ENV to production" + "\n");
    }
});

/*
 |--------------------------------------------------------------------------
 | SETUP DES WATCHERS
 |--------------------------------------------------------------------------
 */
gulp.task('watch', function () {
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
    gulp.watch(LANG_CONF, ['lang_js']);

});

/*
 |--------------------------------------------------------------------------
 | CLEAN des fichiers dans public
 |--------------------------------------------------------------------------
 */
gulp.task('clean', function (cb) {

    del(['public/css', 'public/js', 'public/images'], cb);
});

/*
 |--------------------------------------------------------------------------
 | Définition des tâches de génération
 |--------------------------------------------------------------------------
 */

// MANIPULATION DES CSS
gulp.task('css', ['stylus', 'css_natif', 'libs_css_statiques', 'css_fonts'], function () {
    notify({message: 'All CSS tasks completed.'});
});

// MANIPULATION DES JS
gulp.task('js', ['libs_js_statiques', 'vendor', 'browserify', 'lang_js'], function () {
    notify({message: 'All JS tasks completed.'});
});

// LIBS JS (/libs/*.js)
gulp.task('libs_js_statiques', function () {
    return gulp.src(JS_LIBS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(JS_LIBS_DEST))
        //.pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest(JS_LIBS_DEST));
});

// STYLUS (*.styl)
gulp.task('stylus', function () {
    return gulp.src(STYL_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(CSS_DEST))
        .pipe(stylus())
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST));
});

// CSS NATIF (*.css)
gulp.task('css_natif', function () {
    return gulp.src(CSS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(CSS_DEST))
        .pipe(autoprefixer('> 1%'))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST));
});

// LIBS CSS (/libs/*.css)
gulp.task('libs_css_statiques', function () {
    return gulp.src(CSS_LIBS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(replace('../images/', '../../images/'))
        .pipe(minifycss())
        .pipe(concat('all.css'))
        .pipe(gulp.dest(CSS_LIBS_DEST));
});

// FONTS CSS (/css/fonts)
gulp.task('css_fonts', function () {
    return gulp.src(CSS_FONTS_SRC)
        .pipe(plumber({errorHandler: gutil.log}))
        .pipe(changed(CSS_FONTS_DEST))
        .pipe(gulp.dest(CSS_FONTS_DEST));
});

// IMAGES
gulp.task('images', function () {
    return gulp.src(IMG_SRC)
        .pipe(changed(IMG_DEST))
        .pipe(gulp.dest(IMG_DEST));
});

// LANGUES
gulp.task('lang_js', function () {
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

    child.on('close', function (code) {
        gutil.log("Remise en cache des langues terminée avec le code", code);
        //gutil.log("You access complete stdout and stderr from here"); // stdout, stderr
    });
});
// ---------------------------------------------------------------------------------------------------------
// --------------------------------- BROWSERIFY ------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

gulp.task('vendor', function (callback) {
    var bundler = browserify({
        // Specify the entry point of your app
        entries: './gulp_utils/foo.js',
        debug: false
    });
    bundler.transform({es6: true, global: true}, reactify);

    // OPTIMISATION DES LIBS EN EXTERNAL
    libs.forEach(function (lib) {
        bundler.require(lib);
    });

    // OPTIMISATION DE LA TAILLE DU BUNDLE
    bundler.transform({
        global: true
    }, 'uglifyify');

    var stream = bundler.bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest(JS_VENDOR_DEST))
        // Report compile errors
        .on('error', handleErrors);

    return stream;
});

// TACHE BROWSERIFY FONCTIONNELLE MULTI BUNDLE
gulp.task('browserify', function (callback) {

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
            debug: config.debug
        });
        bundler.transform({es6: true}, reactify);

        if (!config.debug) {
            bundler.transform({
                global: true
            }, 'uglifyify');
        }

        // Optimisation des libs en external
        libs.forEach(function (lib) {
            bundler.external(lib);
        });

        var bundle = function () {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            var stream = bundler
                .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName));
            // Specify the output destination
            stream.pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);

            return stream;
        };

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

        // Wrap with watchify and rebundle on changes
        bundler = watchify(bundler);
        // Rebundle on update
        bundler.on('update', bundle);

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.bundleConfigs().forEach(browserifyThis);
});


// BOOTLINT
gulp.task('bootlint', function () {
    gulp.src('./bootlint_files/*')
        .pipe(bootlint());
});
