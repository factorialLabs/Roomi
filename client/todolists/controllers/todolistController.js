angular.module("roomi").controller("TodolistController", ['$scope', '$meteor', '$rootScope',
  function($scope, $meteor, $rootScope){

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };
    $scope.orderProperty = '1';

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

    $scope.todolist = function(){
      $meteor.collection(function() {
          return Todolist.find({}, {
            sort : $scope.getReactively('sort')
          });
        });
    };

    $meteor.autorun($scope, function() {
      $meteor.subscribe('Todolist', {
        limit: parseInt($scope.getReactively('perPage')),
        skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
        sort: $scope.getReactively('sort')
      }, $scope.getReactively('search')).then(function() {
        
      });
    });

    $scope.create_todolist = function(newTodolist){
        console.log('adding', newTodolist);
        $meteor.call('create_todolist', newTodolist).then(
            function(data){
              console.log('success responding', data);
            },
            function(err){
              console.log('failed', err);
            }
        );
    };
}]);