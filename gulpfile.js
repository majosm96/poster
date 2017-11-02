/**
 * Basic gulp file for static site development.
 * 
 */
/* eslint-env node */

'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var prefix = require('gulp-autoprefixer')
var connect = require('gulp-connect')
var eyeglass = require("eyeglass")
var kss = require('kss')
var eslint = require('gulp-eslint')
var babel = require('gulp-babel')
var concat = require('gulp-concat')

var sassOptions = {
  outputStyle: 'expanded',
  eyeglass: {
    enableImportOnce: false
  }
}

//
// Begin Gulp Tasks.
//

//
// HTML Dev Workflow.
//
gulp.task('html:dev', function () {
  return gulp.src(['src/**/*html', '!src/sass/*'])
    .pipe(gulp.dest('.tmp'))
    .pipe(connect.reload())
})

//
// Images Dev Workflow.
//
gulp.task('images:dev', function () {
  return gulp.src('src/**/*.{png,jpg,jpeg,gif}')
    .pipe(gulp.dest('.tmp'))
    .pipe(connect.reload())
})

//
// CSS Dev Workflow.
//
gulp.task('styles:dev', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass(sassOptions)).on('error', sass.logError))
    .pipe(prefix(["last 2 versions"]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'))
    .pipe(connect.reload())
})

//
// Javascript Dev Workflow.
//
gulp.task('js:dev', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/js'))
})

//
// Javascript linting.
//
gulp.task('lint', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

//
// KSS Styleguide.
//

gulp.task('styleguide', function () {
  return kss({
    source: 'src/sass',
    destination: '.tmp/styleguide',
    css: '../css/styles.css',
    homepage: 'styleguide.md'
  })
})

//
// Dev server.
//
gulp.task('connect', function () {
  connect.server({
    livereload: true,
    port: 8686,
    root: '.tmp'
  })
})

//
// Watch task.
//
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['styles:dev'])
  gulp.watch('src/**/*.html', ['html:dev'])
  gulp.watch('src/**/*.(png|jpe?g|gif)', ['images:dev'])
  gulp.watch('src/js/**/*.js', ['lint', 'js:dev'])
  gulp.watch('src/sass/**/*', ['styleguide'])
})

//
// Task declarations.
//
gulp.task('dev', ['html:dev', 'images:dev', 'styles:dev', 'js:dev', 'styleguide', 'connect', 'watch'])
