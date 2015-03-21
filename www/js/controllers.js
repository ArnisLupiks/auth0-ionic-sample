angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope, auth, $state, store) {
  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('tab.dash');
    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }

  $scope.$on('$ionic.reconnectScope', function() {
    doAuth();
  });

  doAuth();


})

.controller('DashCtrl', function($scope, $http) {
      $scope.method = 'GET';
      $scope.url = 'http://178.62.126.37:30001/getPosts.php';
      //execute method
      $http({method: $scope.method, url: $scope.url}).
        success(function(data, status) {
          $scope.status = status;
          $scope.posts = data;
          //console.log($scope.posts);
          //add to each post user profile information
          angular.forEach($scope.posts ,function(post){
            //get user id
            var picUsrId = {uid : post.uid };
            //get user information
            $http.post("http://178.62.126.37:30001/getPostUPic.php" , picUsrId)
              .success(function(picdata){
                    //adds picture/name/surname to post object
                    post.picture = picdata[0];
                  //trow error if not successfully executed function
                  }).error(function(err){
                      "ERROR in getPostUPic", console.log(err)
                  });
          })
        }).
        //state errer if couldn't make connection
        error(function(data, status) {
          $scope.posts = data || "Request failed";
          $scope.status = status;
      });
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, auth, store, $state) {
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {reload: true});
  };
});
