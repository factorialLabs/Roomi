
angular.module("roomi").controller("HomeController", ['$scope', '$meteor', '$rootScope', function($scope, $meteor, $rootScope){
    $scope.messages = [{user:"Jane", message: "Semi's this Friday, anyone wanna go?"}, {user:"John", message: "Sure, let's go!"}, {user:"Bob", message:"Sure, why not?"}];
    $scope.nextBill = {date:"March 9", cost:"99", person:"Waterloo Hydro"};
    $scope.nextEvent = {date:"March 12", title:"Suite Cleanup"};
    $scope.roommateStatus = [{name:"Jane", status:"Away"}, {name:"John", status:"Home"}, {name:"Bob", status:"Do Not Disturb"}];
    $scope.todos = [{name:"Restock on Redbull", date:"Mar 3, 2015"}, {name:"Get More Milk", date:"Mar 7, 2015"}, {name:"Go to Res Meeting", date:"Mar 6, 2015"}];
    $scope.currentUser = $rootScope.currentUser;
    $scope.nextBirthday = {name:"Jane", date: "April 18, 2015"};
    console.log($scope.currentUser);
}]);
