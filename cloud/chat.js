exports.joinConversation = function(parameters)
{
    var promise = new Parse.Promise();

    if (!parameters.recipient && typeof parameters.recipient == 'undefined')
    {
        promise.reject("Cannot join a conversation with no one!")
        return promise;
    }

    var starterUID = Parse.User.current().id;
    var recipientUID = parameters.recipient;


    // LOOK for an existing conversation between the 2 users

    var query1 = new Parse.Query("Conversation");
    query1.equalTo("UID1", starterUID);
    query1.equalTo("UID2", recipientUID);

    var query2 = new Parse.Query("Conversation");
    query2.equalTo("UID2", starterUID);
    query2.equalTo("UID1", recipientUID);

    var query = Parse.Query.or(query1, query2);
    query.find().then(function(results) {
        if (results.length > 0)
        {
            promise.resolve(results[0]);
        }
        else
        {
            // IF none exist then create a new one

            var Conversation = Parse.Object.extend("Conversation");
            var convesation = new Conversation();

            convesation.set("UID1", starterUID);
            convesation.set("UID2", recipientUID);

            convesation.save().then(function(result)
            {
                promise.resolve(result);
            },
            function(error) {
                promise.reject(error);
            });
        }
    }, function(error) {
        promise.reject(error);
    });

    return promise;
};

exports.sendMessage = function(parameters)
{
    var promise = new Parse.Promise();
    console.log("Calling sendMessage");

    if ((!parameters.conversationId && typeof parameters.conversationId == 'undefined') ||
        (!parameters.msgText && typeof parameters.msgText == 'undefined'))
    {
        promise.reject("Cannot send msg if you don't tell me which conversation, or what to send!");
        return promise;
    }

    var currentUID = Parse.User.current().id;
    var conversationId = parameters.conversationId;
    var msgText = parameters.msgText;

    var Message = Parse.Object.extend("Message");
    var message = new Message();

    message.set("conversationId", conversationId);
    message.set("text", msgText);
    message.set("author", currentUID);

    message.save(null).then(
        function(msg) {
            if (msg == undefined)   promise.reject("Could not create message");
            else                    promise.resolve(msg);
        },
        function(error) {
            console.log(error);
            promise.reject("Could not create message");
        });

    return promise;
};

exports.isMessageForMe = function(parameters)
{
    var promise = new Parse.Promise();

    var conversationId = parameters.object.get("conversationId");
    if (!conversationId && typeof conversationId == 'undefined')
    {
        promise.reject("Could not find message conversation");
        return promise;
    }

    var currentUID = Parse.User.current().id;

    // CHECK if the given conversation includes the current user

    var query1 = new Parse.Query("Conversation");
    query1.equalTo("objectId", conversationId);
    query1.equalTo("UID1", currentUID);

    var query2 = new Parse.Query("Conversation");
    query2.equalTo("objectId", conversationId);
    query2.equalTo("UID2", currentUID);

    var query = Parse.Query.or(query1, query2);
    query.find().then(function(results)
    {
        if (results.length > 0) promise.resolve(true);
        else                    promise.resolve(false);
    },
    function(error) {
        promise.error(error);
    });

    return promise;
};

exports.getConverstations = function()
{
    var promise = new Parse.Promise();
    var currentUID = Parse.User.current().id;

    // CHECK if the given conversation includes the current user

    var query1 = new Parse.Query("Conversation");
    query1.equalTo("UID1", currentUID);

    var query2 = new Parse.Query("Conversation");
    query2.equalTo("UID2", currentUID);

    var query = Parse.Query.or(query1, query2);
    query.find().then(function(results)
    {
        promise.resolve(results);
    },
    function(error) {
        promise.error(error);
    });

    return promise;
};

exports.getMsgsForConversation = function(parameters)
{
    var promise = new Parse.Promise();

    var conversationId = parameters.conversationId;
    if (!parameters.conversationId && typeof parameters.conversationId == 'undefined')
    {
        promise.reject("Could not find conversation id");
        return promise;
    }

    var query = new Parse.Query("Message");
    query.equalTo("conversationId", conversationId);

    query.find().then(function(results)
    {
        promise.resolve(results);
    },
    function(error) {
        promise.error(error);
    });

    return promise;
};