angular.module("roomi").factory('accountService', ['$rootScope', '$meteor', '$q', function($rootScope,$meteor,$q) {

    return $q(function(resolve, reject) {
        $rootScope.currentUserPromise.then(function(user){
        var group = Group.findOne(user.profile.group);
        var userInfo = [];
        userInfo = {
            user: user,
            group: group
        };
        if(userInfo)
            resolve(userInfo);
        else
            reject();
        });
    });
 }]);
