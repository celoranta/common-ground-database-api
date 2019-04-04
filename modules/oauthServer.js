
//Required by oauth-2-server
var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
var app = express();


//My requires:

var db = require('./pool.js');

//Boilerplate

const VALID_SCOPES = ['read', 'write'];
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

let oauth = new OAuthServer({
    model: {

//Required and Optional Functions from:
//https://oauth2-server.readthedocs.io/en/latest/model/spec.html
//Required Functions
getAccessToken: function getAccessToken(accessToken) {
    db.queryAccessToken({access_token: accessToken})
      .then(function(token) {
        return Promise.all([
          token,
          db.queryClient({id: token.client_id}),
          db.queryUser({id: token.user_id})
        ]);
      })
      .spread(function(token, client, user) {
        return {
          accessToken: token.access_token,
          accessTokenExpiresAt: token.expires_at,
          scope: token.scope,
          client: client, // with 'id' property
          user: user
        };
      });
  }
,
//Invoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
//This model function is required for all grant types.
  getClient: function getClient(clientId, clientSecret) {
    let params = {client_id: clientId};
    if (clientSecret) {
      params.client_secret = clientSecret;
    }
    db.queryClient(params)
      .then(function(client) {
        return {
          id: client.id,
          redirectUris: client.redirect_uris,
          grants: client.grants
        };
      });
  }
  ,
  /*Invoked to retrieve the user associated with the specified client.
This model function is required if the client_credentials grant is used.*/
  getUserFromClient: function getUserFromClient(client) {
    // imaginary DB query
    return db.queryUser({id: client.user_id});
  }
  ,
  /*Invoked to save an access token and optionally a refresh token, depending on the grant type.
This model function is required for all grant types. */
  saveToken: function saveToken(token, client, user) {
    let fns = [
      db.saveServerAccessToken({
        access_token: token.accessToken,
        expires_at: token.accessTokenExpiresAt,
        scope: token.scope,
        client_id: client.id,
        user_id: user.id
      }),
      db.saveServerRefreshToken({
        refresh_token: token.refreshToken,
        expires_at: token.refreshTokenExpiresAt,
        scope: token.scope,
        client_id: client.id,
        user_id: user.id
      })
    ]
    return Promise.all(fns)
      .spread(function(accessToken, refreshToken) {
        return {
          accessToken: accessToken.access_token,
          accessTokenExpiresAt: accessToken.expires_at,
          refreshToken: refreshToken.refresh_token,
          refreshTokenExpiresAt: refreshToken.expires_at,
          scope: accessToken.scope,
          client: {id: accessToken.client_id},
          user: {id: accessToken.user_id}
        };
      });
    },
  //Optional Methods
  //Required if scopes are used
  verifyScope: function verifyScope(token, scope) {
    if (!token.scope) {
      return false;
    }
    let requestedScopes = scope.split(' ');
    let authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }
,
  /*Invoked to check if the requested scope is valid for a particular client/user combination.
This model function is optional. If not implemented, any scope is accepted. */
validateScope: function validateScope(user, client, scope) {
  if (!scope.split(' ').every(s => VALID_SCOPES.indexOf(s) >= 0)) {
    return false;
  }
  return scope;
}
  }});


//boilerplate

  let request = new Request({
    method: 'GET',
    query: {},
    headers: {Authorization: 'Bearer foobar'}
  });
  
  let response = new Response({
    headers: {}
  });
  
  oauth.authenticate(request, response)
    .then((token) => {
      // The request was successfully authenticated.
    })
    .catch((err) => {
      // The request failed authentication.
    });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.oauth.authorize());

app.use(function(req, res) {
  res.send('Secret area');
});

// /**
//  * https://tech.zilverline.com/2017/03/17/nodejs-oauth2-provider
//  * Then we mount the authorize and token endpoints, both on POST. 
//  * A GETrequest on authorize should present your user (resource owner) with a form 
//  * to authorize or deny the third-party. Note that you must ensure that all 
//  * OAuth query parameters on the GET request (client_id, redirect_uri, et al) 
//  * are also available on the POST request.
//  */
// app.get("/oauth/authorize", function(req, res) {
//     res.send('Auth Form with OK and Cancel Buttons')
// });
// app.post("/oauth/authorize", app.oauth.authorize());
// app.post("/oauth/token", app.oauth.token());


 
app.listen(3000);
console.log('Oauth Server Listening on Port 3000')

