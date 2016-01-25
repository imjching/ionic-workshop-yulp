(function() {
  'use strict';

  angular.module('yulpApp')
    .controller('FeedCtrl', ['YelpAPI', FeedCtrl])
    .controller('FeedDetailsCtrl', ['$stateParams', 'YelpAPI', FeedDetailsCtrl])
    .controller('SearchCtrl', ['YelpAPI', '$scope', SearchCtrl]);

  function FeedCtrl(YelpAPI) {
    var vm = this; // view model (vm)

    YelpAPI.getData(function(data) {
      vm.total = data.total;
      vm.businesses = data.businesses;

      console.log(vm.businesses);
    });
  }

  function FeedDetailsCtrl($stateParams, YelpAPI) {
    var vm = this; // view model (vm)

    YelpAPI.searchBusiness($stateParams.businessId, function(data) {
      vm.business = data;
      vm.map = {
        center: {
          latitude: data.location.coordinate.latitude,
          longitude: data.location.coordinate.longitude
        },
        zoom: 14,
        options: { scrollwheel : false }
      };
      vm.marker = {
        center: {
          latitude: data.location.coordinate.latitude,
          longitude: data.location.coordinate.longitude
        },
        options: { draggable : false }
      };
    });
  }

  function SearchCtrl(YelpAPI, $scope) {
    var vm = this; // view model

    vm.toSearch = '';

    vm.search = function() {
      YelpAPI.searchData(vm.toSearch, function(data) {
        vm.businesses = data.businesses;
      });
    }
  }
})();