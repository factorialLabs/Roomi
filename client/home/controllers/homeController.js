angular.module("roomi").controller("HomeController", ['$scope', '$meteor', '$rootScope', "UserFactory", function($scope, $meteor, $rootScope, UserFactory){
    $scope.messages = [{user:"Jane", message: "Semi's this Friday, anyone wanna go?"}, {user:"John", message: "Sure, let's go!"}, {user:"Bob", message:"Sure, why not?"}];
    $scope.nextBill = {date:"March 9", cost:"99", person:"Waterloo Hydro"};
    $scope.nextEvent = {date:"March 12", title:"Suite Cleanup"};
    $scope.roommateStatus = [{name:"Jane", status:"Away"}, {name:"John", status:"Home"}, {name:"Bob", status:"Do Not Disturb"}];
    $scope.currentUser = $rootScope.currentUser;
}]);
