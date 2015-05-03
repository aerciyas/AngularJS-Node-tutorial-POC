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
    cors = require('cors'); // to allow api calls from browser (isn't intended as cross scripting security, would need something additional for that)


exports.api =  function() {

    var app = express();

    //===============PASSPORT===============
    passport.serializeUser(function(user, done) {
        console.log("serializing " + user.username);
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        console.log("deserializing " + obj);
        done(null, obj);
    });

    passport.use('local-signin', new LocalStrategy(
        {passReqToCallback : true},
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
                        request.session.error = 'Could not log user in. Please try again.'; 
                        return done(null, user);
                    }
                })
                .fail(function (e, err){
                    console.log("Error in authentication: " + err.body);
                });
        }
    ));

     passport.use('local-signup', new LocalStrategy(
         {passReqToCallback : true}, 
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
                             request.session.error = 'That username is already in use, please try a different one.'; 
                             return done(null, user);
                         }
                    })
                     .fail(function (err){
                     console.log(err.body);
                     });
         }
     ));


    //===============EXPRESS================
    var rootStaticDirectory = __dirname.replace("backend", "frontend");
    app.use(express.static(rootStaticDirectory));
    app.use(cors());
    app.use(morgan('dev')); 
    app.use(methodOverride());
    app.use(logger('combined'));
    app.use(cookieParser());
    app.use(session({secret: 'supernova', saveUninitialized: true, resave: false}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //===============ROUTES===============

    app.get('/', function (request, response) {
        response.sendFile(rootStaticDirectory + '/index.start.html');
    });

    app.post('/login',
        passport.authenticate('local-signin',
            { successRedirect: '/userSession'})
    );

    app.post('/signUp', passport.authenticate('local-signup', {
            successRedirect: '/userSession'})
    );

    app.get('/signUpFail', function(request, response)
    {
        response.json(request.session);
    });

    app.get('/logout', function(request, response){
        console.log('Getting username before logging out.');
        var name = request.user.username;
        console.log("LOGGIN OUT " + request.user.username);
        request.logout();
        response.redirect('/');
        request.session.notice = "You have successfully been logged out " + name + "!";
    });

    app.get('/userSession', function(request, response)
    {
        console.log("Getting user from session...");
        response.json(request.session.passport.user);
        console.log("User fetch from session successful!");    
    });

    return app;
};
