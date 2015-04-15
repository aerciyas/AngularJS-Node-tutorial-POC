(function(){
    'use strict';

    var categoriesModelModule = angular.module('eggly.models.categories', [

    ]);
    categoriesModelModule.service('CategoriesModel', function($http, $q){
        var model = this,
            URLS = {
                FETCH: 'data/categories.json'
            },
        categories,
        currentCategory;

        function extract(result)
        {
            return result.data;
        }

        function cacheCategories(result)
        {
            categories = extract(result);
            return categories;
        }

        model.getCategories = function(){
                                                                            // Note how cacheCategories
                                                                            // doesn't take in a param.
            return (categories) ? $q.when(categories) : $http.get(URLS.FETCH).then(cacheCategories);
        };

        model.setCurrentCategory = function(categoryName){
            return model.getCategoryByName(categoryName)
                .then(function(category){
                    currentCategory = category;
                });
        };

        model.getCurrentCategory = function()
        {
            return currentCategory;
        };

        model.getCurrentCategoryName = function()
        {
            return currentCategory ? currentCategory.name : ''
        };

        model.getCategoryByName = function(categoryName)
        {
            var deferred = $q.defer();

            function findCategory(categories)
            {
                return _.find(categories, function(c)
                {
                    return c.name == categoryName;
                })
            }

            if(categories) // TODO: This call seems redundant since it's also being checked in getCategories.
            {
                deferred.resolve(findCategory(categories));
            }
            else
            {
                model.getCategories()
                    .then(function(result) // shouldn't this be used?? (in findCategory(result)), so obviously 'result' wasn't used in video.
                    {
                        deferred.resolve(findCategory(result));
                    })
            }

            return deferred.promise;
        };
    });

})();