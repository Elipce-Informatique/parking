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

// UTIL REQUIRELMENTS
var bundleLogger = require('./gulp_utils/bundleLogger');
var handleErrors = require('./gulp_utils/handleErrors');
var config       = require('./gulp_utils/config').browserify;

// PATHS
var CSS_SRC = './app/assets/css/**/*.css';
var STYL_SRC = './app/assets/css/**/*.styl';
var CSS_DEST = './public/css';
var JS_ALL_SRC = './app/assets/js/**/*.js';
var JS_LIBS_SRC = './app/assets/js/libs/*.js';
var JS_LIBS_DEST = './public/js/libs';
var JS_BUNDLE_SRC = './app/assets/js/**/*app.js';
var JS_BUNDLE_DEST = './public/js';

// Manipulation des CSS
gulp.task('css', ['stylus', 'css_natif']);

// Manipulation des JS
gulp.task('js', ['libs_js_statiques']);


// BROWSERIFY (*app.js)
//gulp.task('browserify', function(){
//    var browserified = transform(function(filename) {
//        var b = browserify({
//            transform: ['reactify'],
//            entries : filename
//        });
//
//        return b.bundle();
//    });
//
//    return gulp.src(JS_BUNDLE_SRC)
//        .pipe(plumber({errorHandler: gutil.log}))
//        .pipe(browserified)
//        .pipe(gulp.dest(JS_BUNDLE_DEST))
//        .pipe(notify({message: 'Browserify task completed.'}));
//});

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
    gulp.watch(JS_ALL_SRC, ['libs_js_statiques']);
});


/*
// BROWSERIFY INTELLIGENT
gulp.task('watch_browserify', function() {

    var browserified = transform(function(filename) {
        var bundler = watchify(browserify(filename, watchify.args));
        bundler.transform('reactify');

        // Appel à rebundle lors des updates
        bundler.on('update', function(){
            return rebundle(bundler, filename);
        });

        gutil.log("Transform : " + filename);
        return rebundle(bundler, filename);
    });

    return gulp.src(JS_BUNDLE_SRC)
        .pipe(browserified)
        //.pipe(notify({message: 'Browserify task completed.'}));;

    function rebundle(bundler, filename) {
        var filename = _.last(filename.split('\\'));
        gutil.log("Rebundle : " + filename);
        gutil.log("Rebundle : " + JS_BUNDLE_DEST);

        return bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            //.pipe(source(filename))
            .pipe(gulp.dest(JS_BUNDLE_DEST));
    }

});
*/

//var bundler = watchify(browserify(JS_BUNDLE_SRC, watchify.args));
//bundler.transform('brfs');
//
//bundler.on('update', rebundle);
//
//function rebundle() {
//    return bundler.bundle()
//        // log errors if they happen
//        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
//        .pipe(source('bundle.js'))
//        .pipe(gulp.dest(JS_BUNDLE_DEST));
//}
//
//return rebundle();
//
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
//var browserified = transform(function(filename) {
//    var b = browserify({
//        transform: ['reactify'],
//        entries : filename
//    });
//
//    return b.bundle();
//});
//
//return gulp.src(JS_BUNDLE_SRC)
//    .pipe(plumber({errorHandler: gutil.log}))
//    .pipe(browserified)
//    .pipe(gulp.dest(JS_BUNDLE_DEST))
//    .pipe(notify({message: 'Browserify task completed.'}));


/**
 * Tâche par défaut appellée quand on tape la commande 'gulp'
 * - Lance les tâches suivantes a l'init
 *      - CSS
 * - Lance les watchers pour les taches suivantes:
 *      - CSS
 */
gulp.task('default', ['css', 'js', 'watch', 'browserify']);


// Test
gulp.task('browserify', function(callback) {

    var bundleQueue = config.bundleConfigs().length;

    var browserifyThis = function(bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: true,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: config.extensions,
            // Enable source maps!
            debug: config.debug,
            transform : 'reactify'
        });

        var bundle = function() {
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

        var reportFinished = function() {
            // Log when bundling completes
            bundleLogger.end(bundleConfig.outputName)

            if(bundleQueue) {
                bundleQueue--;
                if(bundleQueue === 0) {
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
