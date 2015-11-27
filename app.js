var app = angular.module('flapperNews',['ui.router']);

//In angular, factory and service are related in that they are both instances of a third entity called provider.

// We are creating a new object that has an array property called posts. We then return that variable 
//so that our o object essentially becomes exposed to any other Angular module that cares to inject it. 
app.factory('posts',function(){
	var o  = {
		posts: []
	};
	return o;
});

//Routing using ui-router
app.config(function($stateProvider,$urlRouterProvider){

	$stateProvider
	.state('home',{
		url:'/home',
		templateUrl:'/home.html',
		controller:'MainCtrl'
	})

	.state('posts',{
		url: '/posts/{id}',   
		templateUrl: '/posts.html',
		controller: 'PostsCtrl'
	});

	$urlRouterProvider.otherwise('home');
});

app.controller('PostsCtrl',function($scope,$stateParams,posts){
	$scope.post = posts.posts[$stateParams.id]
	
	$scope.addComment = function(){
		if($scope.body === ''){ return; }
		$scope.post.comments.push({
			body:$scope.body,
			author: 'user',
			upvotes: 0 
		});
		$scope.body = '';
	};

	$scope.incrementUpvotes = function(comment){
		comment.upvotes+=1;
	};
});

app.controller('MainCtrl',function($scope,posts){
	//$scope.test = "Hello World!!";

	//The $scope variable serves as the bridge between Angular controllers and Angular templates. 
	//If you want something to be accessible in the template such as a function or variable, bind it to $scope
	
	$scope.posts = posts.posts; //it gets the posts data from the service
	//Now any change or modification made to $scope.posts will be stored in the service 
	//and immediately accessible by any other module that injects the posts service.

	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') { return; }
		$scope.posts.push({
		title: $scope.title,
		link: $scope.link, 
		upvotes: 0,
		comments: [
		{author:'Joe', body: 'Cool post!', upvotes:0},
		{author:'Bob', body: 'Great idea but everything is wrong!', upvotes:0}
		]
		});

		$scope.title='';
		$scope.link='';
	};

	$scope.incrementUpvotes = function(post){
		post.upvotes+=1;
	};
});