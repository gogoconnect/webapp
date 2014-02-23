
var gc_user = require('cloud/user.js');


// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});

Parse.Cloud.define("register", function(request, response)
{
	gc_user.register(request.params).then(
		function(user) {
			response.success("Registered " + request.params.username);
		},
		function(error) {
			console.log(error);
			response.error("Failed to register " + request.params.username);
		}
	);
});

Parse.Cloud.define("login", function(request, response)
{
	gc_user.login(request.params).then(
		function(user) {
			response.success(user);
		},
		function(error) {
			console.log(error);
			response.error("Failed to login");
		}
	);
});