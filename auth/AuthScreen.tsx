import { exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AppContext } from "../AppContext";

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

export function AuthScreen({
  didTryRestoreTokenInfo,
}: {
  /**
   * Indicates if an attempt was made to restore token info from local device store.
   * This value is used to decide whether to request an access token or wait until a restore attempt was made.
   */
  didTryRestoreTokenInfo: boolean;
}) {
  const { tokenInfo, setTokenInfo } = useContext(AppContext);
  const [didPrompt, setDidPrompt] = useState(false);
  const discovery = useAutoDiscovery(
    "https://emissiontracker.b2clogin.com/emissiontracker.onmicrosoft.com/B2C_1_emission-tracker-app/v2.0"
  );
  const redirectUri = makeRedirectUri({ scheme: "emission-tracker-app" });
  const [request, response, promptAsync] = useAuthRequest(
    { clientId: apiClientId, scopes, redirectUri, usePKCE: false },
    discovery
  );

  useEffect(() => {
    const getAccessToken = async () => {
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

    getAccessToken();
  }, [request, response, discovery, redirectUri, setTokenInfo]);

  useEffect(() => {
    if (didTryRestoreTokenInfo && !tokenInfo && discovery && request && !response && promptAsync && !didPrompt) {
      promptAsync();
      setDidPrompt(true);
    }
  }, [didTryRestoreTokenInfo, tokenInfo, discovery, request, response, promptAsync, didPrompt]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
