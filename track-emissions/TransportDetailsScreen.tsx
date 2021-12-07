import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { startOfDay } from "date-fns";
import React, { Reducer, useCallback, useContext, useReducer, useState } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, IconButton, Modal, Paragraph, Portal, ProgressBar, TextInput } from "react-native-paper";
import { ApiContext, CalcMode, FuelType, TransportDetails } from "../api";
import {
  MainNavigatorParamList,
  MainScreenName,
  TrackEmissionsNavigatorParamList,
  TrackEmissionsScreenName,
} from "../navigation";
import { theme } from "../theme";
import { getSpecificEmissionsByFuelType } from "./FuelType";
import { toInitialTitle } from "./TransportMode";

export function TransportDetailsScreen({
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
            <IconButton
              icon="delete"
              onPress={async () => {
                try {
                  const { errors } = await transportActivityAPI.deleteTransportActivity({
                    params: { id: transportActivityId },
                    options: {},
                  });
                  if (errors) {
                    Alert.alert("Failed to delete transport activity", JSON.stringify(errors, null, 2));
                  }
                  Alert.alert("Deleted transport activity successfully", "", [
                    {
                      text: "OK",
                      onPress: () =>
                        // eslint-disable-next-line react/prop-types
                        navigation.jumpTo(MainScreenName.EMISSIONS, {
                          screen: TrackEmissionsScreenName.OVERVIEW,
                        }),
                    },
                  ]);
                } catch (error) {
                  console.error(
                    "Unexpected error occurred trying to delete transport activity details",
                    JSON.stringify({ error }, null, 2)
                  );
                }
              }}
            />
          ),
        });
      }
    }, [transportActivityId, navigation, transportActivityAPI, initialized])
  );

  const handlePressSave = async () => {
    const create = async () => {
      try {
        const { activityId, errors } = await transportActivityAPI.createTransportActivity({
          params: { title, date: startOfDay(date).toISOString(), ...totalEmissionsReducerState },
          options: {},
        });
        if (errors) {
          Alert.alert("Failed to create transport activity", JSON.stringify(errors, null, 2));
        }
        if (activityId) {
          Alert.alert("Created transport activity", `ID: ${activityId}`, [
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
      }
    };

    const update = async () => {
      if (!transportActivityId) return;
      try {
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
                <View style={{ display: "flex", flexDirection: "row", marginBottom: 8, marginTop: 16 }}>
                  <Button
                    compact
                    mode={totalEmissionsReducerState.calcMode === CalcMode.SpecificEmissions ? "contained" : "outlined"}
                    style={{ width: "33%" }}
                    labelStyle={{ fontSize: 8 }}
                    onPress={() =>
                      dispatchTotalEmissionsReducerAction({
                        type: "setCalcMode",
                        payload: { calcMode: CalcMode.SpecificEmissions },
                      })
                    }
                  >
                    Specific emission
                  </Button>
                  <Button
                    compact
                    mode={totalEmissionsReducerState.calcMode === CalcMode.TotalFuel ? "contained" : "outlined"}
                    style={{ width: "33%" }}
                    labelStyle={{ fontSize: 8 }}
                    onPress={() =>
                      dispatchTotalEmissionsReducerAction({
                        type: "setCalcMode",
                        payload: { calcMode: CalcMode.TotalFuel },
                      })
                    }
                  >
                    Total fuel
                  </Button>
                  <Button
                    compact
                    mode={totalEmissionsReducerState.calcMode === CalcMode.SpecificFuel ? "contained" : "outlined"}
                    style={{ width: "33%" }}
                    labelStyle={{ fontSize: 8 }}
                    onPress={() =>
                      dispatchTotalEmissionsReducerAction({
                        type: "setCalcMode",
                        payload: { calcMode: CalcMode.SpecificFuel },
                      })
                    }
                  >
                    Specific fuel
                  </Button>
                </View>
                {totalEmissionsReducerState.calcMode === CalcMode.SpecificEmissions ? (
                  <>
                    <TextInput
                      label="Specific emissions"
                      value={specificEmissions}
                      onChangeText={(text) => {
                        setSpecificEmissions(text);
                        if (!isNaN(parseFloat(text)))
                          dispatchTotalEmissionsReducerAction({
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
                      label="Distance"
                      value={distance}
                      onChangeText={(text) => {
                        setDistance(text);
                        if (!isNaN(parseFloat(text)))
                          dispatchTotalEmissionsReducerAction({
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
                  </>
                ) : null}
                {totalEmissionsReducerState.calcMode === CalcMode.TotalFuel ? (
                  <>
                    <View style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
                      <Button
                        mode={totalEmissionsReducerState.fuelType === FuelType.Diesel ? "contained" : "outlined"}
                        onPress={() =>
                          dispatchTotalEmissionsReducerAction({
                            type: "setFuelType",
                            payload: { fuelType: FuelType.Diesel },
                          })
                        }
                      >
                        Diesel
                      </Button>
                      <Button
                        mode={totalEmissionsReducerState.fuelType === FuelType.Gasoline ? "contained" : "outlined"}
                        onPress={() =>
                          dispatchTotalEmissionsReducerAction({
                            type: "setFuelType",
                            payload: { fuelType: FuelType.Gasoline },
                          })
                        }
                      >
                        Gasoline
                      </Button>
                    </View>
                    <TextInput
                      label="Total consumption"
                      value={totalFuelConsumption}
                      onChangeText={(text) => {
                        setTotalFuelConsumption(text);
                        if (!isNaN(parseFloat(totalFuelConsumption)))
                          dispatchTotalEmissionsReducerAction({
                            type: "setTotalFuelConsumption",
                            payload: { totalFuelConsumption: parseFloat(text) },
                          });
                      }}
                      keyboardType="numeric"
                      selectTextOnFocus
                      right={<TextInput.Affix text="l" />}
                      error={isNaN(parseFloat(totalFuelConsumption))}
                    />
                  </>
                ) : null}
                {totalEmissionsReducerState.calcMode === CalcMode.SpecificFuel ? (
                  <>
                    <View style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
                      <Button
                        mode={totalEmissionsReducerState.fuelType === FuelType.Diesel ? "contained" : "outlined"}
                        onPress={() =>
                          dispatchTotalEmissionsReducerAction({
                            type: "setFuelType",
                            payload: { fuelType: FuelType.Diesel },
                          })
                        }
                      >
                        Diesel
                      </Button>
                      <Button
                        mode={totalEmissionsReducerState.fuelType === FuelType.Gasoline ? "contained" : "outlined"}
                        onPress={() =>
                          dispatchTotalEmissionsReducerAction({
                            type: "setFuelType",
                            payload: { fuelType: FuelType.Gasoline },
                          })
                        }
                      >
                        Gasoline
                      </Button>
                    </View>
                    <TextInput
                      label="Specific fuel consumption"
                      value={specificFuelConsumption}
                      onChangeText={(text) => {
                        setSpecificFuelConsumption(text);
                        if (!isNaN(parseFloat(specificFuelConsumption)))
                          dispatchTotalEmissionsReducerAction({
                            type: "setSpecificFuelConsumption",
                            payload: { specificFuelConsumption: parseFloat(text) },
                          });
                      }}
                      keyboardType="numeric"
                      selectTextOnFocus
                      right={<TextInput.Affix text="l / 100 km" />}
                      error={isNaN(parseFloat(specificFuelConsumption))}
                      style={{ marginBottom: 8 }}
                    />
                    <TextInput
                      label="Distance"
                      value={distance}
                      onChangeText={(text) => {
                        setDistance(text);
                        if (!isNaN(parseFloat(text)))
                          dispatchTotalEmissionsReducerAction({
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
                  </>
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
                  <Button onPress={handlePressSave}>Save</Button>
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

interface TotalEmissionReducerState {
  distance: number;
  specificEmissions: number;
  fuelType: FuelType;
  specificFuelConsumption: number;
  totalFuelConsumption: number;
  totalEmissions: number;
  calcMode: CalcMode;
  persons: number;
}

interface EmissionReducertSetDistanceAction {
  type: "setDistance";
  payload: {
    distance: number;
  };
}

interface EmissionReducerSetSpecificEmissionsAction {
  type: "setSpecificEmissions";
  payload: {
    specificEmissions: number;
  };
}

interface EmissionReducerSetFuelTypeAction {
  type: "setFuelType";
  payload: {
    fuelType: FuelType;
  };
}

interface EmissionReducerSetSpecificFuelConsumptionAction {
  type: "setSpecificFuelConsumption";
  payload: {
    specificFuelConsumption: number;
  };
}

interface EmissionReducerSetTotalFuelConsumptionAction {
  type: "setTotalFuelConsumption";
  payload: {
    totalFuelConsumption: number;
  };
}

interface EmissionReducerSetCalcModeAction {
  type: "setCalcMode";
  payload: {
    calcMode: CalcMode;
  };
}

interface EmissionReducerSetPersonsAction {
  type: "setPersons";
  payload: {
    persons: number;
  };
}

interface EmissionReducerInitializeAction {
  type: "initialize";
  payload: TransportDetails;
}

type TotalEmissionReducerAction =
  | EmissionReducerInitializeAction
  | EmissionReducertSetDistanceAction
  | EmissionReducerSetSpecificEmissionsAction
  | EmissionReducerSetFuelTypeAction
  | EmissionReducerSetSpecificFuelConsumptionAction
  | EmissionReducerSetTotalFuelConsumptionAction
  | EmissionReducerSetCalcModeAction
  | EmissionReducerSetPersonsAction;

function totalEmissionReducer(
  state: TotalEmissionReducerState,
  action: TotalEmissionReducerAction
): TotalEmissionReducerState {
  switch (action.type) {
    case "initialize":
      return {
        ...state,
        distance: action.payload.distance,
        specificEmissions: action.payload.specificEmissions,
        fuelType: action.payload.fuelType,
        specificFuelConsumption: action.payload.specificFuelConsumption,
        totalFuelConsumption: action.payload.totalFuelConsumption,
        totalEmissions: action.payload.totalEmissions,
        calcMode: action.payload.calcMode,
        persons: action.payload.persons,
      };
    case "setDistance":
      if (state.calcMode === CalcMode.SpecificFuel) {
        return {
          ...state,
          distance: action.payload.distance,
          totalEmissions: calculateTotalEmissions({
            ...state,
            distance: action.payload.distance,
          }),
          totalFuelConsumption: (state.specificFuelConsumption / 100) * action.payload.distance,
        };
      } else if (state.calcMode === CalcMode.SpecificEmissions) {
        return {
          ...state,
          distance: action.payload.distance,
          totalEmissions: calculateTotalEmissions({
            ...state,
            distance: action.payload.distance,
          }),
        };
      }
      return state;
    case "setSpecificEmissions":
      if (state.calcMode === CalcMode.SpecificEmissions) {
        return {
          ...state,
          specificEmissions: action.payload.specificEmissions,
          totalEmissions: calculateTotalEmissions({
            ...state,
            specificEmissions: action.payload.specificEmissions,
          }),
        };
      }
      return { ...state };
    case "setFuelType":
      return {
        ...state,
        fuelType: action.payload.fuelType,
        totalEmissions: calculateTotalEmissions({
          ...state,
          fuelType: action.payload.fuelType,
        }),
      };
    case "setSpecificFuelConsumption":
      return {
        ...state,
        specificFuelConsumption: action.payload.specificFuelConsumption,
        totalEmissions: calculateTotalEmissions({
          ...state,
          specificFuelConsumption: action.payload.specificFuelConsumption,
        }),
      };
    case "setTotalFuelConsumption":
      return {
        ...state,
        totalFuelConsumption: action.payload.totalFuelConsumption,
        totalEmissions: calculateTotalEmissions({
          ...state,
          totalFuelConsumption: action.payload.totalFuelConsumption,
        }),
      };
    case "setCalcMode":
      return {
        ...state,
        calcMode: action.payload.calcMode,
        totalEmissions: calculateTotalEmissions({ ...state, calcMode: action.payload.calcMode }),
      };
    case "setPersons":
      return {
        ...state,
        persons: action.payload.persons,
        totalEmissions: calculateTotalEmissions({ ...state, persons: action.payload.persons }),
      };
    default:
      return state;
  }
}

function calculateTotalEmissions({
  calcMode,
  specificEmissions,
  distance,
  totalFuelConsumption,
  fuelType,
  specificFuelConsumption,
  persons,
}: {
  calcMode: CalcMode;
  specificEmissions: number;
  distance: number;
  totalFuelConsumption: number;
  fuelType: FuelType;
  specificFuelConsumption: number;
  persons: number;
}) {
  switch (calcMode) {
    case CalcMode.SpecificEmissions:
      return ((specificEmissions / 1000) * distance) / persons;
    case CalcMode.TotalFuel:
      return (totalFuelConsumption * getSpecificEmissionsByFuelType(fuelType)) / persons;
    case CalcMode.SpecificFuel:
      return ((specificFuelConsumption / 100) * distance * getSpecificEmissionsByFuelType(fuelType)) / persons;
    default:
      return 0;
  }
}
