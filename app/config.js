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


