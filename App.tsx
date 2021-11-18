import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AppContext, appContextDefault } from "./AppContext";
import { AuthScreen } from "./auth/AuthScreen";
import { TokenInfo } from "./auth/TokenInfo";
import { DashboardScreen } from "./dashboard/DashboardScreen";
import {
  MainNavigatorParamList,
  MainScreenName,
  TrackEmissionsNavigatorParamList,
  TrackEmissionsScreenName,
} from "./navigation";
import { theme } from "./theme";
import { OverviewScreen } from "./track-emissions/OverviewScreen";
import { TrackEmissionsScreen } from "./track-emissions/TrackEmissionsScreen";
import { TransportDetailsScreen } from "./track-emissions/TransportDetailsScreen";
import { toHeaderTitle } from "./track-emissions/TransportMode";
import { TransportModeScreen } from "./track-emissions/TransportModeScreen";
import SecureStore from "expo-secure-store";

const TrackEmissionsNavigator = createNativeStackNavigator<TrackEmissionsNavigatorParamList>();
const MainNavigator = createBottomTabNavigator<MainNavigatorParamList>();

function Main() {
  return (
    <MainNavigator.Navigator>
      <MainNavigator.Screen name={MainScreenName.DASHBOARD} component={DashboardScreen} />
      <MainNavigator.Screen
        name={MainScreenName.TRACK_EMISSIONS}
        component={TrackEmissions}
        options={{ headerShown: false }}
      />
    </MainNavigator.Navigator>
  );
}

function TrackEmissions() {
  return (
    <TrackEmissionsNavigator.Navigator>
      <TrackEmissionsNavigator.Screen name={TrackEmissionsScreenName.OVERVIEW} component={OverviewScreen} />
      <TrackEmissionsNavigator.Screen
        name={TrackEmissionsScreenName.TRACK_EMISSIONS}
        component={TrackEmissionsScreen}
        options={{ animation: "slide_from_right" }}
      />
      <TrackEmissionsNavigator.Screen
        name={TrackEmissionsScreenName.TRANSPORT_MODE}
        component={TransportModeScreen}
        options={{ animation: "slide_from_right" }}
      />
      <TrackEmissionsNavigator.Screen
        name={TrackEmissionsScreenName.TRANSPORT_DETAILS}
        component={TransportDetailsScreen}
        options={({ route }) => ({ title: toHeaderTitle(route.params.mode), animation: "slide_from_right" })}
      />
    </TrackEmissionsNavigator.Navigator>
  );
}

const tokenInfoSecureStoreKey = "tokenInfo";

export default function App() {
  const [didTryRestoreTokenInfo, setDidTryRestoreTokenInfo] = useState(false);
  const [tokenInfo, setTokenInfoState] = useState<undefined | TokenInfo>(undefined);

  /**
   * Sets token info in state and persistent, secure, local key-value store.
   */
  const setTokenInfo = (tokenInfo?: TokenInfo) => {
    setTokenInfoState(tokenInfo);
    SecureStore.setItemAsync(tokenInfoSecureStoreKey, JSON.stringify({ ...tokenInfo }));
  };

  // On mount, try to restore token info from local store
  useEffect(() => {
    const tryRestoreTokenInfo = async () => {
      const tokenInfoRestored = await SecureStore.getItemAsync(tokenInfoSecureStoreKey);
      if (tokenInfoRestored) {
        setTokenInfoState(JSON.parse(tokenInfoRestored));
        setDidTryRestoreTokenInfo(true);
      }
    };

    tryRestoreTokenInfo();
  }, []);

  return (
    <AppContext.Provider value={{ ...appContextDefault, tokenInfo, setTokenInfo }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {tokenInfo ? <Main /> : <AuthScreen didTryRestoreTokenInfo={didTryRestoreTokenInfo} />}
        </NavigationContainer>
      </PaperProvider>
    </AppContext.Provider>
  );
}
