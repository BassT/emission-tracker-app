import { NavigatorScreenParams } from "@react-navigation/core";
import { TransportMode } from "./track-emissions/TransportMode";

export type TrackEmissionsNavigatorParamList = {
  [TrackEmissionsScreenName.OVERVIEW]: undefined;
  [TrackEmissionsScreenName.TRACK_EMISSIONS]: undefined;
  [TrackEmissionsScreenName.TRANSPORT_MODE]: undefined;
  [TrackEmissionsScreenName.TRANSPORT_DETAILS]: { mode: TransportMode; transportActivityId?: string };
};

export enum TrackEmissionsScreenName {
  OVERVIEW = "Overview",
  TRACK_EMISSIONS = "Track emissions",
  TRANSPORT_MODE = "Transport mode",
  TRANSPORT_DETAILS = "Transport details",
}

export type MainNavigatorParamList = {
  [MainScreenName.DASHBOARD]: undefined;
  [MainScreenName.EMISSIONS]: NavigatorScreenParams<TrackEmissionsNavigatorParamList>;
};

export enum MainScreenName {
  DASHBOARD = "Dashboard",
  EMISSIONS = "Emissions",
}
