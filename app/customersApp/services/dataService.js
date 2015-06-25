(function () {

    var injectParams = ['config', 'customersService'];

    var dataService = function (config, customersService) {
        return customersService;
    };

    dataService.$inject = injectParams;

    angular.module('customersApp').factory('dataService', dataService);

}());

