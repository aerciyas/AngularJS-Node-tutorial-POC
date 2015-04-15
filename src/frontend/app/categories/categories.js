(function()
{
    'use strict';

    var categoriesModule = angular.module('categories', [
        'eggly.models.categories'
    ]);
        categoriesModule.config(function($stateProvider){
            $stateProvider
                .state('eggly.categories', {
                    url: '/categories',
                    views: {
                        'categories@': {
                            controller: 'CategoriesListCtrl as categoriesListCtrl',
                            templateUrl: 'app/categories/categories.tmpl.html'
                        },
                        'bookmarks@': {
                            controller: 'BookmarksListCtrl as bookmarksListCtrl',
                            templateUrl: 'app/categories/bookmarks/bookmarks.tmpl.html'
                        }
                    }
                })
            ;
        });
        categoriesModule.controller('CategoriesListCtrl', function CategoriesCtrl(CategoriesModel){
            var categoriesListCtrl = this;

            CategoriesModel.getCategories().then(function(categories)
            {
                categoriesListCtrl.categories = categories;
            });
        })
    ;


}());
