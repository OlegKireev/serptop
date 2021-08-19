const {src, dest, parallel, series, watch} = require('gulp');

const rename = require('gulp-rename');
const notify = require('gulp-notify');
const fs = require('fs');
const del = require('del');
const gulpif = require('gulp-if');
const debug = require('gulp-debug');
const yargs = require('yargs');

const browserSync = require('browser-sync').create();

const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const webpack = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;

const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const favicon = require('gulp-favicons');

const ttftowoff = require('gulp-ttf2woff');
const ttftowoff2 = require('gulp-ttf2woff2');

const argv = yargs.argv;
const production = !!argv.prod;

const webpackConfig = require('./webpack.config.js');
webpackConfig.mode = production ? 'production' : 'development';
const cssStyle = production ? 'compressed' : 'extended';

const path = {
  src: './src/',
  build: './build/',
  html: {
    src: './src/pages/**/*.html',
    build: './build/',
    watch: './src/**/*.html',
    minify: './build/**/*.html',
  },
  styles: {
    src: './src/scss/main.scss',
    build: './build/css/',
    watch: './src/**/*.scss',
  },
  js: {
    src: './src/js/main.js',
    build: './build/js/',
    watch: './src/**/*.js',
  },
  img: {
    src: ['./src/img/**/*.{jpg,png,jpeg,gif,svg}', '!./src/img/sprite/*.svg', '!./src/img/favicon/**/*'],
    build: './build/img/',
    watch: ['./src/img/**/*.{jpg,png,jpeg,gif,svg}', '!./src/img/sprite/*.svg', '!./src/img/favicon/**/*'],
  },
  svg: {
    src: './src/img/sprite/**/*.svg',
    build: './build/img/',
    watch: './src/img/sprite/**/*.svg',
  },
  favicon: {
    src: './src/img/favicon/*.{jpg,jpeg,png}',
    build: './build/img/favicon/',
  },
  resources: {
    src: ['./src/resources/**/*', './src/resources/.htaccess'],
    build: './build/',
    watch: ['./src/resources/**/*', './src/resources/.htaccess'],
  },
  fonts: {
    src: './src/fonts/**/*.ttf',
    srcPath: './src/fonts/',
    build: './build/fonts/',
    watch: './src/fonts/**/*.ttf',
    // scss: "./src/scss/base/_fonts.scss",
    converted: './src/fonts/**/*.{woff,woff2}',
  },
};

function clean() {
  return del(path.build);
}

function html() {
  return src([path.html.src])
    .pipe(
      fileinclude({
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(gulpif(production, htmlmin({collapseWhitespace: true})))
    .pipe(dest(path.html.build))
    .pipe(
      debug({
        title: 'HTML file:',
      })
    )
    .pipe(browserSync.stream());
}

function styles() {
  return src(path.styles.src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: cssStyle,
      }).on('error', notify.onError())
    )
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(
      postcss([
        autoprefixer({
          grid: 'autoplace',
        }),
      ])
    )
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(dest(path.styles.build))
    .pipe(
      debug({
        title: 'CSS file:',
      })
    )
    .pipe(browserSync.stream());
}

function scripts() {
  return src(path.js.src)
    .pipe(webpack(webpackConfig))
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(dest(path.js.build))
    .pipe(
      debug({
        title: 'JS file:',
      })
    )
    .pipe(browserSync.stream());
}

function images() {
  return src(path.img.src)
    .pipe(
      gulpif(
        production,
        imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.mozjpeg({quality: 80, progressive: true}),
          imagemin.optipng({optimizationLevel: 0}),
          imagemin.svgo({
            plugins: [{removeViewBox: true}, {cleanupIDs: false}],
          }),
        ])
      )
    )
    .pipe(dest(path.img.build))
    .pipe(
      debug({
        title: 'Image:',
      })
    );
}

function sprite() {
  return src(path.svg.src)
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
        shape: {
          dimension: {
            precision: 1,
          },
        },
      })
    )
    .pipe(dest(path.svg.build))
    .pipe(
      debug({
        title: 'SVG-sprite:',
      })
    );
}

function favicons() {
  return src(path.favicon.src)
    .pipe(
      favicon({
        icons: {
          appleIcon: true,
          favicons: true,
          online: false,
          appleStartup: false,
          android: false,
          firefox: false,
          yandex: false,
          windows: false,
          coast: false,
        },
      })
    )
    .pipe(dest(path.favicon.build))
    .pipe(
      debug({
        title: 'Favicon:',
      })
    );
}

function resources() {
  return src(path.resources.src)
    .pipe(dest(path.resources.build))
    .pipe(
      debug({
        title: 'Resource:',
      })
    );
}

function convertFonts() {
  src(path.fonts.src)
    .pipe(ttftowoff())
    .pipe(dest(path.fonts.srcPath))
    .pipe(
      debug({
        title: 'Font:',
      })
    );
  return src(path.fonts.src)
    .pipe(ttftowoff2())
    .pipe(dest(path.fonts.srcPath))
    .pipe(
      debug({
        title: 'Font:',
      })
    );
}

function copyFonts() {
  return src(path.fonts.converted)
    .pipe(dest(path.fonts.build))
    .pipe(
      debug({
        title: 'Font:',
      })
    );
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './build',
    },
    port: 4000,
    notify: false,
  });

  watch(path.html.watch, html);
  watch(path.styles.watch, styles);
  watch(path.js.watch, scripts);
  watch(path.img.watch, images);
  watch(path.svg.watch, sprite);
  watch(path.resources.watch, resources);
  watch(path.fonts.watch, series(convertFonts, copyFonts));
}

exports.fonts = series(convertFonts, copyFonts);
exports.favicons = favicons;
exports.build = series(clean, parallel(images, copyFonts, favicons, sprite, resources, styles, scripts, html));

exports.dev = series(clean, parallel(sprite, styles, scripts, favicons, copyFonts, html, images, resources), serve);
