/*
Create and export configuration server
 */

let environments = {};

// staging (default) environment

environments.staging = {

    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret'

};

environments.production = {

    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisAlsoIsASecret'

};


//determine which environment was passed as a command-line argument

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current environment is one of the environment above, if not, default to staging

let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the module

module.exports = environmentToExport;

//start server in production mode in windows "set NODE_ENV=production&&node app/index.js"

