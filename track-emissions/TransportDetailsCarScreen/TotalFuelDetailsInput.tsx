import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { FuelType } from "../../api";
import { FuelTypeButton } from "./FuelTypeButton";
import { TotalEmissionReducerAction, TotalEmissionReducerState } from "./totalEmissionReducer";

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
        {[FuelType.Diesel, FuelType.Gasoline, FuelType.LPG, FuelType.CNG].map((fuelType) => (
          <FuelTypeButton
            key={fuelType}
            fuelType={fuelType}
            totalEmissionsReducerState={totalEmissionsReducerState}
            dispatchTotalEmissionsReducerAction={dispatchTotalEmissionsReducerAction}
          />
        ))}
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
        right={<TextInput.Affix text={getFuelUnit(totalEmissionsReducerState.fuelType)} />}
        error={isNaN(parseFloat(totalFuelConsumption))}
      />
    </>
  );
}

function getFuelUnit(fuelType: FuelType) {
  if (fuelType === FuelType.CNG) return "kg";
  return "l";
}
