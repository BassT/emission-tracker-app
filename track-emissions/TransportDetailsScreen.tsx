import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { TransportMode } from "../api";
import { MainNavigatorParamList, TrackEmissionsNavigatorParamList, TrackEmissionsScreenName } from "../navigation";
import { TransportDetailsCarScreen } from "./TransportDetailsCarScreen";
import { TransportDetailsTrainScreen } from "./TransportDetailsTrainScreen";

/**
 * Renders different transport details screen variants based on transport mode.
 */
export function TransportDetailsScreen({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<TrackEmissionsNavigatorParamList, TrackEmissionsScreenName.TRANSPORT_DETAILS>,
  BottomTabScreenProps<MainNavigatorParamList>
>) {
  switch (route.params.mode) {
    case TransportMode.Car:
      return <TransportDetailsCarScreen navigation={navigation} route={route} />;
    case TransportMode.Train:
      return <TransportDetailsTrainScreen navigation={navigation} route={route} />;
    default:
      return null;
  }
}
