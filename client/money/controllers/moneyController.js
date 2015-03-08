angular.module("roomi").controller("MoneyController", ['$scope', '$meteor', '$rootScope', 'accountService',
                                                       function($scope, $meteor, $rootScope, accountService){

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
                // Find roommates
                $meteor.call("findRoommates", $scope.groupId).then(
                    function(roommates){
                        $scope.roommates = [];
                        for (var i = 0; i < roommates.length; i++){
                            $scope.roommates.push(new Person(roommates[i].emails[0].address, roommates[i]._id));
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
        for (var i = 0; i < $scope.roommates.length; i++){
            if ($scope.roommates[i].id != $scope.currentUser._id){
                $meteor.call("getPayPair", $scope.currentUser._id, $scope.roommates[i].id, $scope.roommates[i].money).then(
                function(people){
                    console.log(people);
                    var payer = people[0];
                    var payee = people[1];
                    var money = people[2];

                    //Balance doesn't exist.
                    if (!payee.profile.balance){
                        payee.profile.balance = [{user:payer._id, balance:parseFloat(money)}];
                        console.log(payee);
                        $meteor.call("updateBalance", payer, payee).then(
                        function(people){
                            console.log(people);
                        });
                        return;
                    }
                    var index = -1;

                    for (var i = 0; i < payee.profile.balance.length; i++){
                        if (payee.profile.balance[i].user == payer._id){
                            index = i;
                        }
                    }
                    // Balance exists, this payee doesn't
                    if (index == -1){
                        payee.profile.balance.push({user: payer._id, balance:parseFloat(money)});
                    }
                    //Balance exists, payee does too.
                    else{
                        payee.profile.balance[index].balance += parseFloat(money);
                    }
                    console.log(payee);

                    $meteor.call("updateBalance", payer, payee).then(
                    function(people){
                        console.log(people);
                    })
                });
            }
        }

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
