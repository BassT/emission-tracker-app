import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, ImageBackground } from "react-native";
import { Card, Title } from "react-native-paper";
import { MainNavigatorParamList, TrackEmissionsNavigatorParamList, TrackEmissionsScreenName } from "../navigation";
import { TransportMode } from "./TransportMode";

export function TransportModeScreen({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<TrackEmissionsNavigatorParamList, TrackEmissionsScreenName.TRACK_EMISSIONS>,
  BottomTabScreenProps<MainNavigatorParamList>
>) {
  return (
    <>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1596237563267-84ffd99c80e1",
            cache: "default",
          }}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          <View style={{ padding: 8 }}>
            <Card
              style={{ marginBottom: 8 }}
              onPress={() => navigation.push(TrackEmissionsScreenName.TRANSPORT_DETAILS, { mode: TransportMode.CAR })}
            >
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <MaterialCommunityIcons name="car" size={32} />
                    <MaterialCommunityIcons name="bus" size={32} />
                    <MaterialCommunityIcons name="motorbike" size={32} />
                  </View>
                  <Title>Car / Bus / Motorbike</Title>
                </View>
              </Card.Content>
            </Card>
            <Card style={{ marginBottom: 8 }}>
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="train" size={32} style={{ color: "grey" }} />
                  <Title style={{ color: "grey" }}>Train (coming soon)</Title>
                </View>
              </Card.Content>
            </Card>
            <Card style={{ marginBottom: 8 }}>
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="airplane" size={32} style={{ color: "grey" }} />
                  <Title style={{ color: "grey" }}>Airplane (coming soon)</Title>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}
