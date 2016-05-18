var newApp = angular.module('newApp' , ['ngRoute' , 'firebase'])
.constant('FIREBASE_URL' , 'https://basicajs.firebaseio.com/');

//Controller
newApp.controller('main_control' , ['$rootScope' ,'$firebaseAuth' , 'FIREBASE_URL','$location' , '$firebaseObject', function($rootScope, $firebaseAuth ,FIREBASE_URL,$location , $firebaseObject){
   $rootScope.name = "Arpit";
    var ref = new Firebase(FIREBASE_URL);
   var auth = $firebaseAuth(ref);
   //authrnticated
   auth.$onAuth(function(authUser){
      if(authUser){
          var userRef = new Firebase(FIREBASE_URL  + authUser.uid);
          
          var userObj = $firebaseObject(userRef);
          
          $rootScope.currentUser = userObj;
          console.log($rootScope.currentUser.success);
      } else{
          $rootScope.currentUser = "";
            console.log($rootScope.currentUser.firstName);
      }
   });
   //Logout function
     $rootScope.logout = function(){
       return auth.$unauth();
   };   
   
 }]);
   

newApp.controller('login_control' , ['$scope' ,'$firebaseAuth' , 'FIREBASE_URL','$location' , '$firebaseObject', function($scope, $firebaseAuth ,FIREBASE_URL,$location , $firebaseObject){
   $scope.login = "Login";
   $scope.submit = function(){
   var ref = new Firebase(FIREBASE_URL);
   var auth = $firebaseAuth(ref);
   //authrnticate
   
    auth.$authWithPassword({
        email : $scope.email , 
        password  :$scope.password 
    }).then(function(regUser){
        $location.path('/User');
    }).catch(function(error){
        $scope.message = error.message;
    });
   };
  
}]);

newApp.controller('register_control' , ['$scope' , '$firebaseAuth' , 'FIREBASE_URL','$location' , function($scope , $firebaseAuth ,FIREBASE_URL ,$location){
   var ref = new Firebase(FIREBASE_URL);
   var auth = $firebaseAuth(ref);
   
   $scope.register = "Register";
   $scope.submit = function(){
       auth.$createUser({
          email : $scope.email,
          password : $scope.password
           
       }).then(function(success){
           var regRef = new Firebase(FIREBASE_URL ,  'users')
           .child(success.uid).set({
               date :Firebase.ServerValue.TIMESTAMP ,
               success : success.uid,
               firstName : $scope.fname,
               lastName : $scope.lname ,
               email :$scope.email 
           }); 
           $location.path('/Login');
           $scope.message = "Hi! "+ $scope.fname +" Nice to have uh!!";
       }).catch(function(fail){
           $scope.error  =fail.message;
       })
   };
   
}]);


newApp.controller('user_control' , ['$scope' , function($scope){
   $scope.user = "Success Buddy";
   
}]);

//Route
newApp.config(function($routeProvider){
    $routeProvider
    
    .when('/Login' , {
        templateUrl : 'includes/login.html',
        controller : 'login_control'
    })    
    
      .when('/Register' , {
        templateUrl : 'includes/register.html',
        controller : 'register_control'
    })    
       .when('/User' , {
        templateUrl : 'includes/success.html',
        controller : 'user_control',
        resolve  : {
           
        }
    }) 
    .otherwise({
       redirectTo :  '/'
    }); 
});
//Services
/*
newApp.factory('Authentication' , ['$rootScope' ,'$firebaseAuth' , 'FIREBASE_URL' , function('$rootScope' ,'$firebaseAuth' , 'FIREBASE_URL'){
     var ref = new Firebase(FIREBASE_URL);
     var auth = $firebaseAuth(ref);
     
     return {
         login : function(user){
             $rootScope.message = "Welcome " + 
         },
     }
}]);
*/