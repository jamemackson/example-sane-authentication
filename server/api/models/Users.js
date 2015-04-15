var bcrypt = require('bcrypt');
/**
* Users.js
*
* @description :: This model represents the most basic user object in the system and is where we validate the user authentication
* @docs        :: http://sailsjs.org/#!documentation/models
*/

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

  },
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
};
