routerApp.factory("Data", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = 'api/v1/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 1000, 'trustedHtml');
        }
        obj.get = function (q) {
            console.log(serviceBase+q);
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
             console.log(q);
            console.log(object);
            
            console.log(serviceBase+q);
            return $http.post(serviceBase + q, object).then(function (results) {

                console.log(results);
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);