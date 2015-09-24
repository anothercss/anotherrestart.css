var gulp = require('gulp')
var gulpif = require('gulp-if')
var postcss = require('gulp-postcss')
var rename = require('gulp-rename')
var cssmin = require('gulp-cssmin')
var csscomb = require('gulp-csscomb')

var header = require('gulp-header')
var moment = require('moment')

var paths = {
  css: {
    src: './anotherrestart.css',
    dest: './dist',
    examples: './examples/css',
    watch: './anotherrestart.css'
  }
}

var processors = [
  require('autoprefixer-core')(),
  require('postcss-discard-comments')({
    removeAll: true
  })
]

var pkg = require('./package.json');
var banner = [
  '/*!',
  ' <%= pkg.name %>',
  ' | v<%= pkg.version %>',
  ' | <%= pkg.license %>',
  ' | ' + moment().format("Do MMM YYYY"),
  ' */',
  '\n \n'
].join('');

var buildTask = function(options) {
  return gulp.src(options.src)
    .pipe(postcss(processors))
    .pipe(csscomb())
    .pipe(gulpif(options.banner, header(banner, { pkg : pkg } )))
    .pipe(gulp.dest(options.dest))
    .pipe(gulp.dest(options.examples))
    .pipe(gulpif(options.minify, rename({
      extname: ".min.css"
    })))
    .pipe(gulpif(options.minify, cssmin(options.cssmin)))
    .pipe(gulpif(options.minify, gulp.dest(options.dest)))
    .pipe(gulpif(options.minify, gulp.dest(options.examples)))
}

gulp.task('dev', function() {
  buildTask({
    src: paths.css.src,
    minify: false,
    banner: false,
    dest: paths.css.dest,
    examples: paths.css.examples
  })
})

gulp.task('watch', function() {
  gulp.watch(paths.css.watch, ['dev'])
})

gulp.task('prod', function() {
  buildTask({
    src: paths.css.src,
    minify: true,
    banner: true,
    cssmin: {
      advanced: true,
      aggressiveMerging: true,
      benchmark: false,
      compatibility: '*',
      debug: false,
      keepBreaks: false,
      mediaMerging: true,
      roundingPrecision: 10,
      shorthandCompacting: false
    },
    dest: paths.css.dest,
    examples: paths.css.examples
  })
})
