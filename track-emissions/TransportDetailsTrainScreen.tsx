import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { startOfDay } from "date-fns";
import React, { Reducer, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, Modal, Paragraph, Portal, ProgressBar, TextInput } from "react-native-paper";
import {
  ApiContext,
  CreateTransportActivityParams,
  FuelType,
  TrainType,
  TransportMode,
  UpdateTransportActivityParams,
} from "../api";
import {
  MainNavigatorParamList,
  MainScreenName,
  TrackEmissionsNavigatorParamList,
  TrackEmissionsScreenName,
} from "../navigation";
import { theme } from "../theme";
import { DeleteTransportActivityIcon } from "./shared/DeleteTransportActivityIcon";
import { FuelTypeButton } from "./shared/FuelTypeButton";
import {
  totalEmissionsTrainReducer,
  TotalEmissionsTrainReducerAction,
  TotalEmissionsTrainReducerState,
} from "./TransportDetailsTrainScreen/totalEmissionTrainReducer";
import { toInitialTitle } from "./TransportMode";

export function TransportDetailsTrainScreen({
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

  const [isCustomSpecificEmissions, setIsCustomSpecificEmissions] = useState(false);
  const [isCustomTotalEmissions, setIsCustomTotalEmissions] = useState(false);

  const [title, setTitle] = useState(toInitialTitle(mode));
  const [date, setDate] = useState(startOfDay(new Date()));
  const [dateString, setDateString] = useState(date.toLocaleDateString());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [specificEmissions, setSpecificEmissions] = useState("0.0");
  const [totalEmissions, setTotalEmissions] = useState("0.0");
  const [distance, setDistance] = useState("0.0");

  const [state, dispatchAction] = useReducer<
    Reducer<TotalEmissionsTrainReducerState, TotalEmissionsTrainReducerAction>
  >(totalEmissionsTrainReducer, {
    distance: 0,
    fuelType: null,
    trainType: null,
    specificEmissions: 0,
    totalEmissions: 0,
  });

  useEffect(() => {
    if (isNaN(parseFloat(specificEmissions))) setSpecificEmissions(state.specificEmissions.toString());
    if (state.specificEmissions !== parseFloat(specificEmissions))
      setSpecificEmissions(state.specificEmissions.toString());
  }, [state.specificEmissions, specificEmissions]);

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
              if (typeof result.specificEmissions === "number")
                setSpecificEmissions(result.specificEmissions.toFixed(2));
              if (typeof result.distance === "number") setDistance(result.distance.toFixed(2));
              if (!result.trainType || !result.fuelType) setIsCustomSpecificEmissions(true);
              if (!result.specificEmissions) setIsCustomTotalEmissions(true);
              setTotalEmissions(result.totalEmissions.toString());
              dispatchAction({
                type: "initialize",
                payload: {
                  distance: result.distance || 0,
                  fuelType:
                    result.fuelType === FuelType.Electricity || result.fuelType === FuelType.Diesel
                      ? result.fuelType
                      : null,
                  trainType: result.trainType || null,
                  specificEmissions: result.specificEmissions || 0,
                  totalEmissions: result.totalEmissions,
                },
              });
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
        let args: CreateTransportActivityParams = {
          params: {
            title,
            date: startOfDay(date).toISOString(),
            transportMode: TransportMode.Train,
            totalEmissions: state.totalEmissions,
          },
          options: {},
        };
        if (!isCustomTotalEmissions) {
          args = {
            ...args,
            params: { ...args.params, distance: state.distance, specificEmissions: state.specificEmissions },
          };
        }
        if (!isCustomSpecificEmissions) {
          args = {
            ...args,
            params: {
              ...args.params,
              fuelType: state.fuelType ? state.fuelType : undefined,
              trainType: state.trainType || undefined,
            },
          };
        }
        const { activityId, errors } = await transportActivityAPI.createTransportActivity(args);
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
        let params: UpdateTransportActivityParams = {
          id: transportActivityId,
          title,
          date: startOfDay(date).toISOString(),
          totalEmissions: state.totalEmissions,
        };
        if (!isCustomTotalEmissions) {
          params = { ...params, distance: state.distance, specificEmissions: state.specificEmissions };
        }
        if (!isCustomSpecificEmissions) {
          params = { ...params, fuelType: state.fuelType || undefined, trainType: state.trainType || undefined };
        }
        const { errors } = await transportActivityAPI.updateTransportActivity({ params, options: {} });
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
                <TextInput
                  label="Distance"
                  value={distance}
                  onChangeText={(text) => {
                    setDistance(text);
                    setIsCustomTotalEmissions(false);
                    if (!isNaN(parseFloat(text)))
                      dispatchAction({
                        type: "setDistance",
                        payload: { distance: parseFloat(text) },
                      });
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                  right={<TextInput.Affix text="km" />}
                  error={isNaN(parseFloat(distance))}
                  style={{ marginBottom: 8, opacity: isCustomTotalEmissions ? 0.5 : 1 }}
                  testID="distance"
                />
                <View style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
                  {[FuelType.Electricity, FuelType.Diesel].map((item) => (
                    <FuelTypeButton
                      key={item}
                      fuelType={item}
                      selectedFuelType={state.fuelType}
                      onChange={(value) => {
                        if (value === FuelType.Electricity || value === FuelType.Diesel) {
                          setIsCustomSpecificEmissions(false);
                          setIsCustomTotalEmissions(false);
                          dispatchAction({
                            type: "setFuelType",
                            payload: { fuelType: value },
                          });
                        }
                      }}
                      style={{ opacity: isCustomSpecificEmissions || isCustomTotalEmissions ? 0.5 : 1 }}
                    />
                  ))}
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
                  {[TrainType.Local, TrainType.LongDistance].map((value) => (
                    <Button
                      key={value}
                      mode={state.trainType === value ? "contained" : "outlined"}
                      onPress={() => {
                        setIsCustomSpecificEmissions(false);
                        setIsCustomSpecificEmissions(false);
                        dispatchAction({
                          type: "setTrainType",
                          payload: { trainType: value },
                        });
                      }}
                      style={{ opacity: isCustomSpecificEmissions || isCustomTotalEmissions ? 0.5 : 1 }}
                    >
                      {value}
                    </Button>
                  ))}
                </View>
                <TextInput
                  label="Specific emissions"
                  value={specificEmissions}
                  onChangeText={(text) => {
                    setSpecificEmissions(text);
                    setIsCustomSpecificEmissions(true);
                    setIsCustomTotalEmissions(false);
                    if (!isNaN(parseFloat(text)))
                      dispatchAction({
                        type: "setSpecificEmissions",
                        payload: { specificEmissions: parseFloat(text) },
                      });
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                  right={<TextInput.Affix text="g CO2 / km" />}
                  error={isNaN(parseFloat(specificEmissions))}
                  style={{ marginBottom: 8, opacity: isCustomTotalEmissions ? 0.5 : 1 }}
                  testID="specific-emissions"
                />
                <TextInput
                  label="Total emissions"
                  value={isCustomTotalEmissions ? totalEmissions : state.totalEmissions.toString()}
                  keyboardType="numeric"
                  selectTextOnFocus
                  onChangeText={(text) => {
                    setIsCustomTotalEmissions(true);
                    setTotalEmissions(text);
                    if (!isNaN(parseFloat(text)))
                      dispatchAction({
                        type: "setTotalEmissions",
                        payload: { totalEmissions: parseFloat(text) },
                      });
                  }}
                  right={<TextInput.Affix text="kg CO2" />}
                  style={{ marginBottom: 16 }}
                  testID="total-emissions"
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
          onChange={(event: DateTimePickerEvent, date: Date | undefined) => {
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
