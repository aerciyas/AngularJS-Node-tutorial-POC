(function(){
    'use strict';

    var bookmarkCreateModule = angular.module('categories.bookmarks.create', [

    ]);

    bookmarkCreateModule.config(function($stateProvider){
        $stateProvider
            .state('eggly.categories.bookmarks.create', {
                url: '/bookmarks/create',
                templateUrl: 'app/categories/bookmarks/create/bookmark-create.tmpl.html',
                controller: 'CreateBookmarksCtrl as createBookmarkCtrl'
            })

    });

    bookmarkCreateModule.controller('CreateBookmarksCtrl', function($state, $stateParams, BookmarksModel){

        var createBookmarkCtrl = this;

        function returnToBookmarks()
        {
            $state.go('eggly.categories.bookmarks', {
                category: $stateParams.category
            })
        }

        function cancelCreating()
        {
            returnToBookmarks();
        }

        function createBookmark(bookmark)
        {
            BookmarksModel.createBookmark(bookmark);
            returnToBookmarks();
        }

        function resetForm()
        {
            createBookmarkCtrl.newBookmark = {
                title: '',
                url: '',
                category: $stateParams.category
            }
        }

        createBookmarkCtrl.cancelCreating = cancelCreating;
        createBookmarkCtrl.createBookmark = createBookmark;

        resetForm();
    })

;
})();