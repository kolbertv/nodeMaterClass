/*
Primary file for API
 */

//Dependencies

let http = require('http');
let url = require('url');


//The server should respond to all requests with a string

let server = http.createServer(function (req, res) {

    // Get url and parse it

    // console.log(req.url);
    // res.write(req.url);

    let parsedUrl = url.parse(req.url, true);
    // console.log(parsedUrl.pathname);

    let path = parsedUrl.pathname;
    // console.log(path);

    let trimedPath = path.replace(/^\/+|\/+$/g,'');

    //get the query string as an object

    let queryStringObject = parsedUrl.query;

    console.log(queryStringObject);


    //get http method

    let method = req.method.toLowerCase();


    res.end('Hello world\n');

    console.log(trimedPath + ' with method ' + method);



});

// Start the server, and have it listen on port 3000

server.listen(3000, function () {
    console.log('The server is listening on port 3000');

});