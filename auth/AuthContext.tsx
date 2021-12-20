import { exchangeCodeAsync, makeRedirectUri, TokenResponse, useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { TokenInfo } from "./TokenInfo";

export interface Auth {
  tokenInfo?: TokenInfo;
  setTokenInfo: (tokenInfo?: TokenInfo) => void;
  initialized: boolean;
  getAccessToken: () => string | undefined;
  /**
   * Tries to get a fresh access token. If refresh fails, changes auth state to logged out.
   * @returns If successful, returns `true`. Otherwise, returns `false`.
   */
  refreshTokenOrLogOut: () => Promise<boolean>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<Auth>({
  tokenInfo: undefined,
  setTokenInfo: () => {
    throw new Error("Not implemented");
  },
  initialized: false,
  getAccessToken: () => {
    throw new Error("Not implemented");
  },
  refreshTokenOrLogOut: () => {
    throw new Error("Not implemented");
  },
  logOut: () => {
    throw new Error("Not implemented");
  },
});

export function AuthContextProviderMock({ children }: { children: React.ReactNode }) {
  const initialized = true;
  const accessToken = "f4k3Acc3ssTok3n";
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>({ accessToken });
  const getAccessToken = () => accessToken;
  const refreshTokenOrLogOut = () => {
    throw new Error("Not implemented");
  };
  const logOut = () => {
    throw new Error("Not implemented");
  };

  return (
    <AuthContext.Provider
      value={{ getAccessToken, initialized, refreshTokenOrLogOut, setTokenInfo, tokenInfo, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const apiClientId = "4e265e07-7236-4497-8f6d-313c53607b3b";
const scopes = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "https://emissiontracker.onmicrosoft.com/emission-tracker-api/user",
  "https://emissiontracker.onmicrosoft.com/emission-tracker-api/emission-tracker-api.read",
  // TODO add scopes to read / write own emissions
];
const tokenInfoSecureStoreKey = "tokenInfo";

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [tokenInfo, setTokenInfoState] = useState<undefined | TokenInfo>(undefined);

  const discovery = useAutoDiscovery(
    "https://emissiontracker.b2clogin.com/emissiontracker.onmicrosoft.com/B2C_1_emission-tracker-app/v2.0"
  );
  const redirectUri = makeRedirectUri({ scheme: "emission-tracker-app", path: "auth" });
  const [
    request,
    response,
    /**
     * Opens the login page of the identity provider.
     * Either the user has to enter credentials or gets authenticated automatically (SSO).
     */
    authenticate,
  ] = useAuthRequest({ clientId: apiClientId, scopes, redirectUri, usePKCE: false }, discovery);

  /**
   * Sets token info in state and persistent, secure, local key-value store.
   */
  const setTokenInfo = useCallback((tokenInfo?: TokenInfo) => {
    setTokenInfoState(tokenInfo);
    if (typeof tokenInfo === "undefined") {
      SecureStore.deleteItemAsync(tokenInfoSecureStoreKey);
    } else {
      SecureStore.setItemAsync(tokenInfoSecureStoreKey, JSON.stringify({ ...tokenInfo }));
    }
  }, []);

  // On mount, try to restore token info from local store.
  // After that, auth context is considered initialized.
  useEffect(() => {
    const initialize = async () => {
      // TODO Fix warning: "Provided value to SecureStore is larger than 2048 bytes. An attempt to store such a value will throw an error in SDK 35."
      const tokenInfoRestored = await SecureStore.getItemAsync(tokenInfoSecureStoreKey);
      if (tokenInfoRestored) {
        setTokenInfoState(JSON.parse(tokenInfoRestored));
      }
      setInitialized(true);
    };

    initialize();
  }, []);

  // On authenticate success, exchange auth code for access token
  useEffect(() => {
    const exchangeAuthCodeForAccessToken = async () => {
      if (discovery && request && response && response.type === "success") {
        try {
          const extraParams: { [prop: string]: string } = {};
          if (request.codeVerifier) {
            // The extraParams are mapped to query parameters for the /token request.
            // Azure AD only accepts code_verifier but not codeVerifier query parameter.
            extraParams["code_verifier"] = request.codeVerifier;
          }
          const tokenResponse = await exchangeCodeAsync(
            {
              clientId: apiClientId,
              redirectUri,
              code: response.params["code"],
              scopes,
              extraParams,
            },
            discovery
          );
          setTokenInfo({ ...tokenResponse });
        } catch (error) {
          console.error(error);
        }
      }
    };

    exchangeAuthCodeForAccessToken();
  }, [request, response, discovery, redirectUri, setTokenInfo]);

  // TODO Check if this function is used somewhere
  const getAccessToken = () => tokenInfo?.accessToken;

  const refreshTokenOrLogOut = async () => {
    if (discovery && tokenInfo) {
      try {
        const tokenResponse = await new TokenResponse(tokenInfo).refreshAsync(
          { clientId: apiClientId, scopes },
          discovery
        );
        setTokenInfo({ ...tokenResponse });
        return true;
      } catch (error) {
        // Log out
        setTokenInfo(undefined);
      }
    }
    return false;
  };

  const logOut = async () => setTokenInfo(undefined);

  return (
    <AuthContext.Provider
      value={{ tokenInfo, setTokenInfo, initialized, getAccessToken, refreshTokenOrLogOut, logOut }}
    >
      {tokenInfo ? (
        children
      ) : (
        <>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image source={require("../assets/logo-banner.png")} style={{ width: 280, height: 60, marginBottom: 24 }} />
            <Button onPress={() => authenticate({ showInRecents: true })} mode="contained">
              Log in
            </Button>
          </View>
          <Text style={{ textAlign: "center", padding: 8, color: "lightgrey" }}>
            {Constants.nativeAppVersion} ({Constants.nativeBuildVersion} - {Constants.appOwnership})
          </Text>
        </>
      )}
    </AuthContext.Provider>
  );
}
