import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, ImageBackground } from "react-native";
import { Card, Title } from "react-native-paper";
import { MainNavigatorParamList, TrackEmissionsNavigatorParamList, TrackEmissionsScreenName } from "../navigation";

export function TrackEmissionsScreen({
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
            <Card onPress={() => navigation.push(TrackEmissionsScreenName.TRANSPORT_MODE)}>
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="train-car" size={32} />
                  <Title>Transport</Title>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}
