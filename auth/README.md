# Auth

Some documentation about the authentication mechanism.

## A list of things involved to implement authentication

- Azure Active Directory B2C is used as identity provider (IdP)
  - Stores local account data
  - Connects to third-party user pools (Google, Twitter, etc.) for social login
  - Renders user flows for sign in / sign up / password reset
  - Issues access & refresh tokens for emission tracker API
- The expo-auth-session package is used as client library for communication with IdP according to OpenID Connect protocol
- Tokens are stored on device persistently

## Where should authentication logic code be located?

- Currently most of it is in `AuthScreen`
- I've realized it would be nice to use in `api` module also (e.g. `TransportActivityAPI` could trigger token refresh on 401 response code)
- An idea would be to create a React context which provides methods to 
  - show user flows (log in, log out, register, reset password, etc.),
  - get access token and
  - refresh access token
- Let's call this context `AuthContext`
- It follows that `TransportActivityAPI` would have to react to changes in `AuthContext`, hence it should also be a React context nested under `AuthContext`
- Let's call it `APIContext`