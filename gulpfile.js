'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

var sources = ['src/**/*.js'];
var watchlist = ['src/**/*.js', './*.html', 'gulpfile.js'];

gulp.task('clean', function() {
  return del(['dist/*']);
});

gulp.task('build', ['clean'], function() {
  return gulp.src(sources)
    .pipe(concat('swank-bootstrap.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename('swank-bootstrap.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('reload', function() {
  gulp.src(watchlist)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(watchlist, ['reload']);
});

gulp.task('open', function() {
  gulp.src(__filename)
    .pipe(open({uri: 'http://localhost:8080/test.html', app: 'google-chrome'}));
});

gulp.task('dev', ['build','connect','open', 'watch']);

gulp.task('default', ['connect', 'open', 'watch']);
