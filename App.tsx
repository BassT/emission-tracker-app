import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { TransportDetailsCarScreen } from "./track-emissions/TransportDetailsCarScreen";
import { toHeaderTitle } from "./track-emissions/TransportMode";
import Constants from "expo-constants";
import { TransportModeScreen } from "./track-emissions/TransportModeScreen";

const TrackEmissionsNavigator = createNativeStackNavigator<TrackEmissionsNavigatorParamList>();
const MainNavigator = createBottomTabNavigator<MainNavigatorParamList>();

function Emissions() {
  return (
    <TrackEmissionsNavigator.Navigator initialRouteName={TrackEmissionsScreenName.OVERVIEW}>
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
        component={TransportDetailsCarScreen}
        options={({ route }) => ({ title: toHeaderTitle(route.params.mode), animation: "slide_from_right" })}
      />
    </TrackEmissionsNavigator.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthContextProvider>
        <ApiContextProvider baseURL={Constants.manifest?.extra?.apiBaseUrl}>
          <NavigationContainer>
            <MainNavigator.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                  let iconName: "home" | "view-list" | undefined;
                  if (route.name === MainScreenName.DASHBOARD) {
                    iconName = "home";
                  } else if (route.name === MainScreenName.EMISSIONS) {
                    iconName = "view-list";
                  }
                  return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
                },
              })}
            >
              <MainNavigator.Screen name={MainScreenName.DASHBOARD} component={DashboardScreen} />
              <MainNavigator.Screen
                name={MainScreenName.EMISSIONS}
                component={Emissions}
                options={{ headerShown: false }}
              />
            </MainNavigator.Navigator>
          </NavigationContainer>
        </ApiContextProvider>
      </AuthContextProvider>
    </PaperProvider>
  );
}
