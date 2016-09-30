var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    uglify = require('gulp-uglify');

var sources = ['src/**/*.js'];

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

gulp.task('dev', function() {
  return gulp.watch(['gulpfile.js','src/**/*.*'], ['build']);
});
