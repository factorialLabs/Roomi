angular.module("roomi").controller("HomeController", ['$scope', '$meteor', '$rootScope', 'accountService', '$state', function($scope, $meteor, $rootScope, accountService, $state){
    accountService.then(function(data){
        if (data == null){
            console.log("Go landing");
            $state.go('landingPage', {}, {});
        }

        },function(err){
        console.log(err);
        $state.go('landingPage', {}, {});
    });
    $scope.messages = [{user:"Jane", message: "Semi's this Friday, anyone wanna go?"}, {user:"John", message: "Sure, let's go!"}, {user:"Bob", message:"Sure, why not?"}];
    $scope.nextBill = {date:"March 9", cost:"99", person:"Waterloo Hydro"};
    $scope.nextEvent = {date:"March 12", title:"Jane's Birthday Dinner!"};
    $scope.roommateStatus = [{name:"Jane", status:"Away"}, {name:"John", status:"Home"}, {name:"Bob", status:"Do Not Disturb"}];
    $scope.todos = [{name:"Restock on Redbull", date:"Mar 3, 2015"}, {name:"Get More Milk", date:"Mar 7, 2015"}, {name:"Go to Res Meeting", date:"Mar 6, 2015"}];
    $scope.currentUser = $rootScope.currentUser;
    $scope.nextBirthday = {name:"Jane", date: "April 18, 2015"};
}]);
