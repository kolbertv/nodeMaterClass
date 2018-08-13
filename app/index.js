/*
Primary file for API
 */

//Dependencies

let http = require('http');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;


//The server should respond to all requests with a string

let server = http.createServer(function (req, res) {

    // Get url and parse it

    let parsedUrl = url.parse(req.url, true);

    let path = parsedUrl.pathname;

    let trimedPath = path.replace(/^\/+|\/+$/g, '');

    //get the query string as an object

    let queryStringObject = parsedUrl.query;

    //get http method

    let method = req.method.toLowerCase();

    // get the headers as an object

    let headers = req.headers;

    // get the payload path, if any

    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {
        buffer += decoder.end();

        res.end('Hello world\n');

        console.log('request received with this payload ', buffer);
    });


});

// Start the server, and have it listen on port 3000

server.listen(3000, function () {
    console.log('The server is listening on port 3000');

});