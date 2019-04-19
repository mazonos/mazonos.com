'use strict';

import gulp from 'gulp';
import through from 'through2'
import fm from 'front-matter';
import markdown from 'gulp-markdown';
import minifyCSS from 'gulp-csso';
import concat from 'gulp-concat';
import responsive from 'gulp-responsive';
import rename from 'gulp-rename';
import tar from 'gulp-tar';
import gzip from 'gulp-gzip';
import md5 from 'md5';
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
        img: 'src/img/**/*.{jpg,png}',
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

// store site data
var data = {
    assets: {}
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
    var langs = loadFiles(paths.src.html + '*/'); // get all languages folders
    var templates = loadTemplates(paths); // register and compile layouts

    // language level
    // get language data file
    langs.forEach((lang) => {
        data[lang.name] = {
            data: loadFiles(lang.path + '/data.yml')[0].contents
        }
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

            // add data with spread objects
            data[lang][chunk.stem] = {
                assets: data.assets, // site level
                ...data[lang].data, // language level
                ...chunk.data, // page attributes
                contents: chunk.contents, // get markdown parsed
                // add some extra data
                lang: lang,
                page: chunk.stem,
                url: {
                    root: '/', // root site
                    lang: `/${lang}/`, // root lang
                    current: `${chunk.dirname.replace(chunk.base, '')}/`, // current dir
                    permalink: `/${chunk.relative}` // current page
                }
            };

            // parse to html
            let html = templates[(chunk.data.layout || 'default')](data[lang][chunk.stem]);
            chunk.contents = new Buffer.from(html, 'utf-8');

            // log process done
            log.info(`Processed '${c.cyan(lang)}' page '${c.cyan(chunk.stem)}'`);

            // send modified chunk to stream
            cb(null, chunk);
        }))
        .pipe(gulp.dest(paths.dest.html));
}

/**
 * Process CSS files
 */
export function css() {
    return gulp.src(paths.src.css)
        .pipe(minifyCSS())
        .pipe(rename({ extname: '.min.css' })) // change extesion
        .pipe(through.obj((chunk, enc, cb) => {
            data.assets[chunk.relative] = chunk.relative + '?id=' + md5(chunk.contents);

            // send chunk to stream
            cb(null, chunk);
        }))
        .pipe(gulp.dest(paths.dest.css));
}

/**
 * Process JS files
 */
export function js() {
    return gulp.src(paths.src.js)
        // .pipe(concat('app.min.js'))
        .pipe(through.obj((chunk, enc, cb) => {
            data.assets[chunk.relative] = chunk.relative + '?id=' + md5(chunk.contents);

            // send chunk to stream
            cb(null, chunk);
        }))
        .pipe(gulp.dest(paths.dest.js));
}

/**
 * Copy vendor folder to destination path
 */
export function vendor() {
    return gulp.src(paths.src.vendor)
        .pipe(gulp.dest(paths.dest.vendor));
}

/**
 * Manipulate images to destination path
 */
export function img() {
    return gulp.src(paths.src.img)
        .pipe(responsive({
            'bg.jpg': {
                width: 1920,
                height: 720,
                crop: 'center',
                withoutEnlargement: true
            },
            'bg-showcase-*.jpg': {},
            'testimonials-*.jpg': {
                width: 192
            },
            'screenshots/*.{jpg,png}': [{
                max: 1920, // resize only bigger than FHD
                quality: 90 // high quality
            }, {
                rename: { prefix: 'thumbnail-' },
                width: 380
            }]
        }, {
            // global config
            quality: 70,
            progressive: true,
            format: 'jpg'
        }))
        .pipe(gulp.dest(paths.dest.img));
}

/**
 * Compress build folder
 */
export function compress() {
    var version = loadFiles('./package.json')[0].contents.version;

    return gulp.src(paths.dest.html + '/**/*')
        .pipe(tar(`build_${version}.tar`))
        .pipe(gzip())
        .pipe(gulp.dest(paths.dest.html));
}


export const build = gulp.series(gulp.parallel(css, js, vendor, img), html);
export const watch = () => gulp.watch([paths.src.html + '**/*', paths.src.css, paths.src.js], build);
export default gulp.series(clean, build, compress);
