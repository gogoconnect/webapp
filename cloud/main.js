
var gc_user = require('cloud/user.js');
var gc_chat = require('cloud/chat.js');

var testUser = "user_0";
var testPass = "user_0";
var testEmail = "user_0@gmail.com";


// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});


///////////////////////////////////////////////////////
///////////////////// USER SYSTEM /////////////////////
///////////////////////////////////////////////////////

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
 * returns a list of matching users
 */
Parse.Cloud.define("getUsers", function(request, response)
{
	if (gc_user.currentUsersIsValid())
	{
		response.error("Must log in before querying for users conversation");
		return;
	}

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


///////////////////////////////////////////////////////
///////////////////// CHAT SYSTEM /////////////////////
///////////////////////////////////////////////////////

/*
 * Allows the current user to join a conversation with a given user
 *
 * Required parameters:
 * - recipient
 *
 * Optional parameters:
 * - dev (bypasses security)
 *
 * returns the id of that conversation
 */
Parse.Cloud.define("joinConversation", function(request, response)
{
	if (gc_user.currentUsersIsValid())
	{
		response.error("Must log in before joining a conversation");
		return;
	}

	gc_chat.joinConversation(request.params).then(
		function(conversation) {
			response.success(conversation);
		},
		function(error) {
			console.log(error);
			response.error(error);
		}
	);
});

/*
 * Allows sending of a message in a given conversation
 *
 * Required parameters:
 * - conversationId
 * - msgText
 *
 * returns the id of that message
 */
Parse.Cloud.define("sendMessage", function(request, response)
{
	if (gc_user.currentUsersIsValid())
	{
		response.error("Must log in before joining a conversation");
		return;
	}

	gc_chat.sendMessage(request.params).then(
		function(message) {
			response.success(message);
		},
		function(error) {
			console.log(error);
			response.error(error);
		}
	);
});


///////////////////////////////////////////////////////
/////////////////// DEV DEV DEV DEV ///////////////////
///////////////////////////////////////////////////////

/*
 * Allows to querying of users to find one with
 * the given first and last name
 *
 * Required parameters:
 * - firstname
 * - lastname
 *
 * returns a list of matching users
 */
Parse.Cloud.define("test_getUsers", function(request, response)
{
	var options = {
        username: testUser,
        email: testEmail,
        password: testPass
    };

    var user = new Parse.User(options);
    user.logIn(testUser, testPass, options).then(
    	function(user)
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
    	}
    );
});

/*
 * Allows the current user to join a conversation with a given user
 *
 * Required parameters:
 * - recipient
 *
 * returns the id of that conversation
 *
 * The backend will figure out by itself if a new convesation
 * needs to be created... if not, it will return the previous id
 */
Parse.Cloud.define("test_joinConversation", function(request, response)
{
	var options = {
        username: testUser,
        email: testEmail,
        password: testPass
    };

    var user = new Parse.User(options);
    user.logIn(testUser, testPass, options).then(
    	function(user)
    	{
			gc_chat.joinConversation(request.params).then(
				function(conversation) {
					response.success(conversation);
				},
				function(error) {
					console.log(error);
					response.error(error);
				}
			);
    	}
    );
});

/*
 * Allows sending of a message in a given conversation
 *
 * Required parameters:
 * - conversationId
 * - msgText
 *
 * returns the id of that message
 */
Parse.Cloud.define("test_sendMessage", function(request, response)
{
	var options = {
        username: testUser,
        email: testEmail,
        password: testPass
    };

    var user = new Parse.User(options);
    user.logIn(testUser, testPass, options).then(
    	function(user)
    	{
			gc_chat.sendMessage(request.params).then(
				function(message) {
					response.success(message);
				},
				function(error) {
					console.log(error);
					response.error(error);
				}
			);
    	}
    );
});

Parse.Cloud.afterSave("Message", function(request)
{
	var options = {
        username: testUser,
        email: testEmail,
        password: testPass
    };

    var user = new Parse.User(options);
    user.logIn(testUser, testPass, options).then(
    	function(user)
    	{
			gc_chat.isMessageForMe(request).then(
				function(result) {
					if (result == true)
					{
						console.log("You got a message man!");
						// WE WANT TO NOTIFY THE FRONT END!
					}
				},
				function(error) {
					console.log(error);
				}
			);
    	}
    );
});