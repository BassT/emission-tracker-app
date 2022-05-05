import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, FlatList, ImageBackground } from "react-native";
import { FAB, IconButton, List } from "react-native-paper";
import { ApiContext, ListResultItem, TransportMode } from "../api";
import { AuthContext } from "../auth/AuthContext";
import { MainNavigatorParamList, TrackEmissionsNavigatorParamList, TrackEmissionsScreenName } from "../navigation";
import { theme } from "../theme";

export function OverviewScreen({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<TrackEmissionsNavigatorParamList, TrackEmissionsScreenName.OVERVIEW>,
  BottomTabScreenProps<MainNavigatorParamList>
>) {
  const { logOut } = useContext(AuthContext);
  const { transportActivityAPI, initialized } = useContext(ApiContext);
  const [data, setData] = useState<null | ListResultItem[]>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { result, errors } = await transportActivityAPI.listTransportAcitivites({
        params: {
          totalEmissions: true,
          title: true,
          date: true,
          transportMode: true,
          sortBy: "date",
          sortDirection: "DESC",
        },
        options: {},
      });
      if (errors) console.error("Failed to fetch transport activities", { errors });
      if (result) setData(result);
    } catch (error) {
      console.error("Unexpected error to fetch total emissions", { error });
      Alert.alert("Unexpected error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [transportActivityAPI]);

  useEffect(() => {
    if (initialized) fetchData();
  }, [fetchData, initialized]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton icon="logout" onPress={() => logOut()} />,
    });
  }, [logOut, navigation]);

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1596237563267-84ffd99c80e1",
        cache: "default",
      }}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <FlatList
        data={data}
        renderItem={({ item: { id, title, totalEmissions, date, transportMode } }) => (
          <List.Item
            title={title}
            left={() => <List.Icon icon={getIconName(transportMode)} />}
            description={renderDescription({ totalEmissions, date })}
            style={{ backgroundColor: theme.colors.surface }}
            onPress={() =>
              navigation.push(TrackEmissionsScreenName.TRANSPORT_DETAILS, {
                mode: transportMode,
                transportActivityId: id,
              })
            }
          />
        )}
        refreshing={loading}
        onRefresh={() => fetchData()}
      />
      <FAB
        icon="plus"
        onPress={() => navigation.push(TrackEmissionsScreenName.TRACK_EMISSIONS)}
        style={{ position: "absolute", right: 0, bottom: 0, margin: 16 }}
      />
    </ImageBackground>
  );
}

function renderDescription({ totalEmissions, date }: { totalEmissions?: number; date?: string }) {
  if (typeof totalEmissions === "number" && date)
    return `${new Date(date).toLocaleDateString()}: ${totalEmissions.toFixed(2)} kg CO2`;
  if (typeof totalEmissions === "number") return `${totalEmissions.toFixed(2)} kg CO2`;
  if (date) return `${new Date(date).toLocaleDateString()}`;
  return null;
}

function getIconName(transportMode?: TransportMode) {
  if (transportMode === TransportMode.Car) {
    return "car";
  }
  if (transportMode === TransportMode.Train) {
    return "train";
  }
  return "help";
}
