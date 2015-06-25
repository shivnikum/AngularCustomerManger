(function() {

    var injectParams = ['$http', '$rootScope', '$q'];

    var authService = function($http, $rootScope, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {
                loginPath: '/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.redirectToLogin = function() {
            $rootScope.$broadcast('redirectToLogin', null);
        }

        factory.login = function(email, password) {
            var deferred = $q.defer();

            var loggedIn = true;
            changeAuth(loggedIn);

            deferred.resolve(loggedIn);

            return deferred.promise;

            /* return $http.post(serviceBase + 'login', { userLogin: { userName: email, password: password } })
                 .then(function(results){
                     var loggedIn = results.data.status;
                     changeAuth(loggedIn);
                     return loggedIn;
                 });*/
        }

        factory.logout = function() {
            return $http.post(serviceBase + 'logout').then(
                function(results) {
                    var loggedIn = !results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        function changeAuth(loggedIn) {
            factory.user.isAuthenticated = loggedIn;
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    authService.$inject = injectParams;
    angular.module('customersApp').factory('authService', authService);

})();