import json,httplib

connection = httplib.HTTPSConnection('api.parse.com', 443)

def testRegister(numUser):
    for x in range(0, numUser):
        connection.connect()
        connection.request('POST', '/1/functions/register', json.dumps({
            "username" : "user_" + str(x) + "@gmail.com",
            "password" : "user_" + str(x),
            "email" : "user_" + str(x) + "@gmail.com",
            "firstname" : "first_" + str(x),
            "lastname" : "last_" + str(x)
        }), {
            "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
            "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
            "Content-Type": "application/json"
        })
        result = json.loads(connection.getresponse().read())
        print result


def testLogin(email, password):
    connection.connect()
    connection.request('POST', '/1/functions/login', json.dumps({
        "email" : email,
        "password" : password,
    }),
    {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
    })
    result = json.loads(connection.getresponse().read())
    print result
    return result


def testGetUsers(firstname, lastname):
    connection.connect()
    connection.request('POST', '/1/functions/test_getUsers', json.dumps({
        "firstname" : firstname,
        "lastname" : lastname,
    }),
    {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
     })
    result = json.loads(connection.getresponse().read())
    print result


def testJoinConversation(recipient):
    connection.connect()
    connection.request('POST', '/1/functions/test_joinConversation', json.dumps({
        "recipient" : recipient,
    }), {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
    })
    result = json.loads(connection.getresponse().read())
    print result


def testSendMessage(conversationId, msgText):
    connection.connect()
    connection.request('POST', '/1/functions/test_sendMessage', json.dumps({
        "conversationId" : conversationId,
        "msgText" : msgText,
    }), {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
    })
    result = json.loads(connection.getresponse().read())
    print result


def testGetConversations():
    connection.connect()
    connection.request('POST', '/1/functions/test_getConversations', json.dumps({}),
    {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
    })
    result = json.loads(connection.getresponse().read())
    print result


def testGetMsgsForConversation(conversationId):
    connection.connect()
    connection.request('POST', '/1/functions/test_getMsgsForConversation', json.dumps({
        "conversationId" : conversationId,
    }), {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
    })
    result = json.loads(connection.getresponse().read())
    print result


def testAddOptionalData(age, gender, city, country):
    connection.connect()
    connection.request('POST', '/1/functions/test_addOptionalData', json.dumps({
        "age" : age,
        "gender" : gender,
        "city" : city,
        "country" : country,
    }), {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
    })
    result = json.loads(connection.getresponse().read())
    print result


def testInvite(firstname, lastname, email, phone):
    connection.connect()
    connection.request('POST', '/1/functions/test_invite', json.dumps({
        "firstname" : firstname,
        "lastname" : lastname,
        "email" : email,
        "phone" : phone,
    }), {
        "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
        "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
        "Content-Type": "application/json"
    })
    result = json.loads(connection.getresponse().read())
    print result



#######################################################
#################### RUNNING TESTS ####################
#######################################################

#testLogin("user_0@gmail.com", "user_0")
#testRegister(2)
#testGetUsers("first_0", "last_0")
#testJoinConversation("gJqMIq1BKH")
#testSendMessage("8A0LG96ylJ", "Hey man eyo!")
#testGetConversations()
#testGetMsgsForConversation("8A0LG96ylJ")
testAddOptionalData("21", "female", "Chicago", "US")
#testInvite("Geoff", "Les", "gefthefrench@gmail.com", "312-860-2305")

        