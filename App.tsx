import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AppContext, appContextDefault } from "./AppContext";
import { DashboardScreen } from "./dashboard/DashboardScreen";
import { MainNavigator, MainScreenName, TrackEmissionsNavigator, TrackEmissionsScreenName } from "./navigation";
import { theme } from "./theme";
import { OverviewScreen } from "./track-emissions/OverviewScreen";
import { TrackEmissionsScreen } from "./track-emissions/TrackEmissionsScreen";
import { TransportDetailsScreen } from "./track-emissions/TransportDetailsScreen";
import { toHeaderTitle } from "./track-emissions/TransportMode";
import { TransportModeScreen } from "./track-emissions/TransportModeScreen";

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

export default function App() {
  return (
    <AppContext.Provider value={appContextDefault}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <MainNavigator.Navigator>
            <MainNavigator.Screen name={MainScreenName.DASHBOARD} component={DashboardScreen} />
            <MainNavigator.Screen
              name={MainScreenName.TRACK_EMISSIONS}
              component={TrackEmissions}
              options={{ headerShown: false }}
            />
          </MainNavigator.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppContext.Provider>
  );
}
