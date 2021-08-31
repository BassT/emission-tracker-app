import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, ImageBackground } from "react-native";
import { Card, Title } from "react-native-paper";
import { NavigatorParamList, ScreenName } from "../navigation";

export function TrackEmissionsScreen({
  navigation,
}: NativeStackScreenProps<NavigatorParamList, ScreenName.TRACK_EMISSIONS>) {
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
            <Card onPress={() => navigation.navigate(ScreenName.TRANSPORT_MODE)}>
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="car" size={32} />
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
