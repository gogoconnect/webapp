///////////////////////////////////////////////////////
//////////////////////// TOOLS ////////////////////////
///////////////////////////////////////////////////////

exports.currentUsersIsValid = function()
{
    return iscurrentUsersIsValid();
}

function iscurrentUsersIsValid()
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
        promise.reject("Registration request is missing some parameters");
        return promise;
    }

    var username = parameters.email;
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

    user.set('firstname', first.toLowerCase());
    user.set('lastname', last.toLowerCase());

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

exports.login = function(parameters)
{
    var promise = new Parse.Promise();

    if ((!parameters.password && typeof parameters.password == 'undefined') ||
        (!parameters.email && typeof parameters.email == 'undefined'))
    {
        promise.reject("Can't login without username and password");
        return promise;
    }

    var username = parameters.email;
    var password = parameters.password;

    var currentUser = Parse.User.current();
    if (currentUser && currentUser.getUsername() == username)
    {
        console.log("Already logged in");
        promise.resolve(Parse.User().current());
        return promise;
    }

    var options = {
        username: username,
        email: username,
        password: password
    };

    var user = new Parse.User(options);
    return user.logIn(username, password, options);
};

exports.getUser = function(parameters)
{
    var promise = new Parse.Promise();

    if (!parameters.userId && typeof parameters.userId == 'undefined')
    {
        promise.reject("Can't get a user if you don't give me their id!");
        return promise;
    }

    if (!iscurrentUsersIsValid())
    {
        promise.reject("User trying to search without being logged in");
        return promise;
    }

    var query = new Parse.Query(Parse.User);
    query.equalTo("objectId", parameters.userId);
    query.limit(1);

    query.find({
        success: function(user) {
            if (users.length < 1) {
                 promise.reject("No user found with this id");
            }
            else promise.resolve(user[0]);
        },
        error: function(object, error) {
            console.log(error);
            promise.reject("Could not look for user with given id");
        }
    });
    return promise;
};

exports.getUsers = function(parameters)
{
    var promise = new Parse.Promise();

    if ((!parameters.firstname && typeof parameters.firstname == 'undefined') ||
        (!parameters.lastname && typeof parameters.lastname == 'undefined'))
    {
        promise.reject("Can't lookup a user if you don't give me their name!");
        return promise;
    }

    if (!iscurrentUsersIsValid())
    {
        promise.reject("User trying to search without being logged in");
        return promise;
    }

    var userId = Parse.User.current().id;
    var query = new Parse.Query(Parse.User);
    query.equalTo("firstname", parameters.firstname.toLowerCase());
    query.equalTo("lastname", parameters.lastname.toLowerCase());
    query.notEqualTo("objectId", userId);

    query.find({
        success: function(users) {
            if (users.length < 1) {
                 promise.reject("No users found with this name");
            }
            else 
            {
                var userIds = [];
                var usersDict = {};
                var usersFull = [];
                var doneIds = [];
                var i = 0, user;
                while(user = users[i++]) {
                    userIds.push(user.id);
                    usersDict[user.id] = user;

                    var sub_query = new Parse.Query('Optional');
                    sub_query.equalTo("userId", user.id);

                    sub_query.find({
                        success: function(optionals) {
                            if (optionals && optionals.length > 0)
                            {
                                var i = 0, optional;
                                while(optional = optionals[i++])
                                {
                                    doneIds.push(optional.get("userId"));
                                    usersFull.push([usersDict[optional.get("userId")], optional]);
                                }
                            }
                        },
                        error: function(object, error)
                        {
                            console.log(error);
                        }
                    });
                }

                var i = 0, uid;
                while(uid = userIds[i++])
                {
                    if (doneIds.indexOf(uid) > -1) continue;
                    usersFull.push([usersDict[uid]]);
                }

                promise.resolve(usersFull);
            }
        },
        error: function(object, error) {
            console.log(error);
            promise.reject("Could not look for users with this name");
        }
    });
    return promise;
};

exports.optionalData = function(parameters)
{
    var promise = new Parse.Promise();

    var gender, age, city, country;

    if (parameters.gender && parameters.gender != 'undefined')      gender = parameters.gender;
    if (parameters.age && parameters.age != 'undefined')            age = parameters.age;
    if (parameters.city && parameters.city != 'undefined')          city = parameters.city;
    if (parameters.country && parameters.country != 'undefined')    country = parameters.country;

    var Optional = Parse.Object.extend("Optional");
    var optional = new Optional();

    var userId = Parse.User.current().id;

    optional.set("userId", userId);

    if (gender != 'undefined')  optional.set("gender", gender);
    if (age != 'age')           optional.set("age", age);
    if (city != 'city')         optional.set("city", city);
    if (country != 'undefined') optional.set("country", country);

    optional.save().then(function(result)
    {
        promise.resolve(result);
    },
    function(error) {
        promise.reject(error);
    });

    return promise;
};