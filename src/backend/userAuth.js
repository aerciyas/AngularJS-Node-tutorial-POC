var bcrypt = require('bcryptjs'),
    Q = require('q'),
    mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b341eb1890fae6',
    password: '6ddac6d3',
    database: 'heroku_81ed279db9f7798'
});

var unexpectedErrorMessage = "This is weird, no error was expected. A user query is wrong, or possibly the db isn't up and running.";

function authenticateUser(username, password, deferred)
{
    connection.query('SELECT * FROM local_user WHERE username = ?',
        username,
        function(err, results)
        {
            if(err)
            {
                console.log(unexpectedErrorMessage + " Here is the error: " + err.message);
                deferred.resolve(false);
            }
            else if(results.length == 0)
            {
                console.log("Could not find username in db for signin.");
                deferred.resolve(false);
            }
            else
            {
                connection.query('SELECT password FROM local_user WHERE username = ?',
                    username,
                    function(err, results) {
                        if(err)
                        {
                            console.log(unexpectedErrorMessage + " Here is the error: " + err.message);
                            deferred.resolve(false);
                        }
                        else
                        {
                            console.log("Found user!");
                            var hash = results[0].password;
                            console.log('hash: ' + hash);
                            console.log('password: ' + password);
                            console.log(bcrypt.compareSync(password, hash));
                            if (bcrypt.compareSync(password, hash))
                            {
                                var user = {
                                    "username": username,
                                    "password": hash,
                                    "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG"
                                };
                                deferred.resolve(user);
                            }
                            else
                            {
                                console.log("Passwords don't match!");
                                deferred.resolve(false);
                            }
                        }
                    });
            }

        });

}


function signUpUser(username, password, deferred)
{
    connection.query('SELECT * FROM local_user WHERE username = ?', //query check if user exists, if no add
        username,
        function(err, results){
            if(err)
            {
                console.log(unexpectedErrorMessage + " Here is the error: " + err.message);
                deferred.resolve(false);
            }
            if(results.length == 0)
            {
                console.log('Username is free for use');

                var insertUserQuery = 'INSERT INTO local_user(username, password) VALUES (?)'; //query to put user in database
                var hashedPassword = bcrypt.hashSync(password, 8);
                var userCredentials = [[username, hashedPassword]];
                connection.query(
                    insertUserQuery,
                    userCredentials,
                    function(err){
                        if(err)
                        {
                            console.log(unexpectedErrorMessage + " Here is the error: " + err.message);
                            deferred.resolve(false);
                        }
                        else//success
                        {
                            var hash = bcrypt.hashSync(password, 8);
                            var user = {
                                "username": username,
                                "password": hash,
                                "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG"
                            };
                            console.log("USER: " + user);
                            deferred.resolve(user);
                        }
                    });
            }
            else
            {
                console.log('Username already exists.');
                deferred.resolve(false);
            }
        });
}

//used in local-signup strategy
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