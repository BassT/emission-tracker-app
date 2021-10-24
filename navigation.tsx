import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/core";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TransportMode } from "./track-emissions/TransportMode";

export const TrackEmissionsNavigator = createNativeStackNavigator<TrackEmissionsNavigatorParamList>();

export type TrackEmissionsNavigatorParamList = {
  [TrackEmissionsScreenName.TRACK_EMISSIONS]: undefined;
  [TrackEmissionsScreenName.TRANSPORT_MODE]: undefined;
  [TrackEmissionsScreenName.TRANSPORT_DETAILS]: { mode: TransportMode };
};

export enum TrackEmissionsScreenName {
  TRACK_EMISSIONS = "Track emissions",
  TRANSPORT_MODE = "Transport mode",
  TRANSPORT_DETAILS = "Transport details",
}

export const MainNavigator = createBottomTabNavigator<MainNavigatorParamList>();

export type MainNavigatorParamList = {
  [MainScreenName.DASHBOARD]: undefined;
  [MainScreenName.TRACK_EMISSIONS]: NavigatorScreenParams<TrackEmissionsNavigatorParamList>;
};

export enum MainScreenName {
  DASHBOARD = "Dashboard",
  TRACK_EMISSIONS = "Track emissions",
}
