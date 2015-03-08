angular.module("roomi").controller("IndexController", ['$scope', '$meteor', function($scope, $meteor){
	$scope.status = "Do Not Disturb";
	$scope.home = "2";
	$scope.bills = 1;
	console.log($scope.home);
}]);

