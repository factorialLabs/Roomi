angular.module("roomi").factory('accountService', ['$rootScope', '$meteor', '$q', function($rootScope,$meteor,$q) {

    return $q(function(resolve, reject) {
        $rootScope.currentUserPromise.then(function(user){
            console.log(user);
            var group = Group.findOne({_id:user.profile.group});
            var members = Meteor.users.find({'profile.group':user.profile.group}).fetch();
            var findMembers = $meteor.call("findRoommates", user.profile.group).then(
                function(roommates){
                    members = roommates;
//                    console.log(members);
                     var userInfo = [];

                    userInfo = {
                        user: user,
                        group: group,
                        members: members
                    };
                    console.log(userInfo);
                    if(userInfo)
                        resolve(userInfo);
                    else
                        reject();
                });


        });
    });
}]);
