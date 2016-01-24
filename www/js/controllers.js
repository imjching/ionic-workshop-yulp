(function() {
  'use strict';

  angular.module('yulpApp')
    .controller('FeedCtrl', ['YelpAPI', FeedCtrl]);

  function FeedCtrl(YelpAPI) {
    var vm = this; // view model (vm)

    YelpAPI.getData().then(function(res) {
      vm.total = res.data.total;
      vm.businesses = res.data.businesses;

      console.log(vm.businesses);
    });
  }
})();