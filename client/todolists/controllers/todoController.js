angular.module("roomi").controller("TodoController", ['$scope', '$meteor', '$rootScope','accountService',
    function($scope, $meteor, $rootScope, accountService){
        console.log(accountService);

        accountService.then(function(data){
          $scope.todos = $meteor.collection(function() {
            return Todolist.find({_id:data.group.todolist});
          });

        },function(err){

        });    

    //subscribe to conversations
    $meteor.autorun($scope, function() {
      $meteor.subscribe('Todolist', {
        limit: 10
        //skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
       // sort: $scope.getReactively('sort')
      });
//    , $scope.getReactively('search')).then(function() {
//        $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);
//      });
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
