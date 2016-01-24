(function() {
  'use strict';

  angular.module('yulpApp')
    .factory('YelpAPI', ['$http', YelpAPI]);
    //.factory('anotherService', [anotherService])

  function YelpAPI($http) {
    function getData() {
      return $http.get('/js/data.json');
    }
    return {
      getData: getData
    };
  }
})();