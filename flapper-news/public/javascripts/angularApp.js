var app = angular.module('flapperNews',['ui.router']);

//In angular, factory and service are related in that they are both instances of a third entity called provider.

// We are creating a new object that has an array property called posts. We then return that variable 
//so that our o object essentially becomes exposed to any other Angular module that cares to inject it. 
app.factory('posts',function($http){
	var o  = {
		posts: []
	};
	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			angular.copy(data,o.posts);
		});
	};

	o.create = function(post){
		return $http.post('/posts',post).success(function(data){
			o.posts.push(data);
		});
	};

	o.upvote = function(post){
		return $http.put('/posts/' + post._id + '/upvote')
		.success(function(data){
			post.upvotes += 1;
		});
	};

	o.get = function(id){
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		});
	};

	o.addComment = function(id,comment){
		return $http.post('/posts/' + id + '/comments',comment);
	};

	o.upvoteComment = function(post,comment){
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
		.success(function(data){
			comment.upvotes += 1;
		});
	};

	return o;
});

//Routing using ui-router
app.config(function($stateProvider,$urlRouterProvider){

	$stateProvider
	.state('home',{
		url:'/home',
		templateUrl:'/home.html',
		controller:'MainCtrl',
		resolve:{
			postPromise: ['posts',function(posts){
				return posts.getAll();
			}]
		}
	})

	.state('posts',{
		url: '/posts/{id}',   
		templateUrl: '/posts.html',
		controller: 'PostsCtrl',
		resolve: {
			post: ['$stateParams','posts',function($stateParams,posts){
				return posts.get($stateParams.id);
			}]
		}
	});

	$urlRouterProvider.otherwise('home');
});

app.controller('PostsCtrl',function($scope,posts,post){
	$scope.post = post;
	
	$scope.addComment = function(){
		if($scope.body === ''){ return; }
		posts.addComment(post._id,{
			body: $scope.body,
			author: 'user',
		}).success(function(comment){
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};

	$scope.incrementUpvotes = function(comment){
		posts.upvoteComment(post,comment);
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

		posts.create({
			title: $scope.title,
			link: $scope.link,
		});

		$scope.title='';
		$scope.link='';
	};

	$scope.incrementUpvotes = function(post){
		posts.upvote(post);
	};
});