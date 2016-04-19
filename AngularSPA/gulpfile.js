/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

// TODO:
// - Asset copying
// - Javascript uglification
// - Angular templates
// - Task chaining

require('es6-promise').polyfill();

var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var copy = require('gulp-contrib-copy');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var syncy = require('syncy');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');

/**
 * Task configurations.
 */
var config = {
    buildDir: 'build',
    sass: {
        outputStyle: 'compressed'
    },
    autoprefixer: {
        browsers: ['last 2 versions']
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
    js: config.buildDir + '/js/'
};


/**
 * Clean task: removes the whole build directory.
 */
gulp.task('clean-build', function () {
    return gulp.src(config.buildDir).pipe(clean());
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

gulp.task('sync-assets', function() {
    return syncy(['src/assets/**/*'], out.assets, { base: 'src/assets' })
        .on('error', console.error)
        .end();
});

gulp.task('angular-templates', function() {
    return gulp.src('src/**/*.tpl.html')
        .pipe(templateCache())
        .pipe(gulp.dest('tmp'));
});


gulp.task('scripts', function() {
    return gulp.src(['src/**/*.js', 'tmp/*.js'])
        .pipe(sourceMaps.init())
        .pipe(concat('all.js'))
        .pipe(gulp.dest(out.js))
        .pipe(uglify({ mangle: true }))
        .pipe(rename('all.min.js'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(out.js));
});

/**
 * Development vendor javascript bundle.
 */
gulp.task('vendor-development-js', function () {
    return gulp.src(vendor.development.js)
        .pipe(concat('vendor.bundle.js'))
        .pipe(gulp.dest(out.vendor));
});

/**
 * Development vendor css bundle.
 */
gulp.task('vendor-development-css', function () {
    return gulp.src(vendor.development.css)
        .pipe(concat('vendor.bundle.css'))
        .pipe(gulp.dest(out.vendor));
});

/**
 * Minifield vendor javascript bundle.
 */
gulp.task('vendor-minified-js', function () {
    return gulp.src(vendor.minified.js)
        .pipe(concat('vendor.bundle.js'))
        .pipe(gulp.dest(out.vendor));
});

/**
 * Minifield vendor css bundle.
 */
gulp.task('vendor-minified-css', function () {
    return gulp.src(vendor.minified.css)
        .pipe(concat('vendor.bundle.css'))
        .pipe(gulp.dest(out.vendor));
});



gulp.task('default', function () {
    return gulp.watch('src/**/*.scss', ['styles']);
});

