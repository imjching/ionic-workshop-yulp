(function() {
  'use strict';

  angular.module('yulpApp')
    .factory('YelpAPI', ['$http', '$ionicLoading', YelpAPI]);
    //.factory('anotherService', [anotherService])

  function YelpAPI($http, $ionicLoading) {
    function randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
      }
      return result;
    }

    function searchAPI(location, limit, callback) {
      var method = 'GET';
      var url = 'http://api.yelp.com/v2/search';
      var params = {
        location: location,
        oauth_consumer_key: 'XQEw1QqtFBcg0Jz-pImoBA', //Consumer Key
        oauth_token: 'Dqjyhl2cZjjzGxRJow3dOLVJtI2OTfHE', //Token
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: new Date().getTime(),
        oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        limit: limit,
        cc: 'MY'
      };
      var consumerSecret = 'crppTAEatTT9P2Nr8qFRFyvJW5M'; //Consumer Secret
      var tokenSecret = 'ChfcWjfXe3r8w2YZKBqbKPTLmLA'; //Token Secret
      var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
      params['oauth_signature'] = signature;

      $ionicLoading.show( { template: 'Loading...' } );
      $http.get(url, { params : params }).then(function (res) {
        $ionicLoading.hide();
        callback(res.data);
      });
    }

    function businessAPI(id, callback) {
      var method = 'GET';
      var url = 'http://api.yelp.com/v2/business/' + id;
      var params = {
        oauth_consumer_key: 'XQEw1QqtFBcg0Jz-pImoBA', //Consumer Key
        oauth_token: 'Dqjyhl2cZjjzGxRJow3dOLVJtI2OTfHE', //Token
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: new Date().getTime(),
        oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        cc: 'MY'
      };
      var consumerSecret = 'crppTAEatTT9P2Nr8qFRFyvJW5M'; //Consumer Secret
      var tokenSecret = 'ChfcWjfXe3r8w2YZKBqbKPTLmLA'; //Token Secret
      var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
      params['oauth_signature'] = signature;

      $ionicLoading.show( { template: 'Loading...' } );
      $http.get(url, { params : params }).then(function (res) {
        $ionicLoading.hide();
        callback(res.data);
      });
    }

    function getData(callback) {
      return searchAPI('Kuala Lumpur', 10, callback);
    }

    function searchData(toSearch, callback) {
      return searchAPI(toSearch, 10, callback);
    }

    function searchBusiness(id, callback) {
      return businessAPI(id, callback);
    }

    return {
      getData: getData,
      searchData: searchData,
      searchBusiness: searchBusiness
    };
  }
})();