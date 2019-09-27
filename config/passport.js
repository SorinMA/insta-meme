var LocalStrategy   = require('passport-local').Strategy;
var connection = require('../Database/configDB.js');

// expose this function to our app using module.exports
module.exports = function(passport) {
   
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //console.log('serializing user:', user);
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        //console.log('deserializing user:', id);
            done(null, id);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        let slqQryUser = "Select * from User where username = " + '\''+username+'\''+';';
        connection.query(slqQryUser, function(err, rez) {
            if(err) {
                console.log(err);
                return err;
            }

            if(rez[0]) {
                console.log("loggg----failllll");
                return done(null, false, req.flash('signupMessage', 'This username already exist!'));
            } else {
                let sqlInsertQry = "INSERT INTO User (username, password) " +
                                    "VALUES("+'\''+username+'\''+", "+
                                    "SHA2("+'\''+password+'\''+", 256));";
                connection.query(sqlInsertQry, function(err, rez) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    let sqlQry = "Select * from User Where " +
                     "username = " + '\''+username+'\''+
                     "AND password = SHA2(" + '\''+password+'\''+", 256);";
                    connection.query(sqlQry,function(err, rez) {
                        if(err) {
                            console.log(err);
                            return err;
                        }
                        
         
                        return done(null, rez[0]);
           
                    });
                });
            }
        });

    }));


// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        let sqlQry = "Select * from User Where " +
                     "username = " + '\''+username+'\''+
                     "AND password = SHA2(" + '\''+password+'\''+", 256);";
        connection.query(sqlQry,function(err, rez) {
            if(err) {
                console.log(err);
                return err;
            }
            console.log("--------------------");
            console.log(rez);
            console.log("--------------------");
            if(rez[0] != undefined) {
                return done(null, rez[0]);
            }
            return done(null, false, req.flash('loginMessage', 'Username or password wrong!'));
            
        });

    }));

};
