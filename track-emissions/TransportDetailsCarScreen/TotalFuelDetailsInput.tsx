import React from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { FuelType } from "../../api";
import { TotalEmissionReducerState, TotalEmissionReducerAction } from "./totalEmissionReducer";

export function TotalFuelDetailsInput({
  totalEmissionsReducerState,
  dispatchTotalEmissionsReducerAction,
  totalFuelConsumption,
  setTotalFuelConsumption,
}: {
  totalEmissionsReducerState: TotalEmissionReducerState;
  dispatchTotalEmissionsReducerAction: React.Dispatch<TotalEmissionReducerAction>;
  totalFuelConsumption: string;
  setTotalFuelConsumption: React.Dispatch<React.SetStateAction<string>>;
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
  );
}
