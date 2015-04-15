(function(){
    'use strict';

    var singinModule = angular.module('signin', [
        'categories',
        'categories.bookmarks',
        'eggly.session'
    ]);

    singinModule.config(function($stateProvider){
        $stateProvider
            .state('eggly.signin', {
                url: '/',
                views: {
                    'signin@': {
                        templateUrl: 'app/signin/signin.tmpl.html',
                        controller: 'SignInCtrl as signInCtrl'
                    }
                }
            })
        ;
    });


    //TODO: SignInCtrl is too specific for this. This name has to be refactored to be more abstract, something like sessionCtrl?
    singinModule.controller('SignInCtrl', function SignInCtrl(SessionModel) {

        var signInCtrl = this;

        signInCtrl.credentials = {username: '', password: ''};
        function authenticateUser(user)
        {
            SessionModel.authenticateUser(user);
        }

        signInCtrl.newUser = {username: '', password: ''};
        function signUpUser(newUser)
        {
            SessionModel.signUpUser(newUser);
        }

        signInCtrl.authenticateUser = authenticateUser;
        signInCtrl.signUpUser = signUpUser;
    });

})();

