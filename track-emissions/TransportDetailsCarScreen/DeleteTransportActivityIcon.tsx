import React from "react";
import { Alert } from "react-native";
import { IconButton } from "react-native-paper";
import { TransportActivityAPI } from "../../api";
import {
  MainNavigatorParamList,
  MainScreenName,
  TrackEmissionsNavigatorParamList,
  TrackEmissionsScreenName,
} from "../../navigation";

export function DeleteTransportActivityIcon({
  setIsDeleting,
  transportActivityAPI,
  transportActivityId,
  navigation,
}: {
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  transportActivityAPI: TransportActivityAPI;
  transportActivityId: string;
  navigation: {
    jumpTo: (
      screen: keyof MainNavigatorParamList,
      options: { screen: keyof TrackEmissionsNavigatorParamList; params?: any }
    ) => void;
  };
}): JSX.Element {
  return (
    <IconButton
      icon="delete"
      onPress={async () => {
        try {
          setIsDeleting(true);
          const { errors } = await transportActivityAPI.deleteTransportActivity({
            params: { id: transportActivityId },
            options: {},
          });
          if (errors) {
            Alert.alert("Failed to delete transport activity", JSON.stringify(errors, null, 2));
          }
          Alert.alert("Deleted transport activity successfully", "", [
            {
              text: "OK",
              onPress: () =>
                // eslint-disable-next-line react/prop-types
                navigation.jumpTo(MainScreenName.EMISSIONS, {
                  screen: TrackEmissionsScreenName.OVERVIEW,
                }),
            },
          ]);
        } catch (error) {
          console.error(
            "Unexpected error occurred trying to delete transport activity details",
            JSON.stringify({ error }, null, 2)
          );
        } finally {
          setIsDeleting(false);
        }
      }}
    />
  );
}
