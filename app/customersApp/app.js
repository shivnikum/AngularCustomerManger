(function(){
    var app = angular.module('customersApp', 
                            ['ngRoute', 'ui.bootstrap', 'ngGrid', 'wc.directives']);
                            
    app.config(['$routeProvider', function($routeProvider){

        var viewBase = '/shivnikum/customermanager/CustomerManager/app/customersApp/views/';
        
        $routeProvider
            .when('/customers', {
                controller: 'CustomersController',
                controllerAs: 'vm',
                templateUrl: viewBase + 'customers/customers.html'
            })
            /* .when('/customerorders/:customerId', {
                controller: 'CustomerOrdersController',
                templateUrl: viewBase + 'customers/customerOrders.html',
                controllerAs: 'vm'
            })*/
            .when('/customeredit/:customerId', {
                controller: 'CustomerEditController',
                templateUrl: viewBase + 'customers/customerEdit.html',
                controllerAs: 'vm',
                secure: true //This route requires an authenticated user
            })
            /*.when('/orders', {
                controller: 'OrdersController',
                templateUrl: viewBase + 'orders/orders.html',
                controllerAs: 'vm'
            })
            .when('/about', {
                controller: 'AboutController',
                templateUrl: viewBase + 'about.html',
                controllerAs: 'vm'
            })*/
            .when('/login/', {//'/login/:redirect*?'
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: viewBase + 'login.html'
                
            })
            .otherwise({redirectTo: '/customers'})
        
    }]);
    
    app.run(['$rootScope', '$location', 'authService', function($rootScope, $location, authService){
        //console.log("$routeChangeStart authService.user.isAuthenticated : "+authService.user.isAuthenticated);
        //Client-side security. Server-side framework MUST add it's 
        //own security as well since client-based security is easily hacked
        //$rootScope.$on("$routeChangeStart", function (event, next, current) {
            //console.log("In $routeChangeStart authService.user.isAuthenticated : "+authService.user.isAuthenticated);
            //if (next && next.$$route && next.$$route.secure) {
                if (!authService.user.isAuthenticated) {
                    //console.log("$routeChangeStart authService.user.isAuthenticated : "+authService.user.isAuthenticated);
                    $rootScope.$evalAsync(function () {
                        authService.redirectToLogin();
                    });
                }
            //}
        //});
       
        
    }]);
    
    
})();