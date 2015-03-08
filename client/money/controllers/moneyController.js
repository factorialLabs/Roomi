angular.module("roomi").controller("MoneyController", ['$scope', '$meteor', '$rootScope', 'accountService',
                                                       function($scope, $meteor, $rootScope, accountService){

    //Person object - has a name and money.
    var Person = function (name, id, balance){
        this.name = name;
        this.id = id;
        this.balance = balance;
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
                        //console.log(roommates);
                        $scope.roommates = [];
                        var balance;
                        for (var i = 0; i < roommates.length; i++){
                            if (roommates[i].profile.balance){
                                for (var j = 0; j < roommates[i].profile.balance.length; j++){
                                    if (roommates[i].profile.balance && roommates[i].profile.balance[j].user == $scope.currentUser._id){
                                        balance = roommates[i].profile.balance[j].balance;
                                    }
                                }

                            }
                            $scope.roommates.push(new Person(roommates[i].profile.name, roommates[i]._id, balance));
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
                        payee.profile.balance = [];
                    }
                    if (!payer.profile.balance){
                        payer.profile.balance = [];
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

                    //Redo for payer's side
                    index = -1;

                    for (var i = 0; i < payer.profile.balance.length; i++){
                        if (payer.profile.balance[i].user == payee._id){
                            index = i;
                        }
                    }
                    // Balance exists, this payer doesn't
                    if (index == -1){
                        payer.profile.balance.push({user: payee._id, balance:-1*parseFloat(money)});
                    }
                    //Balance exists, payer does too.
                    else{
                        payer.profile.balance[index].balance -= parseFloat(money);
                    }

                    // Update the balances on the server side.
                    $meteor.call("updateBalance", payer, payee).then(
                    function(people){
                        console.log(people);
                        $scope.getRoommates();
                        $scope.food = [];
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
