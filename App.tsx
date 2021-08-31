import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { DashboardScreen } from "./dashboard/DashboardScreen";
import { Navigator, ScreenName } from "./navigation";
import { theme } from "./theme";
import { TrackEmissionsScreen } from "./track-emissions/TrackEmissionsScreen";
import { TransportDetailsScreen } from "./track-emissions/TransportDetailsScreen";
import { toHeaderTitle } from "./track-emissions/TransportMode";
import { TransportModeScreen } from "./track-emissions/TransportModeScreen";

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Navigator.Navigator>
          <Navigator.Screen name={ScreenName.DASHBOARD} component={DashboardScreen} />
          <Navigator.Screen name={ScreenName.TRACK_EMISSIONS} component={TrackEmissionsScreen} />
          <Navigator.Screen name={ScreenName.TRANSPORT_MODE} component={TransportModeScreen} />
          <Navigator.Screen
            name={ScreenName.TRANSPORT_DETAILS}
            component={TransportDetailsScreen}
            options={({ route }) => ({ title: toHeaderTitle(route.params.mode) })}
          />
        </Navigator.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
