/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/


require('es6-promise').polyfill();

var gulp = require('gulp');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var copy = require('gulp-contrib-copy');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var syncy = require('syncy');
var rename = require('gulp-rename');
var tsc = require('gulp-typescript');
var merge = require('merge');
var babel = require('gulp-babel');
var templateCache = require('gulp-angular-templatecache');

/**
 * Task configurations.
 */
var config = {
    // NOTE: Using parent paths is potentially dangerous! Be extremely careful!
    // Clean task will empty the contents of this path! This also requires the
    // force == true for the clean task.
    buildDir: '../BuiltAngularApp',
    clean: {
        force: true
    },
    sass: {
        outputStyle: 'compressed'
    },
    autoprefixer: {
        browsers: ['last 2 versions']
    },
    uglify: {
        mangle: true
    },
    angularTemplates: {
        standalone: true,
        module: 'AngularTemplates'
    },
    babel: {
        presets: ['es2015']
    },
    typeScript: {
        sources: ['src/**/*.module.ts', 'src/**/!(app)*.ts', 'src/app.ts'],
        typings: 'scripts/typings/',
        tsProject: tsc.createProject('tsconfig.json')
    }
};


/**
 * Vendor scripts and CSS's that we want to include in the build.
 * NOTE! Order matters here. Include jQuery before Angular to enable
 * Angular's full jQuery support.
 */
var vendor = {
    development: {
        js: [
            'vendor/jquery/dist/**/*.js',
            'vendor/angular/**/*.js',
            'vendor/angular*/**/*.js',
            'vendor/bootstrap/dist/**/.js',

            // Exclude these
            '!vendor/angular*/**/index.js',
            '!vendor/**/*.min.js'
        ],
        css: [
            'vendor/bootstrap/dist/css/*.css',

            // Exclude these
            '!vendor/bootstrap/dist/css/*.min.css'
        ]
    },
    minified: {
        js: [
            'vendor/angular/**/*.min.js',
            'vendor/angular*/**/*.min.js',
            'vendor/jquery/dist/**/*.min.js',
            'vendor/bootstrap/dist/**/.min.js'
        ],
        css: [
            'vendor/bootstrap/dist/css/*.min.css'
        ]
    }
};
    


/**
 * Output directories.
 */
var out = {
    css: config.buildDir + '/styles/',
    vendor: config.buildDir + '/vendor/',
    assets: config.buildDir + '/assets/',
    js: config.buildDir + '/js/',
    index: config.buildDir
};


/**
 * Clean task: removes the whole build directory and temporary directories.
 */
gulp.task('clean-build', function () {
    return gulp.src([
        config.buildDir + '/**/*',
        'tmp',
        'typescript-compiled'
    ]).pipe(clean(config.clean));
});


/**
 * SCSS processing task. Processes the main.scss and uses autoprefixer
 * to add vendor prefixes.
 */
gulp.task('styles', function () {
    var stream = gulp.src('src/styles/main.scss')
       .pipe(sassGlob())
       .pipe(sourceMaps.init())
       .pipe(sass(config.sass).on('error', sass.logError))
       .pipe(autoprefixer(config.autoprefixer))
       .pipe(sourceMaps.write('.'))
       .pipe(gulp.dest(out.css));
    return stream;
});

/**
 * Syncs assets from source directory to build directory.
 */
gulp.task('sync-assets', function() {
    return syncy(['src/assets/**/*'], out.assets, { base: 'src/assets' })
        .on('error', console.error)
        .end();
});

/**
 * Collects angular templates into a template cache script.
 */
gulp.task('angular-templates', function() {
    return gulp.src('src/**/*.tpl.html')
        .pipe(templateCache(config.angularTemplates))
        .pipe(gulp.dest('tmp'));
});

/**
 * Processes all javascripts to a single file, then minifies it for production use.
 * Plain Old Javascript files come first, compiled TS files are added after them.
 * Results in two files, all.js and all.min.js.
 */
gulp.task('scripts', function () {
    // This looks a bit weird, since we want to include app.js last.
    // Also we accommodate for both app.js and app.ts, adding to the confusion.
    return gulp.src(['tmp/templates.js', 'src/**/*.module.js', 'src/**/!(app)*.js', 'src/app.js', 'typescript-compiled/**/*.js', 'typescript-compiled/app.js'])
        .pipe(sourceMaps.init())
        .pipe(babel(config.babel))        
        .pipe(concat('all.js'))        
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(out.js))
        .pipe(uglify(config.uglify))
        .pipe(rename('all.min.js'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(out.js));
});

/**
 * Compiles typescript files into temporary directory.
 */
gulp.task('typescript-compile', function() {
    return gulp.src(config.typeScript.sources)
        .pipe(sourceMaps.init())
        .pipe(tsc(config.typeScript.tsProject))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('typescript-compiled'));
});

/**
 * Currently just copies the index.html to the build directory.
 */
gulp.task('index', function () {
    return gulp.src('src/index.html')
        .pipe(copy())
        .pipe(gulp.dest(out.index));
});

/**
 * Creates the development vendor javascript bundle.
 */
gulp.task('vendor-development-js', function () {
    return gulp.src(vendor.development.js)
        .pipe(concat('vendor.bundle.js'))
        .pipe(gulp.dest(out.vendor));
});

/**
 * Creates the development vendor css bundle.
 */
gulp.task('vendor-development-css', function () {
    return gulp.src(vendor.development.css)
        .pipe(concat('vendor.bundle.css'))
        .pipe(gulp.dest(out.vendor));
});

/**
 * Creates the minifield vendor javascript bundle.
 */
gulp.task('vendor-minified-js', function () {
    return gulp.src(vendor.minified.js)
        .pipe(concat('vendor.bundle.js'))
        .pipe(gulp.dest(out.vendor));
});

/**
 * Creates the minifield vendor css bundle.
 */
gulp.task('vendor-minified-css', function () {
    return gulp.src(vendor.minified.css)
        .pipe(concat('vendor.bundle.css'))
        .pipe(gulp.dest(out.vendor));
});

/**
 * Full build task for development (unminified scripts).
 */
gulp.task('build-development', function() {
    return runSequence(
        'clean-build',
        ['vendor-development-css', 'vendor-development-js', 'sync-assets', 'styles', 'index'],
        'typescript-compile',
        'angular-templates',
        'scripts'
    );
});

/**
 * Full build task for release builds (minified scripts).
 */
gulp.task('build-minified', function () {
    return runSequence(
        'clean-build',
        ['vendor-minified-css', 'vendor-minified-js', 'sync-assets', 'styles', 'index', 'typescript-compile'],
        'angular-templates',
        'scripts'
    );
});

/**
 * Default task, watches changes and applies tasks.
 */
gulp.task('default', ['build-development'], function () {
    gulp.watch('src/**/*.scss', ['styles']);
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('src/**/*.ts', function () { runSequence('typescript-compile', 'scripts') });
    gulp.watch('src/**/*.tpl.html', function() { runSequence('angular-templates', 'scripts') });
    gulp.watch('src/assets/**/*', ['sync-assets']);
});

