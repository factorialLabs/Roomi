angular.module("roomi").controller("MoneyController", ['$scope', '$meteor', '$rootScope', function($scope, $meteor, $rootScope){

    //Person object - has a name and money.
    var Person = function (name, id){
        this.name = name;
        this.id = id;
        this.money = "0.00";

    }

    //GroceryItem object - has a cost and excludePeople
    var GroceryItem = function(name, cost){
        this.name = name;
        this.cost = cost;
        this.people = new Array ($scope.roommates.length);

        //Assume everyone wants the new items that are added.
        for (var i = 0; i < $scope.roommates.length; i++){
            this.people[i] = false;
        }
    }

    var getCurrentUser = $rootScope.currentUserPromise.then(
        function(currentUser){
            $scope.currentUser = currentUser;
            $scope.groupId = currentUser.profile.group;
            console.log($scope.currentUser);
            console.log($scope.groupId);

            $scope.getRoommates = function(){
                console.log("Find roommates");
                $meteor.call("findRoommates", $scope.groupId).then(
                    function(roommates){
                        $scope.returnedRoommates = roommates;
                        console.log($scope.returnedRoommates);
                        $scope.roommates = [];
                        for (var i = 0; i < $scope.returnedRoommates.length; i++){
                            console.log($scope.returnedRoommates[i]);
                            $scope.roommates.push(new Person($scope.returnedRoommates[i].emails[0].address, $scope.returnedRoommates._id));
                        }
                        console.log($scope.roommates);
                    });

            };
            $scope.getRoommates();
        });

    $scope.food = [];
    $scope.newName;
    $scope.newFood;





    $scope.updateBalances = function(){

    };


    $scope.addFood = function(){
        if ($scope.newFood && $scope.newFood.name && !isNaN($scope.newFood.cost) && parseFloat($scope.newFood.cost) > 0){
            $scope.food.push(new GroceryItem ($scope.newFood.name, parseFloat($scope.newFood.cost).toFixed(2)));
            $scope.newFood = null;
        }
        $scope.calculateMoney();
    };

    $scope.editFood= function(index){
        console.log($scope.food[index]);
        $scope.food[index].isEditing = true;
        $scope.food[index].editName = $scope.food[index].name;
        $scope.food[index].editCost = parseFloat($scope.food[index].cost);
    };

    $scope.saveFood = function(index){
        $scope.food[index].name = $scope.food[index].editName;
        if (!isNaN($scope.food[index].editCost)){
            $scope.food[index].cost = parseFloat($scope.food[index].editCost).toFixed(2);
            $scope.food[index].isEditing = false;
        }
        $scope.calculateMoney();
    };

    $scope.removeFood = function(index){
        if ($scope.food){
            $scope.food = $scope.food.slice(0, index).concat($scope.food.slice(index+1));
        }
        $scope.calculateMoney();
    };

    $scope.calculateMoney = function(){

        //Zero out
        for (var person = 0; person < $scope.roommates.length; person++){
            $scope.roommates[person].money = 0;
        }

        for (var item = 0; item < $scope.food.length; item++){
            var numPeoplePaying = 0;
            var costPerPerson = 0;

            for (var person = 0; person < $scope.roommates.length; person++){
                if ($scope.food[item].people[person] === false){
                    numPeoplePaying++;
                }
            }

            costPerPerson = parseFloat($scope.food[item].cost)/numPeoplePaying;

            for (var person = 0; person < $scope.roommates.length; person++){
                if ($scope.food[item].people[person] === false){
                    $scope.roommates[person].money += costPerPerson;
                }
            }
        }
        for (var person = 0; person < $scope.roommates.length; person++){
            $scope.roommates[person].money = $scope.roommates[person].money.toFixed(2);
        }
    };



}]);
