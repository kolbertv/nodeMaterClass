/*
Request handlers
 */

// Dependencies
let _data = require('./data');
let helpers = require('./helpers');


// define the handlers
let handlers = {};


// users

handlers.users = function (data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the users submethods
handlers._users = {};

// User - post
// requires data: firstName, lastName, phone, password, tosAgreement

handlers._users.post = function (data, callback) {
    // check that all required fields are filld out

    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the uset doesnt already exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                // Hash the password
                let hashedPassword = helpers.hash(password);

                // Create user object

                if (hashedPassword) {

                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': tosAgreement
                    };

                    // store user

                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not create the new user'});
                        }
                    })

                } else {
                    callback(500, {'Error': 'Could not hash the user\'s password'});

                }

            } else {
                // user already exist
                callback(400, {'Error': 'A user with that phone number already exists'})
            }
        });
    } else {
        callback(400, {'Error': 'Missing required fields'});
    }

};

// users - get
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object
handlers._users.get = function (data, callback) {
    // check that phone number is valid
    let phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                // Remove hash before returning object
                delete data.hashedPassword;
                callback(200, data)

            } else {
                callback(404);
            }
        });

    } else {
        callback(400, {"Error": "Missing required field"})
    }

};

// users - put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified
// @TODO Only let an authenticated udpaid their own object
handlers._users.put = function (data, callback) {
    // check for the required field
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check for the optional fields
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // lookup the user
            _data.read('users', phone, function (err, userData) {
                if (!err && userData) {
                    // update the fields necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }

                    // store the new updates
                    _data.update('users', phone, userData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not update the user'})
                        }
                    })

                } else {
                    callback(400, {'Error': 'The specified user does not exist'})
                }
            })

        } else {
            callback(400, {'Error': 'Missing fields to update'})
        }

    } else {
        callback(400, {'Error': 'Missing required field'})
    }

};


// users - delete
// required field: phone
// @TODO only for an authenticated user for delete own object
// @TODO delete ay other data files associated with this user
handlers._users.delete = function (data, callback) {
    // check that phone number is valid
    let phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {

                _data.delete('users', phone, function (err) {
                    if(!err){
                        callback(200);
                    } else {
                        callback(500, {'Error': ' Could not delete the specified user'})
                    }
                })

            } else {
                callback(400, {'Error': 'Could not find the specified user'});
            }
        });

    } else {
        callback(400, {"Error": "Missing required field"})
    }


};


// ping handler
handlers.ping = function (data, callback) {
    callback(200);
};


// define not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};


// export module
module.exports = handlers;