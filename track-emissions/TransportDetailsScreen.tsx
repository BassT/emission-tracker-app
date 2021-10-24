import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useReducer, useState } from "react";
import { Reducer } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { CalcMode, FuelType } from "../api";
import { AppContext } from "../AppContext";
import {
  MainNavigatorParamList,
  MainScreenName,
  TrackEmissionsNavigatorParamList,
  TrackEmissionsScreenName,
} from "../navigation";
import { getSpecificEmissionsByFuelType } from "./FuelType";
import { toInitialTitle } from "./TransportMode";

export function TransportDetailsScreen({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<TrackEmissionsNavigatorParamList, TrackEmissionsScreenName.TRANSPORT_DETAILS>,
  BottomTabScreenProps<MainNavigatorParamList>
>) {
  const { transportActivityAPI, naiveAuthUserId } = useContext(AppContext);

  const [title, setTitle] = useState(toInitialTitle(route.params.mode));
  const [date, setDate] = useState(new Date());
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

  const handlePressSave = async () => {
    try {
      const { activityId, errors } = await transportActivityAPI.createTransportActivity({
        data: { title, date: date.toISOString(), ...totalEmissionsReducerState },
        options: { naiveAuthUserId },
      });
      if (errors) {
        Alert.alert("Failed to create transport activity", JSON.stringify(errors, null, 2));
      }
      if (activityId) {
        Alert.alert("Created transport activity", `ID: ${activityId}`, [
          { text: "OK", onPress: () => navigation.jumpTo(MainScreenName.DASHBOARD) },
        ]);
      }
    } catch (error) {
      console.error(
        "Unexpected error occurred trying to create transport activity",
        JSON.stringify({ error }, null, 2)
      );
    }
  };

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

type TotalEmissionReducerAction =
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
