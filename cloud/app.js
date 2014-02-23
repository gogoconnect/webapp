
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var expressLayouts = require('cloud/express-layouts');
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(expressLayouts);          // Use the layout engine for express
app.use(parseExpressHttpsRedirect());    // Automatically redirect non-secure urls to secure ones
app.use(express.bodyParser());    // Middleware for reading request body

app.use(express.methodOverride());
app.use(express.cookieParser('SECRET_SIGNING_KEY'));
app.use(parseExpressCookieSession({
    fetchUser: true,
    key: 'image.sess',
    cookie: {
      maxAge: 3600000 * 24 * 30
    }
}));


app.locals._ = require('underscore');



// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {
  if (!Parse.User.current()) {
    res.render('signup', {error_message: '0'});
  }
  else {
    var user = Parse.User.current();
    res.render('hello', {message: 'Welcome, ' + user.get('username') + '. Search for a contact below.'});
  }
});

app.post('/search', function(req, res) {
  Parse.Cloud.run('getUsers', {firstname: req.body.firstname, lastname: req.body.lastname},
    {
      success: function(users) { 
        var names = [];
        var i = 0, user;
        while(user = users[i++]) {
          names += (user[0].get('firstname') + ', ' + user[0].get('lastname'));
        }
        res.send(users);
      },
      error: function(error) { console.log(error); } 
    });
});

app.post('/submit', function(req, res) {
	Parse.Cloud.run('sendMessage', {conversationId: req.body.conversationId, msgText: req.body.msgText},
	{
		success: function(data)
    {
      console.log(data);
      
    },
		error: function(error)
    {
      console.log(error); 
    }
	});
});

app.post('/createConversation', function(req, res) {
	Parse.Cloud.run('joinConversation', {recipient: req.body.recipient},
	{
	  success: function(conversation) {
			res.send(conversation);
		},
		error: function(error) { console.log(error); }
	});
});

app.post('/getUserId', function(req, res) {
	Parse.Cloud.run('getUserWithId', {userId: req.body.userId},
	{
		success: function(user) { res.send(user); },
		error: function(user) { console.log("did not execute properly"); }
	});
});
			

// User endpoints
app.use('/', require('cloud/everything'));

// Attach the Express app to Cloud Code.
app.listen();
