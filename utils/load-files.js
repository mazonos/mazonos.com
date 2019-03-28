'use strict';

import glob from 'glob';
import path from 'path'
import fs from 'fs';

/**
 * Load files using glob
 */
export default function(pattern, options = { absolute: true }) {
    var filenames = glob.sync(pattern, options); // get filenames path synchronous
    var files = [];

    // read files content
    filenames.forEach((f) => {
        let file = {};
        file.path = f;
        file.extname = path.extname(file.path);
        file.contents = fs.readFileSync(file.path, 'utf8');

        // parse data if is json file
        file.contents = (file.extname === '.json') ? JSON.parse(file.contents) : file.contents

        files.push(file);
    });

    return files;
}
