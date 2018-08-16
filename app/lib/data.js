/*
 library for storing and editing data
 */

// dependencies

let fs = require('fs');
let path = require('path');


//container for the module (to be exported)
let lib = {};

// base directory of the data folder

lib.baseDir = path.join(__dirname, '/../.data');


// write data to  file
lib.create = function (dir, file, data, callback) {

    // open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {

        } else {
            callback('Could not create new file, it may alredy exist');
        }

    });

};


// export the module

module.exports = lib;