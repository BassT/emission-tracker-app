import { useFocusEffect } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { startOfDay, subMonths } from "date-fns";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ImageBackground, View } from "react-native";
import { Button, Card, Paragraph, Title, Text, IconButton } from "react-native-paper";
import { ListResultItem, ApiContext } from "../api";
import { AuthContext } from "../auth/AuthContext";
import { MainNavigatorParamList, MainScreenName, TrackEmissionsScreenName } from "../navigation";

export function DashboardScreen({
  navigation,
}: NativeStackScreenProps<MainNavigatorParamList, MainScreenName.DASHBOARD>) {
  const { logOut } = useContext(AuthContext);
  const { transportActivityAPI, initialized } = useContext(ApiContext);
  const [items, setItems] = useState<null | ListResultItem[]>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const { result, errors } = await transportActivityAPI.listTransportAcitivites({
          params: { totalEmissions: true, dateAfter: startOfDay(subMonths(new Date(), 12)) },
          options: {},
        });
        if (errors) console.error("Failed to fetch total emissions.", { errors });
        if (result) setItems(result);
      };
      if (initialized) fetchData();
    }, [initialized, transportActivityAPI])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton icon="logout" onPress={() => logOut()} />,
    });
  }, [logOut, navigation]);

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
                  <Text style={{ fontWeight: "bold" }}>{((emissionsSum / 2500) * 100).toFixed(2)}%</Text> of this
                  recommended goal.
                </Paragraph>
              </Card.Content>
            </Card>
            <View style={{ padding: 16 }}>
              <Button
                icon="plus"
                mode="contained"
                onPress={() =>
                  navigation.navigate(MainScreenName.TRACK_EMISSIONS, {
                    screen: TrackEmissionsScreenName.OVERVIEW,
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
