var expressJwt = require('express-jwt');
var secret = 'iC7Oylt1ust4auc6iV2naBr2yuB3piD7Vav3Fel8eR5huM1eJ4';

module.exports = expressJwt({secret: secret});
