
var gc_user = require('cloud/user.js');


// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});


/*
 * Allows to register a user using the given details
 *
 * Required parameters:
 * - email
 * - password
 * - firstname
 * - lastname
 *
 * returns the new registered user
 */
Parse.Cloud.define("register", function(request, response)
{
	gc_user.register(request.params).then(
		function(user) {
			response.success(user);
		},
		function(error) {
			console.log(error);
			response.error("Failed to register " + request.params.username);
		}
	);
});


/*
 * Allows to login using the given email and password
 *
 * Required parameters:
 * - email
 * - password
 *
 * returns the user once logged in
 */
Parse.Cloud.define("login", function(request, response)
{
	gc_user.login(request.params).then(
		function(user) {
			response.success(user);
		},
		function(error) {
			console.log(error);
			response.error(error);
		}
	);
});


/*
 * Allows to querying of users to find one with
 * the given first and last name
 *
 * Required parameters:
 * - firstname
 * - lastname
 *
 * Optional parameters:
 * - dev(bypasses security checking)
 *
 * returns a list of matching users
 */
Parse.Cloud.define("getUsers", function(request, response)
{
	gc_user.getUsers(request.params).then(
		function(users) {
			response.success(users);
		},
		function(error) {
			console.log(error);
			response.error(error);
		}
	);
});