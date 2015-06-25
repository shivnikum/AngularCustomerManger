(function() {

    /*var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService'];*/

    /*var CustomersController = function ($location, $filter, $window,
        $timeout, authService, dataService, modalService) {*/


    var injectParams = ['$scope', '$location', '$filter', '$window',
        '$timeout', 'authService', 'dataService', 'customerModalService', '$modal'
    ];

    var CustomersController = function($scope, $location, $filter, $window,
        $timeout, authService, dataService, customerModalService, $modal) {
        var vm = this;

        vm.customers = [];
        vm.filteredCustomers = [];
        vm.filteredCount = 0;
        vm.orderby = 'lastName';
        vm.reverse = false;
        vm.searchText = null;
        vm.cardAnimationClass = '.card-animation';

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        /*vm.myData = [{name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34}];

        vm.gridOptions = { 
          data: 'vm.myData',
          columnDefs: [{
                field: 'name',
                displayName: 'Name',
            }]
        };*/

        vm.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            alert("col.filters[0].term : " + col.filters[0].term);
            if (col.filters[0].term) {
                return 'header-filtered';
            }
            else {
                return '';
            }
        };

        var myHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">' +
            '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>' +
            '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>' +
            '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>' +
            '<div class="ngSortPriority">{{col.sortPriority}}</div>' +
            '<input type="text" ng-model="vm.gridOptions.filterOptions.filterTextName"/>' +
            '</div>' +
            '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

        $scope.$watch('vm.gridOptions.filterOptions.filterTextName', function(searchText, oldsearchText) {
            //console.log("searchText > "+searchText+ ",oldsearchText > "+oldsearchText);
            if (searchText !== oldsearchText && searchText !== "") {
                vm.gridOptions.filterOptions.filterText += "firstName:" + searchText + "; ";
                //console.log("vm.gridOptions.filterOptions.filterText > "+vm.gridOptions.filterOptions.filterText);
            }
            else {
                vm.gridOptions.filterOptions.filterText = '';
            }
        });

        vm.gridOptions = {
            data: 'vm.filteredCustomers',
            headerRowHeight: 60,
            multiSelect: false,
            enableRowSelection: true,
            filterOptions: {
                filterText: '',
                filterTextName: ''
            },
            columnDefs: [{
                    displayName: 'Model New',
                    cellTemplate: '<button  ng-click="vm.addNew(row)" id="editBtn" type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-plus"></button>'
                },
                {
                    displayName: 'Edit Model',
                    cellTemplate: '<button  ng-click="vm.edit(row)" id="editBtn" type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-pencil"></button>'
                },
                {
                    field: 'firstName',
                    displayName: 'F Name',
                    headerCellTemplate: myHeaderCellTemplate
                },
                /*{field: 'lastName', displayName: 'L Name'},*/
                {
                    field: 'city',
                    displayName: 'City'
                }, {
                    field: 'gender',
                    displayName: 'Gender'
                }, {
                    field: 'state.name',
                    displayName: 'State'
                }, {
                    field: 'orderCount',
                    displayName: 'Order'
                }

            ]
        };

        
        vm.addNew = function(row) {
            //alert("row row : " + row.entity.id);
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                controller: 'customerNewEditModelController as vm',
                templateUrl: 'app/customersApp/views/customers/customerNewEditModel.html'
            };
            customerModalService.showModal(modalDefaults, {}).then(function(result) {
                //alert("customerModalService.showModal result.customer = " + result.firstName);
                if (result.firstName !== '') {
                     alert("customerModalService.showModal result.firstName > " + result.firstName);
                }
            });

        }
        
        vm.edit = function(rowObject) {
            //alert("edit row rowObject.entity : " + rowObject.entity);
            var customerObj = rowObject.entity;
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                resolve: {
                    customerObjPopup: function() { 
                        console.log('Before open', customerObj);
                        return customerObj; 
                    }
                },
               controller: 'customerEditModelController as vm',
               templateUrl: 'app/customersApp/views/customers/customerEditModel.html'
            };
            
            var modalInstance = $modal.open(modalDefaults);
            modalInstance.result.then(function (customerObj) {
                alert("modalInstance.result --- "+customerObj.firstName);
                //$scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
                alert('Modal dismissed at: ' + new Date());
            });
        }

        function init() {
            //createWatches();
            getCustomersSummary();
        }

        vm.DisplayModeEnum = {
            Card: 0,
            List: 1
        };

        vm.changeDisplayMode = function(displayMode) {
            switch (displayMode) {
                case vm.DisplayModeEnum.Card:
                    vm.listDisplayModeEnabled = false;
                    break;
                case vm.DisplayModeEnum.List:
                    vm.listDisplayModeEnabled = true;
                    break;
            }
        };

        vm.navigate = function(url) {
            $location.path(url);
        };

        function getCustomersSummary() {
            dataService.getCustomersSummary(vm.currentPage - 1, vm.pageSize)
                .then(function(data) {
                    vm.totalRecords = data.totalRecords;
                    vm.customers = data.results.customers;
                    filterCustomers(''); //Trigger initial filter
                    console.log("getCustomersSummary() vm.filteredCustomers " + vm.filteredCustomers);
                    $timeout(function() {
                        vm.cardAnimationClass = ''; //Turn off animation since it won't keep up with filtering
                    }, 1000);

                }, function(error) {
                    $window.alert('Sorry, an error occurred: ' + error.data.message);
                });
        }

        function filterCustomers(filterText) {
            //vm.filteredCustomers = $filter("nameCityStateFilter")(vm.customers, filterText);
            vm.filteredCustomers = vm.customers;
            vm.filteredCount = vm.filteredCustomers.length;
        }

        function getCustomerById(id) {
            for (var i = 0; i < vm.customers.length; i++) {
                var cust = vm.customers[i];
                if (cust.id === id) {
                    return cust;
                }
            }
            return null;
        }

        init();

    }

    /* $scope.items = ['item1', 'item2', 'item3'];

       $scope.open = function () {
     
         var modalInstance = $modal.open({
         backdrop: true,
         backdropClick: true,
         dialogFade: false,
         keyboard: true,
           templateUrl: 'myModalContent.html',
           controller: ModalInstanceCtrl,
           resolve: {
             items: function () {
               return $scope.items;
             }
           }
         });
     
         modalInstance.result.then(function (selectedItem) {
           $scope.selected = selectedItem;
         }, function () {
           $log.info('Modal dismissed at: ' + new Date());
         });
       };*/

    CustomersController.$inject = injectParams;
    angular.module('customersApp').controller('CustomersController', CustomersController);

}());
