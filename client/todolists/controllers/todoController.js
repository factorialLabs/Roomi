angular.module("roomi").controller("TodoController", ['$scope', '$meteor', '$rootScope','accountService',
    function($scope, $meteor, $rootScope, accountService){

        accountService.then(function(data){
            console.log(data);
          $scope.todos = $meteor.collection(function() {
            return Todolist.find({_id:data.group.todolist});
          });

        },function(err){
            console.log(err);
        });

    //subscribe to conversations
    $meteor.autorun($scope, function() {
      $meteor.subscribe('Todolist', {
        limit: 10
      });
    });

    //method called when the user says something
    $scope.add = function(todoInfo){
      $meteor.call('add', todoInfo).then(
        function(data){
          console.log('success responding', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };
}]);
