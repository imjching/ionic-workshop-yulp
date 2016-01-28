(function() {
  'use strict';

  angular.module('yulpApp')
    .factory('YelpAPI', YelpAPI)
    .factory('$localstorage', localStorage);

  localStorage.$inject = ['$window'];

  function localStorage($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }

  YelpAPI.$inject = ['$http', '$ionicLoading', '$localstorage'];

  function YelpAPI($http, $ionicLoading, $localstorage) {
    var homepageOffset = -1;

    function randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
      }
      return result;
    }

    function searchAPI(location, limit, offset, callback) {
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
      if (offset > 0) {
        params.offset = offset; // only send with offset params if it is more than 0. otherwise, oauth signature error
      }
      var consumerSecret = 'crppTAEatTT9P2Nr8qFRFyvJW5M'; //Consumer Secret
      var tokenSecret = 'ChfcWjfXe3r8w2YZKBqbKPTLmLA'; //Token Secret
      var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false });
      params['oauth_signature'] = signature;

      if (offset == 0) {
        $ionicLoading.show( { template: 'Loading...' } );
      }
      $http.get(url, { params : params }).then(function (res) {
        if (offset == 0) {
          $ionicLoading.hide();
        }
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
      var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false });
      params['oauth_signature'] = signature;

      $ionicLoading.show( { template: 'Loading...' } );
      $http.get(url, { params : params }).then(function (res) {
        $ionicLoading.hide();
        callback(res.data);
      });
    }

    function getNextData(force, callback) {
      if (homepageOffset == -1 || force) {
        homepageOffset = 0;
      } else {
        homepageOffset += 10; // increase
      }
      return searchAPI($localstorage.get('defaultLocation', 'Kuala Lumpur'), 10, homepageOffset, callback);
    }

    function searchData(toSearch, callback) {
      return searchAPI(toSearch, 10, 0, callback);
    }

    function searchBusiness(id, callback) {
      return businessAPI(id, callback);
    }

    return {
      getNextData: getNextData,
      searchData: searchData,
      searchBusiness: searchBusiness
    };
  }
})();