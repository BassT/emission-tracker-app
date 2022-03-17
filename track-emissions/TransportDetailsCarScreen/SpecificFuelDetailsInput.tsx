import React from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { FuelType } from "../../api";
import { TotalEmissionReducerState, TotalEmissionReducerAction } from "./totalEmissionReducer";

export function SpecificFuelDetailsInput({
  totalEmissionsReducerState,
  dispatchTotalEmissionsReducerAction,
  specificFuelConsumption,
  setSpecificFuelConsumption,
  distance,
  setDistance,
}: {
  totalEmissionsReducerState: TotalEmissionReducerState;
  dispatchTotalEmissionsReducerAction: React.Dispatch<TotalEmissionReducerAction>;
  specificFuelConsumption: string;
  setSpecificFuelConsumption: React.Dispatch<React.SetStateAction<string>>;
  distance: string;
  setDistance: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  return (
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
  );
}
