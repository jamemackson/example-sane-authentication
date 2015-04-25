
 # Setup some basics in ember.

 ## enable some of the cool stuff coming in 2.0
 `client/config/environment.js`

 ```javascript
 EmberENV: {
   FEATURES: {
     // Here you can enable experimental features on an ember canary build
     // e.g. 'with-controller': true
     'ember-htmlbars': true,
     'ember-htmlbars-block-params': true,
     'ember-htmlbars-each-with-index': true,
     'ember-htmlbars-attribute-syntax': true,
     'ember-htmlbars-component-generation': true
   }
 }
 ```

 ## setup client side authorizer and content security policy

 ```javascript
 ENV.contentSecurityPolicy =  {
   'default-src': "'self' https://maps.googleapis.com",
   'font-src': "*",
   'connect-src': "'self' https://maps.googleapis.com",
   'img-src': "*",
   'style-src': "* 'unsafe-inline'",
   'frame-src': "*",
   'script-src': "'self' 'unsafe-eval' *.googleapis.com *.gstatic.com"
 };
ENV['simple-auth'] = {
  authorizer: 'simple-auth-authorizer:oauth2-bearer'
};
ENV['simple-auth-oauth2'] = {
  refreshAccessTokens: true,
  serverTokenEndpoint: '/api/v1/auths/login'
};
 ```


 > install simple auth
  * ember-cli-simple-auth
  * ember-cli-simple-auth-aauth2
  `npm install ember-cli-simple-auth --save`
  `npm install ember-cli-simple-auth-oauth2 --save`
  `bower install ember-simple-auth --save`
  `bower install bootstrap --save`

 # setup ember for authentication

 ## create a login-panel component

 `ember g component login-panel`

 `client/app/components/login-panel.`
 ``
