'use strict';

// import plugins
let
  gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  concatCss = require('gulp-concat-css'),
  gcmq = require('gulp-group-css-media-queries'),
  cleanCSS = require('gulp-clean-css'),
  htmlTemplate = require('gulp-template-html'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  plumber = require('gulp-plumber'),
  replace = require('gulp-replace'),
  del = require('rimraf'),
  sync = require('browser-sync')

// ##########################################################
// Development ~ MODE ~
// ##########################################################

// clean dev folder
gulp.task('cleaning-dev', function () {
  return del('.dev');
});

// create new dev-folder
gulp.task('create-dev-cache', function() {
  return gulp.src('./src').pipe(gulp.dest('.dev'));
});

// creating local-server
gulp.task('serve', function() {
  sync.init({
    server: { baseDir: '.dev' },
    open: false,
    notify: false,
  });

  // watchers
  gulp.watch('./src/html/**/*.html', gulp.series('html-dev')).on('change', sync.reload);
  gulp.watch('./src/js/**/*.js', gulp.series('js-dev')).on('change', sync.reload);
  gulp.watch('./src/scss/**/*.scss', gulp.series('styles-dev')).on('change', sync.reload);
  gulp.watch('./src/img/**/*.*', gulp.series('images-dev')).on('change', sync.reload);
});


// Templating ---------------------------------------------------------------------------

gulp.task('html-dev', function() {
  return gulp.src([
    './src/html/pages/**/*.html'
  ])
  .pipe(plumber())
  .pipe(htmlTemplate('./src/html/templates/default.html'))
  .pipe(gulp.dest('.dev/'))
});


// Styles --------------------------------------------------------------------------------
gulp.task('styles-dev', function() {
  return gulp.src([
    './src/scss/app.scss'
  ])
  .pipe(plumber())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(concatCss('styles.min.css'))
  .pipe(autoprefixer())
  .pipe(gcmq())
  .pipe(cleanCSS())
  .pipe(gulp.dest('.dev/css'))
});


// JavaScripts ---------------------------------------------------------------------------
gulp.task('js-dev', function() {
  return gulp.src([
    './src/js/app.js',
  ])
  .pipe(plumber())
  .pipe(babel())
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('.dev/js'))
});


// Fonts ---------------------------------------------------------------------------------
gulp.task('fonts-dev', function() {
  return gulp.src([
    './src/fonts/**/*.*'
  ])
  .pipe(gulp.dest('.dev/fonts'))
});


// Images --------------------------------------------------------------------------------
gulp.task('images-dev', function() {
  return gulp.src([
    './src/img/**/*.*'
  ])
  .pipe(gulp.dest('.dev/img'))
});



// ###########################################################################################
// PRODUCTION MODE
// ###########################################################################################

// clean build folder
gulp.task('cleaning-build', function () {
  return del('dist');
});

// create new build-folder
gulp.task('create-build-folder', function() {
  return gulp.src('./src/*').pipe(gulp.dest('dist/'))
});

// html build
gulp.task('html-prod', function() {
  return gulp.src([
    './src/html/pages/**/*.html'
  ])
  .pipe(plumber())
  .pipe(htmlTemplate('./src/html/templates/default.html'))
  .pipe(gulp.dest('dist/'))
});

// styles build
gulp.task('styles-prod', function() {
  return gulp.src([
    './src/scss/app.scss'
  ])
  .pipe(plumber())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(concatCss('styles.min.css'))
  .pipe(autoprefixer())
  .pipe(gcmq())
  .pipe(cleanCSS())
  .pipe(gulp.dest('dist/css'))
});

// js build
gulp.task('js-prod', function() {
  return gulp.src([
    './src/js/app.js',
  ])
  .pipe(plumber())
  .pipe(babel())
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
});

// fonts build
gulp.task('fonts-prod', function() {
  return gulp.src([
    './src/fonts/**/*.*'
  ])
  .pipe(gulp.dest('dist/fonts'))
});

// images for build
gulp.task('images-prod', function() {
  return gulp.src([
    './src/img/**/*.*'
  ])
  .pipe(gulp.dest('dist/img'))
});

// cleaning unnecessary things
gulp.task('cleaning-unnecessary', function () {
  return del([
    'dist/html', 'dist/scss'
  ])
});







// #######################################################################
// GULP COMMANDS
// ########################################################################

gulp.task('dev', gulp.series(
  'cleaning-dev',
  'create-dev-cache',
  'html-dev',
  'styles-dev',
  'js-dev',
  'fonts-dev',
  'images-dev',
  'serve'
));


gulp.task('build', gulp.series(
  'cleaning-build',
  'create-build-folder',
  'html-prod',
  'styles-prod',
  'js-prod',
  'fonts-prod',
  'images-prod',
  'cleaning-unnecessary'
));