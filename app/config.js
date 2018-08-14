/*
Create and export configuration server
 */

let environments = {};

// staging (default) environment

environments.staging = {

    'port': 3000,
    'envName': 'staging'

};

environments.production = {

    'port': 5000,
    'envName': 'production'

};


//determine which environment was passed as a command-line argument

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current environment is one of the environment above, if not, default to staging

let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the module

module.exports = environmentToExport;

//start server in production mode in windows "set NODE_ENV=production&&node app/index.js"

