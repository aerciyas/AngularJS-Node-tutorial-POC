(function(){
    'use strict';

    var sessionModule = angular.module('eggly.session', [

    ]);

    sessionModule.service('SessionModel', function SessionModel(SessionService, $rootScope, $state)
    {
        var model = this;

        model.updateCurrentUser = function()
        {
            SessionService.getSession()
                .then(
                function success(response)
                {
                    if(response.data)
                    {
                        $rootScope.setCurrentUser(response.data);
                    }
                    else
                    {
                        $rootScope.setCurrentUser(null);
                    }
                });
        };

        model.authenticateUser = function(user)
        {
            var credentials = {username: user.username,
                password:  user.password};

            SessionService.authenticateUser(credentials)
                .then(
                function success(response)
                {
                    $rootScope.setCurrentUser(response.data);
                    $state.go('eggly.categories');
                })
        };

        model.signUpUser = function(newUser)
        {
            var newCredentials = {username: newUser.username,
                password:  newUser.password};

            SessionService.signUpUser(newCredentials)
                .then(
                function success(response)
                {
                    $rootScope.setCurrentUser(response.data);
                    $state.go('eggly.categories');
                })

        };

        model.logout = function(user)
        {
            SessionService.logout(user)
                .then(
                function success(response)
                {
                    console.log(response);
                    $rootScope.setCurrentUser(null);
                    $state.go('eggly.signin')
                }
            )
        };


    });

    sessionModule.factory('SessionService', function SessionService($http, API_URL){

        var sessionService = {};

        sessionService.getSession = function()
        {
            return $http.get(API_URL + '/userSession')
                .error(
                function failure(data, status)
                {
                    alert('Could not retrieve session.');
                    console.log('Could not retrieve session, http status: ' + status);
                });
        };

        sessionService.authenticateUser = function(credentials)
        {
            return $http
                .post(API_URL + '/login', credentials)
                .error(
                function failure(data, status)
                {
                    alert('Username or password is incorrect. Please try again.');
                    console.log('Authentication failed, http status: ' + status);


                    var educationalMessage = 'Educational: Maybe could use AngularJs interceptors to handle http response codes with more care.' +
                        'But for now will use angular constants to handle the statuses. ';
                    console.log(educationalMessage);
                });
        };

        sessionService.signUpUser = function(newCredentials)
        {
            return $http
                .post(API_URL + '/signUp', newCredentials)
                .error(
                function failure(data, status)
                {
                    alert('Failed to create user, try a different username.');
                    console.log('Failed to create user, try a different username. Http status: ' + status);
                }
            );
        };

        sessionService.logout = function(user)
        {
            return $http
                .get(API_URL + '/logout', user)
                .error(
                function failure(data, status)
                {
                    alert('Oh no! We like you too much.. Could not log out.');
                    console.log('Could not log out, http status: ' + status);
                });
        };

        return sessionService;

    });

})();

