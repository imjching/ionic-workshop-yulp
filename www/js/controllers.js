(function() {
  'use strict';

  angular.module('yulpApp')
    .controller('FeedCtrl', ['YelpAPI', '$scope', FeedCtrl])
    .controller('FeedDetailsCtrl', ['$stateParams', 'YelpAPI', FeedDetailsCtrl])
    .controller('SearchCtrl', ['YelpAPI', '$scope', SearchCtrl]);

  function FeedCtrl(YelpAPI, $scope) {
    var vm = this; // view model (vm)

    vm.canLoad = true;

    vm.loadMore = function() {
      if (!vm.canLoad) {
        return;
      }
      YelpAPI.getNextData(function(data) {
        if (data.businesses.length == 0) {
          vm.canLoad = false; // no more businesses to load
        }
        if (vm.businesses == undefined) {
          vm.businesses = data.businesses;
        } else {
          vm.businesses.push.apply(vm.businesses, data.businesses);
        }
        console.log(vm.businesses);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.$on('$stateChangeSuccess', function() {
      vm.loadMore();
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