'use strict';

// import plugins
let
  gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  concatCss = require('gulp-concat-css'),
  gcmq = require('gulp-group-css-media-queries'),
  cleanCSS = require('gulp-clean-css'),
  pug = require('gulp-pug'),
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
  gulp.watch('./src/html/**/*.pug', gulp.series('html-dev')).on('change', sync.reload);
  gulp.watch('./src/js/**/*.js', gulp.series('js-dev')).on('change', sync.reload);
  gulp.watch('./src/scss/**/*.scss', gulp.series('styles-dev')).on('change', sync.reload);
  gulp.watch('./src/img/**/*.*', gulp.series('images-dev')).on('change', sync.reload);
});


// Templating ---------------------------------------------------------------------------
gulp.task('html-dev', function() {
  return gulp.src([
    './src/html/index.pug',
    './src/html/pages/*.pug'
  ])
  .pipe(plumber())
  .pipe(pug({}))
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
  return gulp.src('./').pipe(gulp.dest('dist'))
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
