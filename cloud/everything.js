module.exports = function(){
  var express = require('express');
  var app = express();

  app.get('/login', function(req, res) {
    if(!Parse.User.current()) {
      res.render('login', {error_message: '0'});
    }
  });

  app.post('/user_login', function(req, res) {
    var the_user = "false";
    Parse.User.logIn(req.body.email, req.body.password, {
      success: function(user) {
        the_user = req.body.email;
        res.render('hello', {message: 'Welcome, ' + the_user + '. Search for a contact below.'});
      },
      error: function(user, error) {
        res.render('login', {error_message: 'There was a problem logging in!'});
      }
    });
  });

  app.get('/signup', function(req, res) {
    if(!Parse.User.current()) {
      res.render('signup', {error_message: '0'});
    }
  });

  app.post('/signup_process', function(req, res) {
    var the_registrant = "false";
    var user = new Parse.User();
    user.set('username', req.body.email);
    user.set('email', req.body.email);
    user.set('password', req.body.password);
    user.set('firstname', req.body.firstname);
    user.set('lastname', req.body.lastname);
     
    user.signUp(null, {
      success: function(user) {
        the_registrant = req.body.email;
        res.render('hello', {message: 'Welcome, ' + the_registrant + '. Search for a contact below.'});
      },
      error: function(user, error) {
        res.render('signup', {error_message: 'There was a problem registering!'});
      }
    });
  });


  // Logs out the user
  app.get('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });

  app.get('/debug', function(req, res) {

  });

  return app;
}();