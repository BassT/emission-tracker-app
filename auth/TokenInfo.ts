export interface TokenInfo {
  /**
   * The access token issued by the authorization server.
   *
   * [Section 4.2.2](https://tools.ietf.org/html/rfc6749#section-4.2.2)
   */
  accessToken: string;
  /**
   * The type of the token issued. Value is case insensitive.
   *
   * [Section 7.1](https://tools.ietf.org/html/rfc6749#section-7.1)
   */
  tokenType?: "bearer" | "mac";
  /**
   * The lifetime in seconds of the access token.
   *
   * For example, the value `3600` denotes that the access token will
   * expire in one hour from the time the response was generated.
   *
   * If omitted, the authorization server should provide the
   * expiration time via other means or document the default value.
   *
   * [Section 4.2.2](https://tools.ietf.org/html/rfc6749#section-4.2.2)
   */
  expiresIn?: number;
  /**
   * The refresh token, which can be used to obtain new access tokens using the same authorization grant.
   *
   * [Section 5.1](https://tools.ietf.org/html/rfc6749#section-5.1)
   */
  refreshToken?: string;
  /**
   * The scope of the access token. Only required if it's different to the scope that was requested by the client.
   *
   * [Section 3.3](https://tools.ietf.org/html/rfc6749#section-3.3)
   */
  scope?: string;
  /**
   * Required if the "state" parameter was present in the client
   * authorization request.  The exact value received from the client.
   *
   * [Section 4.2.2](https://tools.ietf.org/html/rfc6749#section-4.2.2)
   */
  state?: string;
  /**
   * ID Token value associated with the authenticated session.
   *
   * [TokenResponse](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)
   */
  idToken?: string;
  /**
   * Time in seconds when the token was received by the client.
   */
  issuedAt?: number;
}
