
function getEmailPrefix(email)
{
    return email.substring(0, email.indexOf("@"));
}

//
// Regiters a GC User!
//
exports.register = function(parameters)
{
    if ((!parameters.password && typeof parameters.password == 'undefined') ||
        (!parameters.email && typeof parameters.email == 'undefined') ||
        (!parameters.firstname && typeof parameters.firstname == 'undefined') ||
        (!parameters.lastname && typeof parameters.lastname == 'undefined'))
    {
        console.log("Registration request is missing some parameters");
        return new Parse.Promise().reject("Registration request is missing some parameters")
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
    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('email', email);

    user.set('firstname', first);
    user.set('lastname', last);

    var promise = new Parse.Promise();
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
    if ((!parameters.password && typeof parameters.password == 'undefined') ||
        (!parameters.email && typeof parameters.email == 'undefined'))
    {
        console.log("Can't login without username and password");
        return new Parse.Promise().reject("Can't login without username and password")
    }

    var username = getEmailPrefix(parameters.email);
    var password = parameters.password;

    var currentUser = Parse.User.current();
    if (currentUser && Parse.User.current().getUsername() == username)
    {
        console.log("Already logged in");
        return new Parse.Promise().resolve(Parse.User().current());
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
exports.getUser = function(parameters)
{
    if ((!parameters.firstname && typeof parameters.firstname == 'undefined') ||
        (!parameters.lastname && typeof parameters.lastname == 'undefined'))
    {
        console.log("Can't lookup a user if you don't give me their name!");
        return new Parse.Promise().reject("Can't lookup a user if you don't give me their name!")
    }

    var currentUser = Parse.User.current();
    if (!currentUser)
    {
        console.log("User trying to search without being logged in");
        return new Parse.Promise().reject("User trying to search without being logged in");
    }

    /*
    var query = new Parse.Query(Parse.User);
    query.equalTo("firstname", parameters.firstname);
    query.equalTo("lastname", parameters.lastname);

    return query.find(
        function(users) {
            if (users.length < 1) {
                return Parse.Promise.error(NO_USER_MSG);
            }
            return users[0];
        },
        function(error) {
            return Parse.Promise.error(NO_USER_MSG);
        }
    );
    */
};