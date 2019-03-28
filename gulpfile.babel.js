'use strict';

import gulp from 'gulp';
import through from 'through2'
import fm from 'front-matter';
import markdown from 'gulp-markdown';
import handlebars from 'handlebars';
import minifyCSS from 'gulp-csso';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import loadFiles from './utils/load-files';
import path from 'path';
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
 * Process languages folders
 */
export function langs() {
    return gulp.src('src/content/*/')
        .pipe(through.obj((chunk, enc, cb) => {
            // get language code
            var re = new RegExp('([a-zA-Z-]*)$');
            var lang = chunk.path.split(re)[1];
            // get language general data file
            var data = loadFiles(chunk.path + '/data.json')[0].contents;
            var pageData;

            // process page of current language
            var pages = gulp.src('src/content/' + lang + '/**/*.md')
                .pipe(through.obj((chunk, enc, cb) => {
                    let page = fm(chunk.contents.toString()); // get attributes from markdown
                    // define handlebars layout
                    page.attributes.layout = page.attributes.layout || 'default.hbs';

                    // set page data
                    pageData = data;
                    Object.assign(pageData, page.attributes);

                    chunk.contents = new Buffer.from(page.body, 'utf-8');

                    // send modified chunk to stream
                    cb(null, chunk);
                }))
                .pipe(markdown())
                .pipe(through.obj(function(chunk, enc, cb) {
                    var layout = loadFiles(paths.layouts + pageData.layout)[0];
                    var partials = loadFiles(paths.partials + '*.hbs', { absolute: true });

                    // get markdown parsed
                    pageData.contents = chunk.contents;

                    partials.forEach((partial) => {
                        var ext = path.extname(partial.path);
                        var file = partial.contents.toString();
                        var name = path.basename(partial.path, ext);

                        handlebars.registerPartial(name, file);
                    });

                    var template = handlebars.compile(layout.contents.toString());
                    var html = template(pageData);

                    chunk.contents = new Buffer.from(html, "utf-8");

                    cb(null, chunk);
                }))
                .pipe(rename({ extname: '.html' })) // change extesion
                .pipe(gulp.dest(paths.dest.html));

            cb(null, chunk);
        }));
}

/**
 * Generate html files
 */
export function html() {
    // handlebars data, options
    var data = {};
    var options = {
        ignorePartials: true, // ignores the unknown partials in the handlebars template
        batch: [paths.partials],
        helpers: {
            capitals: function(str) {
                return str.toUpperCase();
            }
        }
    };

    return gulp.src('src/content/**/*.md')
        .pipe(through.obj(function(chunk, enc, cb) {
            try {
                let page = fm(chunk.contents.toString()); // get attributes from markdown
                let layout = page.attributes.layout || 'default.hbs'; // define handlebars layout

                console.log(loadFiles());

                // get language code
                let re = new RegExp(paths.src.html + '([a-zA-Z_]*)');
                let lang = chunk.path.split(re)[1];
                // load general data
                chunk.data = require('./' + paths.src.html + lang + '/data.json');
                // set page data
                Object.assign(chunk.data, page.attributes);
                chunk.data.lang = lang;

                // deprecation
                chunk.contents = new Buffer.from(page.body, "utf-8");
            } catch (e) {
                console.log("Error", e);
            } finally {
                // send modified chunk to stream
                cb(null, chunk);
            }
        }))
        .pipe(markdown())
        .pipe(through.obj(function(chunk, enc, cb) {
            try {
                // chunk.data.contents = chunk.contents.toString();

                // var template = handlebars.compile(file.contents.toString());
                // var html = template(chunk.data);

                // console.log(chunk.data);
                // chunk.contents = new Buffer(html, "utf-8");
            } catch (e) {
                console.log("Error", e);
            } finally {
                // send modified chunk to stream
                cb(null, chunk);
            }
        }))
        .pipe(rename({ extname: '.html' })) // change extesion
        .pipe(gulp.dest(paths.dest.html));
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


export const build = gulp.parallel(html, css, js, img);
export const watch = () => gulp.watch([paths.src.css, paths.src.js], build);
export default gulp.series(clean, build);
