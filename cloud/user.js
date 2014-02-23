
///////////////////////////////////////////////////////
//////////////////////// TOOLS ////////////////////////
///////////////////////////////////////////////////////

function getEmailPrefix(email)
{
    return email.substring(0, email.indexOf("@"));
}

function isUserAuthenticated(username)
{
    var currentUser = Parse.User.current();
    if (!currentUser)                               return false;
    if (!currentUser.authenticated())               return false;
    if (!username || username == undefined)         return true;
    if (currentUser.getUsername() != username)      return false;

    return true;
}
exports.currentUsersIsValid = function()
{
    var currentUser = Parse.User.current();
    if (!currentUser)                           return false;
    if (!currentUser.authenticated())           return false;

    return true;
}


///////////////////////////////////////////////////////
//////////////////// The REAL DEAL ////////////////////
///////////////////////////////////////////////////////

exports.register = function(parameters)
{
    var promise = new Parse.Promise();

    if ((!parameters.password && typeof parameters.password == 'undefined') ||
        (!parameters.email && typeof parameters.email == 'undefined') ||
        (!parameters.firstname && typeof parameters.firstname == 'undefined') ||
        (!parameters.lastname && typeof parameters.lastname == 'undefined'))
    {
        console.log("Registration request is missing some parameters");
        promise.reject("Registration request is missing some parameters");
        return promise;
    }

    var username = getEmailPrefix(parameters.email);
    var password = parameters.password;
    var email = parameters.email;
    var first = parameters.firstname;
    var last = parameters.lastname;

    return register_a_user(username, password, email, first, last);
};

function register_a_user(username, password, email, first, last)
{
    var promise = new Parse.Promise();

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('email', email);

    user.set('firstname', first);
    user.set('lastname', last);

    user.signUp().then(function(user)
    {
        promise.resolve(user);
    },
    function(error)
    {
        promise.reject("User Not Created");
    });

    return promise;
}

//
// Returns true if user can login with this username
//
exports.login = function(parameters)
{
    var promise = new Parse.Promise();

    if ((!parameters.password && typeof parameters.password == 'undefined') ||
        (!parameters.email && typeof parameters.email == 'undefined'))
    {
        console.log("Can't login without username and password");
        promise.reject("Can't login without username and password");
        return promise;
    }

    var username = getEmailPrefix(parameters.email);
    var password = parameters.password;

    if (isUserAuthenticated(username))
    {
        console.log("Already logged in");
        promise.resolve(Parse.User().current());
        return promise;
    }

    var options = {
        username: username,
        email: parameters.email,
        password: password
    };

    var user = new Parse.User(options);
    return user.logIn(username, password, options);
};

//
// Returns true if user can login with this username
//
exports.getUsers = function(parameters)
{
    var promise = new Parse.Promise();

    if ((!parameters.firstname && typeof parameters.firstname == 'undefined') ||
        (!parameters.lastname && typeof parameters.lastname == 'undefined'))
    {
        console.log("Can't lookup a user if you don't give me their name!");
        promise.reject("Can't lookup a user if you don't give me their name!");
        return promise;
    }

    if (!isUserAuthenticated())
    {
        console.log("User trying to search without being logged in");
        promise.reject("User trying to search without being logged in");
        return promise;
    }

    var query = new Parse.Query(Parse.User);
    query.equalTo("firstname", parameters.firstname);
    query.equalTo("lastname", parameters.lastname);

    return query.find(
        function(users) {
            if (users.length < 1) {
                promise.error("No users found with this name");
                return promise;
            }
            return users;
        },
        function(error) {
            promise.error("No users found with this name");
            return promise;
        }
    );
};