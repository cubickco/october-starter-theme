
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');

const paths = {
  styles: { src: 'src/scss/**/*.sass', dest: 'assets/build/css/' },
  scripts: { src: 'src/js/**/*.js', dest: 'assets/build/js/' },
  images: { src: 'src/images/**/*', dest: 'assets/build/images/' },
  vendor: { src: 'src/vendor/**/*', dest: 'assets/build/vendor/' }
};

function clean() { return del(['assets/build']); }
function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}
function scripts() {
  return src(paths.scripts.src)
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}
function images() {
  return src(paths.images.src)
    .pipe(imagemin())
    .pipe(dest(paths.images.dest));
}
function vendor() {
  return src(paths.vendor.src).pipe(dest(paths.vendor.dest));
}
function serve() {
  browserSync.init({ proxy: "http://october.test", notify: false, open: true });
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.images.src, images);
  watch("../**/*.htm").on('change', browserSync.reload);
}
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.vendor = vendor;
exports.build = series(clean, parallel(styles, scripts, images, vendor));
exports.default = series(clean, parallel(styles, scripts, images, vendor), serve);
