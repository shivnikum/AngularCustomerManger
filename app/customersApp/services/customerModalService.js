(function() {

    var injectParams = ['$modal'];

    var customerModalService = function($modal) {

        this.showModal = function(customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function(customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            //Map angular-ui modal custom defaults to modal defaults defined in this service
            angular.extend(tempModalDefaults, customModalDefaults);

            return $modal.open(customModalDefaults).result;
        };
    };

    customerModalService.$inject = injectParams;

    angular.module('customersApp').service('customerModalService', customerModalService);

}());