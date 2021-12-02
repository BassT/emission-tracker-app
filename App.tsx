import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { ApiContextProvider } from "./api";
import { AuthContextProvider } from "./auth/AuthContext";
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

const TrackEmissionsNavigator = createNativeStackNavigator<TrackEmissionsNavigatorParamList>();
const MainNavigator = createBottomTabNavigator<MainNavigatorParamList>();

// TODO Fix warning:
// Found screens with the same name nested inside one another. Check:
// Track emissions, Track emissions > Track emissions
// This can cause confusing behavior during navigation. Consider using unique names for each screen instead.

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
    <PaperProvider theme={theme}>
      <AuthContextProvider>
        <ApiContextProvider
          baseURL={
            // "https://emission-tracker-api.azurewebsites.net/api/transport-activity"
            "http://192.168.0.83:3000/api/transport-activity"
          }
        >
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
        </ApiContextProvider>
      </AuthContextProvider>
    </PaperProvider>
  );
}
