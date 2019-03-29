'use strict';

import gulp from 'gulp';
import through from 'through2'
import fm from 'front-matter';
import markdown from 'gulp-markdown';
import minifyCSS from 'gulp-csso';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import log from 'fancy-log'
import c from 'ansi-colors'
import loadFiles from './utils/load-files';
import loadTemplates from './utils/load-handlebars';
import del from 'del';

// general paths
const paths = {
    layouts: 'src/layouts/',
    partials: 'src/layouts/partials/',
    src: {
        css: 'src/css/**/*.css',
        js: 'src/js/*.js',
        vendor: 'src/vendor/**/*',
        img: 'src/img/**/*',
        html: 'src/content/'
    },
    dest: {
        css: 'build/css/',
        js: 'build/js/',
        vendor: 'build/vendor/',
        img: 'build/img/',
        html: 'build/'
    }
}

/**
 * Clean previous builds
 */
export const clean = () => del(paths.dest.html);

/**
 * Process languages to generate html files
 */
export function html() {
    // regexp for extract language code from file path
    var re = new RegExp('([a-zA-Z-]*)$');

    return gulp.src('src/content/*/')
        .pipe(through.obj((chunk, enc, cb) => {
            try {
                var lang = chunk.path.split(re)[1]; // get language code
                var data = loadFiles(chunk.path + '/data.json')[0].contents; // get language data file
                var pageData;
            } catch (e) {
                log.error(c.red(`${e}. In '${c.cyan(lang)}' processing`));
            }

            // process page of current language
            var pages = gulp.src('src/content/' + lang + '/**/*.md')
                .pipe(through.obj((chunk, enc, cb) => {
                    let page = fm(chunk.contents.toString()); // get attributes from markdown

                    // set page data
                    pageData = data;
                    Object.assign(pageData, page.attributes);

                    chunk.contents = new Buffer.from(page.body, 'utf-8');

                    // send modified chunk to stream
                    cb(null, chunk);
                }))
                .pipe(markdown())
                .pipe(through.obj(function(chunk, enc, cb) {
                    // register and compile layouts
                    var templates = loadTemplates(paths);
                    // get markdown parsed
                    pageData.contents = chunk.contents;
                    // parse to html
                    var html = templates[(pageData.layout || 'default')](pageData);

                    chunk.contents = new Buffer.from(html, "utf-8");

                    cb(null, chunk);
                }))
                .pipe(rename({ extname: '.html' })) // change extesion
                .pipe(gulp.dest(paths.dest.html));

            // send modified chunk to stream
            cb(null, chunk);
        }));
}

/**
 * Process CSS files
 */
export function css() {
    return gulp.src(paths.src.css)
        // .pipe(minifyCSS())
        // .pipe(rename({ extname: '.min.css' })) // change extesion
        .pipe(gulp.dest(paths.dest.css));
}

/**
 * Process JS files
 */
export function js() {
    return gulp.src(paths.src.js, { sourcemaps: true })
        // .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.dest.js, { sourcemaps: true }));
}

/**
 * Copy vendor folder to destination path
 */
export function vendor() {
    return gulp.src(paths.src.vendor)
        .pipe(gulp.dest(paths.dest.vendor));
}

/**
 * Copy images to destination path
 */
export function img() {
    return gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.dest.img));
}


export const build = gulp.parallel(html, css, js, vendor, img);
export const watch = () => gulp.watch([paths.src.html + '**/*', paths.src.css, paths.src.js], build);
export default gulp.series(clean, build);
