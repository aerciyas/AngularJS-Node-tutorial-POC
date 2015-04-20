var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    morgan = require('morgan'),             // log requests to the console (express4)
    userAuth = require('./userAuth.js'), //userAuth file contains our helper functions for our Passport and database work
    cors = require('cors'); // cross origin resource module to allow api calls from browser (isn't intended as cross scripting security, need something additional for that)


exports.api =  function() {

    var app = express();

    //===============PASSPORT===============
    // Passport session setup.
    passport.serializeUser(function(user, done) {
        console.log("serializing " + user.username);
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        console.log("deserializing " + obj);
        done(null, obj);
    });

    //This section will contain our work with Passport
    passport.use('local-signin', new LocalStrategy(
        {passReqToCallback : true}, //allows us to pass back the request to the callback
        function(request, username, password, done) {
            userAuth.localAuth(username, password)
                .then(function (user) {
                    if (user) {
                        console.log("LOGGED IN AS: " + user.username);
                        request.session.success = 'You are successfully logged in ' + user.username + '!';
                        return done(null, user);
                    }
                    if (!user) {
                        console.log("COULD NOT LOG IN");
                        request.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                        return done(null, user);
                    }
                })
                .fail(function (e, err){
                    console.log("Error in authentication: " + err.body);
                });
        }
    ));

     //Use the LocalStrategy within Passport to register/"signup" users.
     passport.use('local-signup', new LocalStrategy(
         {passReqToCallback : true}, //allows us to pass back the request to the callback
         function(request, username, password, done)
         {
             userAuth.localReg(username, password)
                 .then(function success(user)
                     {
                         if (user)
                         {
                             console.log("REGISTERED: " + user.username);
                             request.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                             return done(null, user);
                         }
                         if (!user)
                         {
                             console.log("COULD NOT REGISTER");
                             request.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                             return done(null, user);
                         }
                    })
                     .fail(function (err){
                     console.log(err.body);
                     });
         }
     ));


    //===============EXPRESS================
    // Configure Express
    var rootStaticDirectory = __dirname.replace("backend", "frontend");
    app.use(express.static(rootStaticDirectory));// set the static files location /public/img will be /img for users
    app.use(cors());
    app.use(morgan('dev')); // log every request to the console
    app.use(methodOverride());
    app.use(logger('combined'));
    app.use(cookieParser());
    app.use(session({secret: 'supernova', saveUninitialized: true, resave: false}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //===============ROUTES===============

    //displays homepage
    app.get('/', function (request, response) {
        response.sendFile(rootStaticDirectory + '/index.start.html');
    });

    //sends the request through our local login/signin strategy, and if successful redirects to /userSession, otherwise stays in signin page
    app.post('/login',
        passport.authenticate('local-signin',
            { successRedirect: '/userSession'})
    );

    //sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
    app.post('/signUp', passport.authenticate('local-signup', {
            successRedirect: '/userSession'})
    );

    app.get('/signUpFail', function(request, response)
    {
        response.json(request.session); // NOTE, how this has all session data(COOKIE included)!
    });

    ////logs user out of site, deleting them from the session, and returns to homepage
    app.get('/logout', function(request, response){
        console.log('Getting username before logging out.');
        var name = request.user.username;
        console.log("LOGGIN OUT " + request.user.username);
        request.logout();
        response.redirect('/');
        request.session.notice = "You have successfully been logged out " + name + "!";
    });

    //how very nice of a trick :)D
    app.get('/userSession', function(request, response)
    {
        console.log("Getting user from session...");
        response.json(request.session.passport.user);
        console.log("User fetch from session successful!");    });


    /*
        **
        * Test to play with node api
        *

         app.post('/test', function(request, response){
             var name = request.body.name;
             var body = request.body.body;
             var session = request.session;
             console.log("name: " + name);
             console.log("body: " + body);
             console.log("session: " + session);
             console.log(request.session);

             function test()
             {
             return 'hello world';
             }
             response.json({hello: test()});
         });
     */



    return app;
};
