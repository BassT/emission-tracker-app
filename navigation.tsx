import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransportMode } from "./track-emissions/TransportMode";

export const Navigator = createNativeStackNavigator<NavigatorParamList>();

export type NavigatorParamList = {
  [ScreenName.DASHBOARD]: undefined;
  [ScreenName.TRACK_EMISSIONS]: undefined;
  [ScreenName.TRANSPORT_MODE]: undefined;
  [ScreenName.TRANSPORT_DETAILS]: { mode: TransportMode };
};

export enum ScreenName {
  DASHBOARD = "Dashboard",
  TRACK_EMISSIONS = "Track emissions",
  TRANSPORT_MODE = "Transport mode",
  TRANSPORT_DETAILS = "Transport details",
}
