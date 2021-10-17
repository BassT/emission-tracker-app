import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useReducer, useState } from "react";
import { Reducer } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { NavigatorParamList, ScreenName } from "../navigation";
import { toInitialTitle } from "./TransportMode";

export function TransportDetailsScreen({
  route,
}: NativeStackScreenProps<NavigatorParamList, ScreenName.TRANSPORT_DETAILS>) {
  const [title, setTitle] = useState(toInitialTitle(route.params.mode));
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState(date.toLocaleDateString());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [specificEmissions, setSpecificEmissions] = useState("0.0");
  const [distance, setDistance] = useState("0.0");
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
  });

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
                <View style={{ marginTop: 16 }}>
                  <TextInput
                    label="Total emissions"
                    value={totalEmissionsReducerState.totalEmissions.toString()}
                    disabled
                    keyboardType="numeric"
                    selectTextOnFocus
                    right={<TextInput.Affix text="kg CO2" />}
                    style={{ marginBottom: 16 }}
                  />
                </View>
                <View style={{ display: "flex", alignItems: "flex-end" }}>
                  <Button
                    onPress={() =>
                      Alert.alert(
                        "Not yet implemented",
                        `Will save:\n${JSON.stringify(
                          {
                            title,
                            date,
                            ...totalEmissionsReducerState,
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

interface TotalEmissionReducerState {
  distance: number;
  specificEmissions: number;
  fuelType: FuelType;
  specificFuelConsumption: number;
  totalFuelConsumption: number;
  totalEmissions: number;
  calcMode: CalcMode;
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

type TotalEmissionReducerAction =
  | EmissionReducertSetDistanceAction
  | EmissionReducerSetSpecificEmissionsAction
  | EmissionReducerSetFuelTypeAction
  | EmissionReducerSetSpecificFuelConsumptionAction
  | EmissionReducerSetTotalFuelConsumptionAction
  | EmissionReducerSetCalcModeAction;

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
          totalEmissions:
            (state.specificFuelConsumption / 100) *
            action.payload.distance *
            getSpecificEmissionsByFuelType(state.fuelType),
          totalFuelConsumption: (state.specificFuelConsumption / 100) * action.payload.distance,
        };
      } else if (state.calcMode === CalcMode.SpecificEmissions) {
        return {
          ...state,
          distance: action.payload.distance,
          totalEmissions: (state.specificEmissions / 1000) * action.payload.distance,
        };
      }
      return state;
    case "setSpecificEmissions":
      if (state.calcMode === CalcMode.SpecificEmissions) {
        return {
          ...state,
          specificEmissions: action.payload.specificEmissions,
          totalEmissions: (action.payload.specificEmissions / 1000) * state.distance,
        };
      }
      return { ...state };
    case "setFuelType":
      if (state.calcMode === CalcMode.SpecificFuel) {
        return {
          ...state,
          fuelType: action.payload.fuelType,
          totalEmissions:
            (state.specificFuelConsumption / 100) *
            state.distance *
            getSpecificEmissionsByFuelType(action.payload.fuelType),
        };
      } else if (state.calcMode === CalcMode.TotalFuel) {
        return {
          ...state,
          fuelType: action.payload.fuelType,
          totalEmissions: state.totalFuelConsumption * getSpecificEmissionsByFuelType(action.payload.fuelType),
        };
      }
      return {
        ...state,
        fuelType: action.payload.fuelType,
      };
    case "setSpecificFuelConsumption":
      return {
        ...state,
        specificFuelConsumption: action.payload.specificFuelConsumption,
        totalEmissions:
          (action.payload.specificFuelConsumption / 100) *
          state.distance *
          getSpecificEmissionsByFuelType(state.fuelType),
      };
    case "setTotalFuelConsumption":
      return {
        ...state,
        totalFuelConsumption: action.payload.totalFuelConsumption,
        totalEmissions: action.payload.totalFuelConsumption * getSpecificEmissionsByFuelType(state.fuelType),
      };
    case "setCalcMode":
      // TODO refresh total emissions based on calc mode
      return { ...state, calcMode: action.payload.calcMode };
    default:
      return state;
  }
}

enum CalcMode {
  SpecificEmissions,
  TotalFuel,
  SpecificFuel,
}

enum FuelType {
  Diesel,
  Gasoline,
}

// const lpgSpecificEmissions = 1.64; // kg / l
// const cngSpecificEmissions = 2.79; // kg / kg

function getSpecificEmissionsByFuelType(fuelType: FuelType) {
  if (fuelType === FuelType.Diesel) return 2.33; // kg / l
  if (fuelType === FuelType.Gasoline) return 2.64; // kg / l
  return 0;
}
