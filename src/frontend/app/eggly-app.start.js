(function(){

    var egglyApp = angular.module('Eggly', [
        'ngAnimate',
        'ui.router',
        'categories',
        'categories.bookmarks',
        'signin',
        'eggly.session'
    ]);

        egglyApp.constant('API_URL', 'http://localhost:3000');

        egglyApp.config(function ($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('eggly',
                    {
                        abstract: true
                    }
                );

                $urlRouterProvider.otherwise('/');
            });
        egglyApp.controller('ApplicationController', function ($rootScope, $scope, API_URL, SessionModel)
        {
             /*
                TODO: Not sure about handing controller(and $rootScope) refresh this way.
                Architecturally could be wrong because it's not verified.
              */
            SessionModel.updateCurrentUser();

            /*
                It's important that this function is defined here because
                setCurrentUser needs to set the current user of this $rootScope
                in order to have influence over the the template it's bound to.
                See where it is used for further reference.
             */
            $rootScope.setCurrentUser = function (user) {
                $rootScope.currentUser = user
            };

            function logout()
            {
                alert('About to log out!');
                SessionModel.logout($rootScope.currentUser);
            }

            $scope.logout = logout;

        });
}());
