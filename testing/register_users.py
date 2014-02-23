import json,httplib

connection = httplib.HTTPSConnection('api.parse.com', 443)

def testRegister(numUser):
    for x in range(0, numUser):
        connection.connect()
        connection.request('POST', '/1/functions/register', json.dumps({
               "username" : "user_" + str(x),
               "password" : "user_" + str(x),
               "email" : "user_" + str(x) + "@gmail.com",
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
         }), {
           "X-Parse-Application-Id": "OPqna189K6mc31nqwGV8BtWrFMRTHRNNCE1iohOF",
           "X-Parse-REST-API-Key": "Ck41CErQEaxoTdqkBku06aqzCht8ol0qUt7ERQSu",
           "Content-Type": "application/json"
         })
    result = json.loads(connection.getresponse().read())
    print result

testLogin("user_0@gmail.com", "user_0");

        