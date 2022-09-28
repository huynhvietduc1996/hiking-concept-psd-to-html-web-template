'use strict';

const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
  return src('./src/assets/scss/style.scss', {
    sourcemaps: true,
    allowEmpty: true,
  })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('./dist/assets/css/', { sourcemaps: '.' }));
}

// Browsersync Task
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload);
  watch(
    ['./src/assets/scss/**/*.scss'],
    series(scssTask, browsersyncReload)
  );
}

// Default Gulp Task
exports.default = series(scssTask, browsersyncServe, watchTask);
