var bcrypt = require('bcryptjs'),
    Q = require('q'),
    mysql = require('mysql'),
    async = require('async');

var db_config = {
    host: 'your host name',
    user: 'your user name',
    password: 'your password',
    database: 'your database name'
};

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config);


    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

var unexpectedErrorMessage = "This is weird, no error was expected. A user query is wrong, or possibly the db isn't up and running.";
var userNotFoundErrorMessage = "Could not find username in db for signin.";
var maydayError = 'Error error mayday mayday, something is incorrect. Error was: ';

function authenticateUser(username, password, deferred)
{

    async.series([

            function(callback)
            {
                connection.query('SELECT username FROM local_user WHERE usernames = ?',
                    username,
                    function(err, results)
                    {
                        if(err)
                        {
                            deferred.resolve(false);
                            callback(new Error(unexpectedErrorMessage + " Here is the error: " + err.message), null);
                        }
                        else if(results.length == 0)
                        {
                            deferred.resolve(false);
                            callback(new Error(userNotFoundErrorMessage), null);
                        }
                        else
                        {
                            var username = results[0];
                            callback(null, username)
                        }
                    });

            },
            function(callback)
            {
                connection.query('SELECT password FROM local_user WHERE username = ?',
                    username,
                    function(err, results) {
                        if(err)
                        {
                            deferred.resolve(false);
                            callback(new Error(unexpectedErrorMessage + " Here is the error: " + err.message), null)
                        }
                        else
                        {
                            console.log("Found user!");
                            var hash = results[0].password;
                            console.log('hash: ' + hash);
                            console.log('password: ' + password);
                            console.log(bcrypt.compareSync(password, hash));
                            if (bcrypt.compareSync(password, hash)) //success
                            {
                                var user = {
                                    "username": username,
                                    "password": hash
                                };
                                deferred.resolve(user);
                                callback(null, password);
                            }
                            else
                            {
                                deferred.resolve(false);
                                callback(new Error("Passwords don't match!"), null);
                            }
                        }
                    });
            }

        ],
        function(err, results)
        {
            if(err)
            {
                console.log(maydayError + err.message)
            }
            else
            {
                console.log('User authenticated. Username: ' + results[0] + ', password: ' + results[1]);
            }
        });

}


function signUpUser(username, password, deferred)
{

    async.series([

            function(callback)
            {
                connection.query('SELECT username FROM local_user WHERE username = ?',
                    username,
                    function(err, results) {
                        if (err)
                        {
                            deferred.resolve(false);
                            callback(new Error(unexpectedErrorMessage + " Here is the error: " + err.message), null)
                        }
                        if(results.length == 0)
                        {
                            console.log('Username ' + username + ' is free for use');
                            callback(null, username);
                        }
                        else
                        {
                            deferred.resolve(false);
                            callback(new Error('Username already exists.'), null);
                        }
                    });
            },
            function(callback)
            {
                var insertUserQuery = 'INSERT INTO local_user(username, password) VALUES (?)';
                var hashedPassword = bcrypt.hashSync(password, 8);
                var userCredentials = [[username, hashedPassword]];
                connection.query(
                    insertUserQuery,
                    userCredentials,
                    function(err){
                        if(err)
                        {
                            deferred.resolve(false);
                            callback(new Error(unexpectedErrorMessage + " Here is the error: " + err.message), null)
                        }
                        else//success
                        {
                            var hash = bcrypt.hashSync(password, 8);
                            var user = {
                                "username": username,
                                "password": hash
                            };
                            deferred.resolve(user);
                            callback(null, user);
                        }
                    });
            }

        ],
        function(err, results)
        {
            if(err)
            {
                console.log(maydayError + err.message)
            }
            else
            {
                console.log('User ' + results[1].username + ' is successfully signed up!')
            }
        });

}

exports.localReg = function (username, password) {
    var deferred = Q.defer();

    signUpUser(username, password, deferred);

    return deferred.promise;
};

exports.localAuth = function (username, password) {
    var deferred = Q.defer();

    authenticateUser(username, password, deferred);

    return deferred.promise;
};
