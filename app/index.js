/*
Primary file for API
 */

//Dependencies

let http = require('http');
let https = require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');

//instantiate the http server

let httpServer = http.createServer(function (req, res) {

    unifiedServer(req,res);

});

// Start the http server

httpServer.listen(config.httpPort, function () {
    console.log('The server is listening on port: ', config.httpPort + " in " + config.envName + " mode");

});


// instantiate the https server

let httpsServerOptions = {
  'key':fs.readFileSync('./app/https/key.pem'),
  'cert': fs.readFileSync('./app/https/cert.pem')
};
let httpsServer = https.createServer(httpsServerOptions, function (req, res) {

    unifiedServer(req,res);

});


// start https server

httpsServer.listen(config.httpsPort, function () {
    console.log('The server is listening on port: ', config.httpsPort + " in " + config.envName + " mode");

});



// all the server logic for both the http and https server

let unifiedServer = function (req, res) {

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

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);


            console.log(statusCode, payloadString);
        });
    });
};


// define the handlers

let handlers = {};


//sample handler

// handlers.sample = function (data, callback) {
//     //callback a http status code, and a payload object
//
//     callback(406, {'name': 'sample handler'});
//
// };





// define not found handler

handlers.notFound = function (data, callback) {

    callback(404);

};


// ping handler

handlers.ping = function (data, callback) {
    callback(200);
};

// define a request router
let router = {

    'ping': handlers.ping

};



