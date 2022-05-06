import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { startOfDay } from "date-fns";
import React, { Reducer, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, Modal, Paragraph, Portal, ProgressBar, TextInput } from "react-native-paper";
import { ApiContext, FuelType, TransportMode } from "../api";
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

  const [title, setTitle] = useState(toInitialTitle(mode));
  const [date, setDate] = useState(startOfDay(new Date()));
  const [dateString, setDateString] = useState(date.toLocaleDateString());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [specificEmissions, setSpecificEmissions] = useState("0.0");
  const [totalEmissions, setTotalEmissions] = useState("0.0");
  const [distance, setDistance] = useState("0.0");

  const [isCustomSpecificEmissions, setIsCustomSpecificEmissions] = useState(false);
  const [fuelType, setFuelType] = useState<FuelType.Electricity | FuelType.Diesel>(FuelType.Electricity);
  const [trainType, setTrainType] = useState<TrainType>(TrainType.Local);

  const [state, dispatchAction] = useReducer<
    Reducer<TotalEmissionsTrainReducerState, TotalEmissionsTrainReducerAction>
  >(totalEmissionsTrainReducer, {
    distance: 0,
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
              dispatchAction({
                type: "initialize",
                payload: {
                  distance: result.distance || 0,
                  specificEmissions: result.specificEmissions || 0,
                  totalEmissions: result.totalEmissions || 0,
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
        const { activityId, errors } = await transportActivityAPI.createTransportActivity({
          params: { title, date: startOfDay(date).toISOString(), transportMode: TransportMode.Train, ...state },
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
            ...state,
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
                <TextInput
                  label="Distance"
                  value={distance}
                  onChangeText={(text) => {
                    setDistance(text);
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
                  style={{ marginBottom: 8 }}
                />
                <View style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
                  {[FuelType.Electricity, FuelType.Diesel].map((item) => {
                    <FuelTypeButton
                      key={item}
                      fuelType={item}
                      selectedFuelType={fuelType}
                      onChange={(value) => {
                        if (value === FuelType.Electricity || value === FuelType.Diesel) {
                          setFuelType(value);
                          setIsCustomSpecificEmissions(false);
                        }
                      }}
                      style={{ opacity: isCustomSpecificEmissions ? 0.5 : 1 }}
                    />;
                  })}
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
                  {[FuelType.Electricity, FuelType.Diesel].map((item) => {
                    <FuelTypeButton
                      key={item}
                      fuelType={item}
                      selectedFuelType={fuelType}
                      onChange={(value) => {
                        // TS compiler can't figure this out itself, so we need this check
                        if (value === FuelType.Electricity || value === FuelType.Diesel) {
                          setFuelType(value);
                          setIsCustomSpecificEmissions(false);
                          setSpecificEmissions(getSpecificEmissions({ fuelType: value, trainType }).toFixed(2));
                          dispatchAction({
                            type: "setSpecificEmissions",
                            payload: { specificEmissions: getSpecificEmissions({ fuelType: value, trainType }) },
                          });
                        }
                      }}
                      style={{ opacity: isCustomSpecificEmissions ? 0.75 : 1 }}
                    />;
                  })}
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
                  {[TrainType.Local, TrainType.Local].map((value) => {
                    <Button
                      key={value}
                      mode={trainType === value ? "contained" : "outlined"}
                      onPress={() => {
                        setTrainType(value);
                        setIsCustomSpecificEmissions(false);
                        setSpecificEmissions(getSpecificEmissions({ fuelType, trainType: value }).toFixed(2));
                        dispatchAction({
                          type: "setSpecificEmissions",
                          payload: { specificEmissions: getSpecificEmissions({ fuelType, trainType: value }) },
                        });
                      }}
                      style={{ opacity: isCustomSpecificEmissions ? 0.75 : 1 }}
                    >
                      {value}
                    </Button>;
                  })}
                </View>
                <TextInput
                  label="Specific emissions"
                  value={specificEmissions}
                  onChangeText={(text) => {
                    setSpecificEmissions(text);
                    setIsCustomSpecificEmissions(true);
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
                  style={{ marginBottom: 8 }}
                />
                <TextInput
                  label="Total emissions"
                  value={totalEmissions}
                  keyboardType="numeric"
                  selectTextOnFocus
                  onChangeText={(text) => {
                    setTotalEmissions(text);
                    setIsCustomSpecificEmissions(true);
                    if (!isNaN(parseFloat(text)))
                      dispatchAction({
                        type: "setTotalEmissions",
                        payload: { totalEmissions: parseFloat(text) },
                      });
                  }}
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

function getSpecificEmissions({
  fuelType,
  trainType,
}: {
  fuelType: FuelType.Electricity | FuelType.Diesel;
  trainType: TrainType;
}) {
  const kgPerPassengerKm = 0;
  if (fuelType === FuelType.Electricity) {
    if (trainType === TrainType.Local) return 0.0546; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={F9C83447-3994-4B54-B7D7-A5E6B81C725E})
    if (trainType === TrainType.LongDistance) return 0.00948; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={A4FFA0CD-2550-4435-BBDE-00C6F1A0B22F})
  } else if (fuelType === FuelType.Diesel) {
    if (trainType === TrainType.Local) return 0.0713; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={08984DE8-B8F1-46C1-824B-910FD9E8A023})
    if (trainType === TrainType.LongDistance) return 0.044; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={968DDFF4-52FF-4C77-8F1D-F21DD202C11C})
  }
  return kgPerPassengerKm * 1000; // g/passenger-km
}

enum TrainType {
  Local = "Local",
  LongDistance = "Long-Distance",
}
