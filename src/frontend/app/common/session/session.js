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
                function success(user)
                {
                    if(user.data)
                    {
                        $rootScope.setCurrentUser(user.data);
                    }
                    else
                    {
                        $rootScope.setCurrentUser(null);
                    }
                },
                function failure(response)
                {
                    alert(response.status + ' ' + response.statusText);
                }
            );
        };

        model.authenticateUser = function(user)
        {
            var credentials = {username: user.username,
                password:  user.password};

            SessionService.authenticateUser(credentials)
                .then(
                function success(user)
                {
                    if(user.data)
                    {
                        $rootScope.setCurrentUser(user.data);
                        $state.go('eggly.categories');
                    }
                },
                handleError)
        };

        model.signUpUser = function(newUser)
        {
            var newCredentials = {username: newUser.username,
                password:  newUser.password};

            SessionService.signUpUser(newCredentials)
                .then(
                function success(user)
                {
                    if(user.data)
                    {
                        $rootScope.setCurrentUser(user.data);
                        $state.go('eggly.categories');
                    }
                },
                handleError)

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
                },
                handleError
            )
        };

        function handleError(response)
        {
            alert('Error: ' + response.data);
        }


    });

    sessionModule.factory('SessionService', function SessionService($http, API_URL){

        var sessionService = {};

        sessionService.getSession = function()
        {
            return $http.get(API_URL + '/userSession')
        };

        sessionService.authenticateUser = function(credentials)
        {
            return $http
                .post(API_URL + '/login', credentials)
                .success(
                function success(response)
                    {
                        return response;
                    })
                .error(
                function failure(response)
                    {
                        var educationalMessage = 'Educational: Maybe could use AngularJs interceptors to handle http response codes with more care.' +
                            'But for now will use angular constants to handle the statuses. ';
                        alert(response.status + ' ' + response.statusText);
                        console.log(educationalMessage);
                        return null;
                    });
        };

        sessionService.signUpUser = function(newCredentials)
        {
            return $http
                .post(API_URL + '/signUp', newCredentials)
                .success(
                function success(response) {
                    return response;
                })
                .error(
                function failure(response)
                    {
                        alert('Failed to create user, http status is: ' + response.status + ' ' + response.statusText);
                        return null;
                    }
            );
        };

        sessionService.logout = function(user)
        {
            return $http
                .get(API_URL + '/logout', user)
                .success(
                function success(response)
                    {
                        return response;
                    })
                .error(
                function failure(response)
                    {
                        alert(response.status + ' ' + response.statusText);
                        return null;
                    });
        };

        return sessionService;

    });

})();

