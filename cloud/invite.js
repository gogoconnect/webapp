/*
 * Allows inviting a user to Gogo Connect
 *
 * Required parameters:
 * - firstname
 * - lastname
 * - message
 *
 * Optional required parameters: (EITHER)
 * - email
 * - phone
 *
 */
exports.invite = function(parameters)
{
    var promise = new Parse.Promise();

    if ((!parameters.firstname && typeof parameters.firstname == 'undefined') ||
        (!parameters.lastname && typeof parameters.lastname == 'undefined'))
    {
        console.log("Missing data to invite user");
        promise.reject("Missing data to invite user");
        return promise;
    }

    var email, phone;

    if (parameters.email != 'undefined') email = parameters.email;
    if (parameters.phone != 'undefined') phone = parameters.phone;

    if (email == 'undefined' && phone == 'undefined')
    {
        console.log("Need either email or Phone to invite user");
        promise.reject("Need either email or Phone to invite user");
        return promise;
    }

    var currentUser = Parse.User.current();

    var fromName = currentUser.get("firstname") + " " + currentUser.get("lastname");
    var toName = parameters.firstname + " " + parameters.lastname;

    var message = fromName + " wants to send you a message via Gogo Connect."
    message += "\n Connect with him?";

    var subject = fromName + " Gogo Connect Message";

    if (email != 'undefined' && phone != 'undefined')
    {
        sendEmail(fromName, subject, message, email).then(
            function(result) {
                sendText(message, phone).then(
                    function(result)
                    {
                        promise.resolve('Sent all!');
                    }, 
                    function(error)
                    {
                        console.log(error);
                        response.error(error);
                      }
                    );
            },
            function(error)
            {
                console.log(error);
                response.error(error);
            }
        );
    }
    else if (email != 'undefined')
    {
        sendEmail(fromName, subject, message, email).then(
            function(result) {
                promise.resolve('Sent email!');
            },
            function(error)
            {
                console.log(error);
                response.error(error);
            }
        );
    }
    else if (phone != 'undefined')
    {
        sendText(message, phone).then(
            function(result)
            {
                promise.resolve('Sent SMS!');
            }, 
            function(error)
            {
                console.log(error);
                response.error(error);
            }
        );
    }

    return promise;
};

function sendEmail(fromName, subject, message, email)
{
    var promise = new Parse.Promise();

    var mandrill = require("mandrill");
    mandrill.initialize("Ecwd_aC6xFuoTouLBFIM5A");
     
    mandrill.sendEmail({
    message: {
        text: message,
        subject: subject,
        from_email: "gogoconnect2014@gmail.com",
        from_name: "Gogo Gonnect",
        to: [
            {
                email: email,
                name: fromName
            }
        ]
    },
    async: true
    }, {
        success: function(httpResponse) { promise.resolve("Email sent!"); },
        error: function(httpResponse) { promise.error("Uh oh, something went wrong"); }
    });

    return promise;
}

function sendText(message, phone)
{
    var promise = new Parse.Promise();

    var twilio = require("twilio");
    twilio.initialize("AC67dffd0e2b72df8b96f95f98814d53e9","63d676d65444d8ded2ebdad2308e3e87");
     
    twilio.sendSMS({
        From: "3123007431",
        To: phone,
        Body: message
    }, {
        success: function(httpResponse) { promise.resolve("SMS sent!"); },
        error: function(httpResponse) { promise.error("Uh oh, something went wrong"); }
    });

    return promise;
}