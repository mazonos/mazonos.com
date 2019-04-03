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
    var re = new RegExp('^([a-zA-Z-]*)'); // regexp for extract language code from file path
    var data = {}; // site data
    var langs = loadFiles(paths.src.html + '*/'); // get all languages folders
    var templates = loadTemplates(paths); // register and compile layouts

    // language level
    // get language data file
    langs.forEach((lang) => {
        data[lang.name] = loadFiles(lang.path + '/data.json')[0].contents;
    });

    // page level
    // process all languages pages
    return gulp.src(paths.src.html + '*/**/*.md')
        .pipe(through.obj((chunk, enc, cb) => {
            let page = fm(chunk.contents.toString()); // get attributes from markdown

            // store data in chunk
            chunk.data = page.attributes;
            chunk.contents = new Buffer.from(page.body, 'utf-8');

            // send modified chunk to stream
            cb(null, chunk);
        }))
        .pipe(markdown())
        .pipe(through.obj(function(chunk, enc, cb) {
            let lang = chunk.relative.split(re)[1];

            data[lang][chunk.stem] = Object.assign(chunk.data, {
                // get markdown parsed
                contents: chunk.contents,
                // add some page data
                lang: lang,
                page: chunk.stem,
                permalink: '/' + chunk.relative
            });

            // parse to html
            let html = templates[(chunk.data.layout || 'default')](chunk.data);

            chunk.contents = new Buffer.from(html, 'utf-8');

            // send modified chunk to stream
            cb(null, chunk);
        }))
        .pipe(rename({ extname: '.html' })) // change extesion
        .pipe(gulp.dest(paths.dest.html))
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
