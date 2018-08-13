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

        //choose the handler this request go to

        let chosenHandler = typeof (router[trimedPath]) != 'undefined' ? router[trimedPath] : handlers.notFound;

        //construct the data object to send to the handler

        let data = {
            'trimedPath': trimedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };


            // router the request to the handler specified in the router
            chosenHandler(data, function (statusCode, payload) {
            // use status code called back by the handler

            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            //use the payload called by handler

            payload = typeof (payload) == 'object' ? payload : {};

            //convert the payload to a string
            let payloadString = JSON.stringify(payload);


            // return the response

            res.writeHead(statusCode);

            res.end(payloadString);


            console.log(statusCode, payloadString);
        });


    });


});

// Start the server, and have it listen on port 3000

server.listen(3000, function () {
    console.log('The server is listening on port 3000');

});


// define the handlers

let handlers = {};


//sample handler

handlers.sample = function (data, callback) {
    //callback a http status code, and a payload object

    callback(406, {'name': 'sample handler'});

};

// define not found handler

handlers.notFound = function (data, callback) {

    callback(404);

};

// define a request router
let router = {

    'sample': handlers.sample

};
