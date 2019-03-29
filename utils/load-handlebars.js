'use strict';

import handlebars from 'handlebars';
import path from 'path'
import loadFiles from "./load-files";

/**
 * Register all handlebars partials
 * 
 * @param {string} pattern - glob pattern
 * @param {object} options - glob options
 */
export function registerPartials(pattern, options = { absolute: true }) {
    var partials = loadFiles(pattern, options);

    partials.forEach((partial) => {
        let ext = path.extname(partial.path);
        let name = path.basename(partial.path, ext);

        handlebars.registerPartial(name, partial.contents.toString());
    });
}

/**
 * Register handlebars function helpers
 * 
 * @param {object} funcs - object with key as function name and value as function helper
 */
export function registerHelpers(funcs = {}) {

    for (var name in funcs) {
        handlebars.registerHelper(name, funcs[name]);
    }
}

/**
 * Compile all handlebars layout and return a key, value object
 * 
 * @param {string} pattern - glob pattern
 * @param {object} options - glob options
 */
export function compileLayouts(pattern, options = { absolute: true }) {
    var layouts = loadFiles(pattern, options);
    var templates = {}; // store compiled layouts

    layouts.forEach((layout) => {
        let ext = path.extname(layout.path);
        let name = path.basename(layout.path, ext);

        templates[name] = handlebars.compile(layout.contents.toString());
    });

    return templates;
}

/**
 * Register partials and compile layouts of handlebars
 * 
 * @param {object} paths - object with partials and layout folders path
 * @param {object} options - glob options
 */
export default function(paths, options = { absolute: true }) {
    registerPartials(paths.partials + '**/*.hbs', options);

    registerHelpers({
        // if is even
        if_even: function(cond, options) {
            if ((cond % 2) == 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        // see: https://stackoverflow.com/questions/33059203/error-missing-helper-in-handlebars-js/46317662#46317662
        math: function(lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);

            return {
                '+': lvalue + rvalue,
                '-': lvalue - rvalue,
                '*': lvalue * rvalue,
                '/': lvalue / rvalue,
                '%': lvalue % rvalue
            } [operator];
        }
    });

    return compileLayouts(paths.layouts + '*.hbs', options);
}
