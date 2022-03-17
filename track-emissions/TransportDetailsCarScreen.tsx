import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { startOfDay } from "date-fns";
import React, { Reducer, useCallback, useContext, useReducer, useState } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, Modal, Paragraph, Portal, ProgressBar, TextInput } from "react-native-paper";
import { ApiContext, CalcMode, FuelType } from "../api";
import {
  MainNavigatorParamList,
  MainScreenName,
  TrackEmissionsNavigatorParamList,
  TrackEmissionsScreenName,
} from "../navigation";
import { theme } from "../theme";
import { SpecificEmissionsDetailsInput } from "./TransportDetailsCarScreen/SpecificEmissionsDetailsInput";
import { CalcModeButtonGroup } from "./TransportDetailsCarScreen/CalcModeButtonGroup";
import {
  TotalEmissionReducerState,
  TotalEmissionReducerAction,
  totalEmissionReducer,
} from "./TransportDetailsCarScreen/totalEmissionReducer";
import { toInitialTitle } from "./TransportMode";
import { TotalFuelDetailsInput } from "./TransportDetailsCarScreen/TotalFuelDetailsInput";
import { SpecificFuelDetailsInput } from "./TransportDetailsCarScreen/SpecificFuelDetailsInput";
import { DeleteTransportActivityIcon } from "./TransportDetailsCarScreen/DeleteTransportActivityIcon";

export function TransportDetailsCarScreen({
  navigation,
  route: {
    params: { mode, transportActivityId },
  },
}: CompositeScreenProps<
  NativeStackScreenProps<TrackEmissionsNavigatorParamList, TrackEmissionsScreenName.TRANSPORT_DETAILS>,
  BottomTabScreenProps<MainNavigatorParamList>
>) {
  const { transportActivityAPI, initialized } = useContext(ApiContext);

  const [isLoadingInitialData, setIsLoadingInitialData] = useState(Boolean(transportActivityId));
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState(toInitialTitle(mode));
  const [date, setDate] = useState(startOfDay(new Date()));
  const [dateString, setDateString] = useState(date.toLocaleDateString());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [specificEmissions, setSpecificEmissions] = useState("0.0");
  const [distance, setDistance] = useState("0.0");
  const [persons, setPersons] = useState("1");
  const [totalFuelConsumption, setTotalFuelConsumption] = useState("0.0");
  const [specificFuelConsumption, setSpecificFuelConsumption] = useState("0.0");

  const [totalEmissionsReducerState, dispatchTotalEmissionsReducerAction] = useReducer<
    Reducer<TotalEmissionReducerState, TotalEmissionReducerAction>
  >(totalEmissionReducer, {
    distance: 0,
    specificEmissions: 0,
    fuelType: FuelType.Diesel,
    specificFuelConsumption: 0,
    totalFuelConsumption: 0,
    totalEmissions: 0,
    calcMode: CalcMode.SpecificEmissions,
    persons: 1,
  });

  useFocusEffect(
    useCallback(() => {
      if (transportActivityId) {
        const fetchData = async () => {
          setIsLoadingInitialData(true);
          try {
            const { result, errors } = await transportActivityAPI.getTransportActivityDetails({
              params: { id: transportActivityId },
              options: {},
            });
            if (errors) Alert.alert("Failed to load transport details", JSON.stringify(errors, null, 2));
            if (result) {
              setTitle(result.title);
              setDate(new Date(result.date));
              setDateString(new Date(result.date).toLocaleDateString());
              setSpecificEmissions(result.specificEmissions.toFixed(2));
              setDistance(result.distance.toFixed(2));
              setPersons(result.persons.toString());
              setTotalFuelConsumption(result.totalFuelConsumption.toFixed(2));
              setSpecificFuelConsumption(result.specificFuelConsumption.toFixed(2));
              dispatchTotalEmissionsReducerAction({ type: "initialize", payload: result });
            }
          } catch (error) {
            console.error(
              "Unexpected error occurred trying to get transport activity details",
              JSON.stringify({ error }, null, 2)
            );
          } finally {
            setIsLoadingInitialData(false);
          }
        };

        if (initialized) fetchData();

        navigation.setOptions({
          headerRight: () => (
            <DeleteTransportActivityIcon
              {...{ setIsDeleting, transportActivityAPI, transportActivityId, navigation }}
            />
          ),
        });
      }
    }, [transportActivityId, navigation, transportActivityAPI, initialized])
  );

  const handlePressSave = async () => {
    const create = async () => {
      try {
        setIsCreating(true);
        const { activityId, errors } = await transportActivityAPI.createTransportActivity({
          params: { title, date: startOfDay(date).toISOString(), ...totalEmissionsReducerState },
          options: {},
        });
        if (errors) {
          Alert.alert("Failed to create transport activity", JSON.stringify(errors, null, 2));
        }
        if (activityId) {
          Alert.alert("Created transport activity successfully", undefined, [
            {
              text: "OK",
              onPress: () => navigation.jumpTo(MainScreenName.EMISSIONS, { screen: TrackEmissionsScreenName.OVERVIEW }),
            },
          ]);
        }
      } catch (error) {
        console.error(
          "Unexpected error occurred trying to create transport activity",
          JSON.stringify({ error }, null, 2)
        );
      } finally {
        setIsCreating(false);
      }
    };

    const update = async () => {
      if (!transportActivityId) return;
      try {
        setIsUpdating(true);
        const { errors } = await transportActivityAPI.updateTransportActivity({
          params: {
            ...totalEmissionsReducerState,
            id: transportActivityId,
            title,
            date: startOfDay(date).toISOString(),
          },
          options: {},
        });
        if (errors) {
          Alert.alert("Failed to update transport activity", JSON.stringify(errors, null, 2));
        }
        Alert.alert("Updated transport activity successfully", "", [
          {
            text: "OK",
            onPress: () => navigation.jumpTo(MainScreenName.EMISSIONS, { screen: TrackEmissionsScreenName.OVERVIEW }),
          },
        ]);
      } catch (error) {
        console.error(
          "Unexpected error occurred trying to update transport activity",
          JSON.stringify({ error }, null, 2)
        );
      } finally {
        setIsUpdating(false);
      }
    };

    if (transportActivityId) {
      update();
    } else {
      create();
    }
  };

  return (
    <>
      <Portal>
        <Modal
          visible={isLoadingInitialData}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            padding: 32,
            margin: 32,
          }}
        >
          <Paragraph>Loading...</Paragraph>
          <ProgressBar indeterminate />
        </Modal>
      </Portal>

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
                <CalcModeButtonGroup {...{ totalEmissionsReducerState, dispatchTotalEmissionsReducerAction }} />
                {totalEmissionsReducerState.calcMode === CalcMode.SpecificEmissions ? (
                  <SpecificEmissionsDetailsInput
                    {...{
                      specificEmissions,
                      setSpecificEmissions,
                      dispatchTotalEmissionsReducerAction,
                      distance,
                      setDistance,
                    }}
                  />
                ) : null}
                {totalEmissionsReducerState.calcMode === CalcMode.TotalFuel ? (
                  <TotalFuelDetailsInput
                    {...{
                      totalEmissionsReducerState,
                      dispatchTotalEmissionsReducerAction,
                      totalFuelConsumption,
                      setTotalFuelConsumption,
                    }}
                  />
                ) : null}
                {totalEmissionsReducerState.calcMode === CalcMode.SpecificFuel ? (
                  <SpecificFuelDetailsInput
                    {...{
                      totalEmissionsReducerState,
                      dispatchTotalEmissionsReducerAction,
                      specificFuelConsumption,
                      setSpecificFuelConsumption,
                      distance,
                      setDistance,
                    }}
                  />
                ) : null}
                <TextInput
                  label="Persons in vehicle"
                  value={persons}
                  onChangeText={(text) => {
                    setPersons(text);
                    if (!isNaN(parseInt(text)) && parseInt(text) > 0)
                      dispatchTotalEmissionsReducerAction({
                        type: "setPersons",
                        payload: { persons: parseInt(text) },
                      });
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                  error={isNaN(parseInt(persons)) || parseInt(persons) < 1}
                  style={{ marginBottom: 8, marginTop: 24 }}
                />
                <TextInput
                  label="Total emissions"
                  value={totalEmissionsReducerState.totalEmissions.toString()}
                  disabled
                  keyboardType="numeric"
                  selectTextOnFocus
                  right={<TextInput.Affix text="kg CO2" />}
                  style={{ marginBottom: 16 }}
                />
                <View style={{ display: "flex", alignItems: "flex-end" }}>
                  <Button
                    onPress={handlePressSave}
                    disabled={isCreating || isUpdating || isDeleting}
                    loading={isCreating || isUpdating || isDeleting}
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
