import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, ImageBackground } from "react-native";
import { Card, Title } from "react-native-paper";
import { NavigatorParamList, ScreenName } from "../navigation";
import { TransportMode } from "./TransportMode";

export function TransportModeScreen({
  navigation,
}: NativeStackScreenProps<NavigatorParamList, ScreenName.TRANSPORT_MODE>) {
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
              onPress={() => navigation.navigate(ScreenName.TRANSPORT_DETAILS, { mode: TransportMode.CAR })}
            >
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="car" size={32} />
                  <Title>Car</Title>
                </View>
              </Card.Content>
            </Card>
            <Card style={{ marginBottom: 8 }}>
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="train" size={32} />
                  <Title>Train</Title>
                </View>
              </Card.Content>
            </Card>
            <Card style={{ marginBottom: 8 }}>
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="motorbike" size={32} />
                  <Title>Motorbike</Title>
                </View>
              </Card.Content>
            </Card>
            <Card style={{ marginBottom: 8 }}>
              <Card.Content>
                <View style={{ padding: 16, display: "flex", alignItems: "center" }}>
                  <MaterialCommunityIcons name="airplane" size={32} />
                  <Title>Airplane</Title>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}
