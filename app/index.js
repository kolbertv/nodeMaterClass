/*
Primary file for API
 */

//Dependencies

let http = require('http');
let url = require('url');


//The server should respond to all requests with a string

let server = http.createServer(function (req, res) {

    // Get url and parse it

    console.log(req.url[0]);

    // let myUrl = new url(reg.url);




    // console.log(req.url);
    // let parsedUrl = url.parse(req.url, true);
    // console.log(parsedUrl.pathname);

    // let parsedUrl = url.parse(req.url, true);

    // get the path

    // let path = parsedUrl.pathname;
    // let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // send the response

    res.end('Hello world\n');


    // log the request path


    // console.log('Request received on trimmedPath: ', + trimmedPath);


}) ;

// Start the server, and have it listen on port 3000

server.listen(3000, function () {
   console.log('The server is listening on port 3000');

});