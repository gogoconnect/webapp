
exports.joinConversation = function(parameters)
{
    var promise = new Parse.Promise();

    if (!parameters.recipient && typeof parameters.recipient == 'undefined')
    {
        console.log("Cannot join a conversation with no one!");
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

    if ((!parameters.conversationId && typeof parameters.conversationId == 'undefined') ||
        (!parameters.msgText && typeof parameters.msgText == 'undefined'))
    {
        console.log("Cannot send msg if you don't tell me which conversation, or what to send!");
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