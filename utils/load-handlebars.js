'use strict';

import handlebars from 'handlebars';
import glob from 'glob';
import path from 'path'
import loadFiles from "./load-files";

export default function(pattern, options = { absolute: true }) {
    var partials = loadFiles(pattern, options);

    partials.forEach((partial) => {
        var ext = path.extname(partial.path);
        var file = partial.contents.toString();
        var name = path.basename(partial.path, ext);

        handlebars.registerPartial(name, file.toString());
    });
}
