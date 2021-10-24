import { useFocusEffect } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { subMonths } from "date-fns";
import React, { useContext, useState } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, Paragraph, Title, Text } from "react-native-paper";
import { ListResultItem } from "../api";
import { AppContext } from "../AppContext";
import { MainNavigatorParamList, MainScreenName, TrackEmissionsScreenName } from "../navigation";

export function DashboardScreen({
  navigation,
}: NativeStackScreenProps<MainNavigatorParamList, MainScreenName.DASHBOARD>) {
  const { transportActivityAPI, naiveAuthUserId } = useContext(AppContext);
  const [items, setItems] = useState<null | ListResultItem[]>(null);

  useFocusEffect(() => {
    const fetchData = async () => {
      const { result, errors } = await transportActivityAPI.listTransportAcitivites({
        params: { totalEmissions: true, dateAfter: subMonths(new Date(), 12) },
        options: { naiveAuthUserId },
      });
      if (errors) Alert.alert("Failed to fetch total emissions.");
      if (result) setItems(result);
    };
    fetchData();
  });

  const emissionsSum =
    items?.reduce<number>((sum, item) => {
      return sum + (item.totalEmissions || 0);
    }, 0) ?? 0;

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
                  In the last 12 months you emitted{" "}
                  <Text style={{ fontWeight: "bold" }}>{emissionsSum?.toFixed(2)} kg</Text> of CO2.
                </Paragraph>
                <Paragraph>
                  Experts say you should aim for 2.5 tons of CO2 per year to prevent catastrophic consequences due to
                  climate warming. In the last 12 months you emitted{" "}
                  <Text style={{ fontWeight: "bold" }}>{(emissionsSum / 2500).toFixed(2)}%</Text> of this recommended
                  goal.
                </Paragraph>
              </Card.Content>
            </Card>
            <View style={{ padding: 16 }}>
              <Button
                icon="plus"
                mode="contained"
                onPress={() =>
                  navigation.navigate(MainScreenName.TRACK_EMISSIONS, {
                    screen: TrackEmissionsScreenName.TRACK_EMISSIONS,
                  })
                }
              >
                Track emissions
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}
