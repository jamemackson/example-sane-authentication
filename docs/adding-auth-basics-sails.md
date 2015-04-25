# step 1: create the user model

`sane g resource users firstName:string lastName:string email:string username:string password:string phone:string`

 > doctor up the sails model
 > add toJSON where we remove the password when we're streaming out the object.

 ```javascript
 module.exports = {
   attributes: {
     firstName : { type: 'string' },
     lastName : { type: 'string' },
     email : {
       type: 'EMAIL',
       required: true,
       unique: true
     },
     username : {
       type: 'string',
       required: true,
       unique: true
     },
     password : { type: 'string' },
     phone : { type: 'string' },
     toJSON: function() {
       var obj = this.toObject();
       // Remove the password object value
       delete obj.password;
       // return the new object without password
       return obj;
     }
   }
 };
 ```

  > next we install & require bcrypt
  > encrypt the users password before the record is stored

  >> we should look at what other methods we can override here to ensure that password updates are also properly encrypted...

 * install bcrypt

  `cd server && npm install bcrypt --save`

 * include bcrypt in Users model file

 ```javascript
 var bcrypt = require('bcrypt');
 ```

  then add this below the attributes

  ```javascript
  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }
  ```

  > next we doctor up the ember model just a touch with a fullName computed property.
  ```javascript
  // computed
  fullName: function () {
     return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')
  ```


  ## Next well look at what npm modules the server is using

  https://www.npmjs.com/package/express-jwt

  > Middleware that validates JsonWebTokens and sets req.user.

  > This module lets you authenticate HTTP requests using JWT tokens in your Node.js
  > applications. JWTs are typically used to protect API endpoints, and are often issued
  > using OpenID Connect.


 ## Enable Cors
 uncomment the defaults in:
 `server/config/cors.js`

 ## Stub out the policies
 `server/config/policies.js`
 add this:
```javascript
'*': "hasToken",
UserController: {
    "create": true,
},
AuthController: {
    '*': true,
}
```

 ## Log sails requests in console
 `server/config/routes.js`
 ```javascript
 // Logging requests in console
  '/api/*': function(req, res, next) {sails.log.info(req.method, req.url); next();},
 ```

 ## Next we'll create the AuthController
 `server/api/controllers/AuthController.js`

  > TODO: add comments to explain what we're doing inside here

 ```javascript
 var jwt = require('jsonwebtoken');
 var _ = require('lodash');
 var secret = 'RS#$09qu43f09qfj94qf*&H#(R';
 var refreshSecret = 'rw5&&$$2224124f*&H#(R';
 var bcrypt = require('bcrypt');

 /**
  * AuthController
  */

 module.exports = {
     login: function(req, res) {

         if (req.body.grant_type === 'password') {

             User.findByUsername(req.body.username).exec(function(err, user) {
                 if (err) {
                     return res.badRequest({
                         error: err
                     });
                 }
                 if (!user || user.length < 1) {
                     return res.badRequest({
                         error: 'No such user'
                     });
                 }

                 bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                     if (err || !result) {
                         return res.badRequest({
                             error: 'invalidPassword'
                         });
                     } else {
                         issueTokens(user, res);
                     }
                 });
             });

         } else if (req.body.grant_type === 'refresh_token' && req.body.refresh_token) {

             var token, user;

             if (req.headers && req.headers.authorization) {
                 var parts = req.headers.authorization.split(' ');
                 if (parts.length == 2) {
                     var scheme = parts[0],
                         credentials = parts[1];

                     if (/^Bearer$/i.test(scheme)) {
                         token = credentials;
                     }
                 } else {

                 }
             }
             var bearerToken, refreshToken;

             bearerToken = jwt.verify(token, secret);
             refreshToken = jwt.verify(req.body.refresh_token, refreshSecret);

             if (_.isEqual(bearerToken, refreshToken)) {
                 delete bearerToken.exp;
                 delete bearerToken.iat;

                 user = bearerToken;
                 issueTokens(user, res);
             };
         }
     }
 };

 function issueTokens(user, res) {
     var expirationTimeInMinutes = 60 * 2;

     var token = jwt.sign(user[0], secret, {
         expiresInMinutes: expirationTimeInMinutes
     });

     var refreshToken = jwt.sign(user[0], refreshSecret, {
         expiresInMinutes: expirationTimeInMinutes
     });

     res.send({
         user: user[0],
         access_token: token,
         expires_in: expirationTimeInMinutes * 60, // because simple auth expects seconds
         refresh_token: refreshToken
     });
 }
 ```

 ## create the hasToken policy
 in `server/api/policies/hasToken.js`

 ```javascript
 var expressJwt = require('express-jwt');
 var secret = 'iC7Oylt1ust4auc6iV2naBr2yuB3piD7Vav3Fel8eR5huM1eJ4';
 module.exports = expressJwt({secret: secret});
 ```


 
