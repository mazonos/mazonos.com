'use strict';

import glob from 'glob';
import path from 'path'
import fs from 'fs';
import YAML from 'yaml';

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
        file.stat = fs.lstatSync(f);
        Object.assign(file, path.parse(f));

        // only read files contents
        if (file.stat.isFile()) {
            file.contents = fs.readFileSync(file.path, 'utf8');
            // parse data if is json or yaml file
            switch (file.ext) {
                case '.json':
                    file.contents = JSON.parse(file.contents);
                    break;
                case '.yml':
                    file.contents = YAML.parse(file.contents);
                    break;
            }
        }

        files.push(file);
    });

    return files;
}
