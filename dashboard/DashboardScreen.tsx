import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ImageBackground, View } from "react-native";
import { Button, Card, Paragraph, Title, Text } from "react-native-paper";
import { NavigatorParamList, ScreenName } from "../navigation";
import { theme } from "../theme";

export function DashboardScreen({ navigation }: NativeStackScreenProps<NavigatorParamList, ScreenName.DASHBOARD>) {
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
            <Card>
              <Card.Content>
                <Title>Last 12 months</Title>
                <Paragraph>
                  In the last 12 months you emitted <Text style={{ color: theme.colors.primary }}>50.56 kg</Text> of
                  CO2.
                </Paragraph>
              </Card.Content>
            </Card>
            <View style={{ padding: 16 }}>
              <Button icon="plus" mode="contained" onPress={() => navigation.navigate(ScreenName.TRACK_EMISSIONS)}>
                Track emissions
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}
