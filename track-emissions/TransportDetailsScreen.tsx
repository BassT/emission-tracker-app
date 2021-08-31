import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { NavigatorParamList, ScreenName } from "../navigation";
import { toInitialTitle } from "./TransportMode";

export function TransportDetailsScreen({
  route,
}: NativeStackScreenProps<NavigatorParamList, ScreenName.TRANSPORT_DETAILS>) {
  const [title, setTitle] = useState(toInitialTitle(route.params.mode));
  const [distance, setDistance] = useState("0");
  const [specificEmissions, setSpecificEmissions] = useState("0.0");
  const [totalEmissions, setTotalEmissions] = useState("0");

  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState(date.toLocaleDateString());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

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
                <TextInput
                  label="Title"
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  style={{ marginBottom: 8 }}
                  selectTextOnFocus
                />
                <TextInput
                  label="Date"
                  value={dateString}
                  onFocus={() => setIsDatePickerVisible(true)}
                  style={{ marginBottom: 8 }}
                />
                <TextInput
                  label="Distance"
                  value={distance}
                  onChangeText={(text) => setDistance(text)}
                  keyboardType="numeric"
                  selectTextOnFocus
                  right={<TextInput.Affix text="km" />}
                  error={isNaN(parseFloat(distance))}
                  style={{ marginBottom: 8 }}
                />
                <TextInput
                  label="Specific emissions"
                  value={specificEmissions}
                  onChangeText={(text) => {
                    setSpecificEmissions(text);

                    const specificEmissionsNumber = parseFloat(text);
                    const distanceNumber = parseFloat(distance);
                    if (!isNaN(specificEmissionsNumber) && !isNaN(distanceNumber)) {
                      setTotalEmissions(((specificEmissionsNumber / 1000) * distanceNumber).toFixed(2));
                    }
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                  right={<TextInput.Affix text="g CO2 / km" />}
                  error={isNaN(parseFloat(specificEmissions))}
                  style={{ marginBottom: 8 }}
                />
                <TextInput
                  label="Total emissions"
                  value={totalEmissions.toString()}
                  onChangeText={(text) => {
                    setTotalEmissions(text);

                    const totalEmissionsNumber = parseFloat(text);
                    const distanceNumber = parseFloat(distance);
                    if (!isNaN(totalEmissionsNumber) && !isNaN(distanceNumber)) {
                      setSpecificEmissions((totalEmissionsNumber / distanceNumber).toFixed(2));
                    }
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                  right={<TextInput.Affix text="kg CO2" />}
                  error={isNaN(parseFloat(totalEmissions))}
                  style={{ marginBottom: 16 }}
                />
                <View style={{ display: "flex", alignItems: "flex-end" }}>
                  <Button
                    onPress={() =>
                      Alert.alert(
                        "Not yet implemented",
                        `Will save:\n${JSON.stringify(
                          {
                            title,
                            date,
                            distance: parseFloat(distance),
                            specificEmissions: parseFloat(specificEmissions),
                            totalEmissions: parseFloat(totalEmissions),
                          },
                          null,
                          2
                        )}`
                      )
                    }
                  >
                    Save
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ImageBackground>
      </View>
      {isDatePickerVisible ? (
        <DateTimePicker
          value={date}
          onChange={(event: Event, date: Date | undefined) => {
            setIsDatePickerVisible(false);
            if (date) {
              setDate(date);
              setDateString(date.toLocaleDateString());
            }
          }}
          mode="date"
        />
      ) : null}
    </>
  );
}
