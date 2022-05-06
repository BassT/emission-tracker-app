import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { FuelType } from "../../api";
import { FuelTypeButton } from "../shared/FuelTypeButton";
import { TotalEmissionReducerAction, TotalEmissionReducerState } from "./totalEmissionReducer";

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
        {[FuelType.Diesel, FuelType.Gasoline, FuelType.LPG, FuelType.CNG].map((fuelType) => (
          <FuelTypeButton
            key={fuelType}
            fuelType={fuelType}
            selectedFuelType={totalEmissionsReducerState.fuelType}
            onChange={(fuelType) => dispatchTotalEmissionsReducerAction({ type: "setFuelType", payload: { fuelType } })}
          />
        ))}
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
        right={<TextInput.Affix text={getSpecificFuelConsumptionUnit(totalEmissionsReducerState.fuelType)} />}
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

function getSpecificFuelConsumptionUnit(fuelType: FuelType) {
  if (fuelType === FuelType.CNG) return "kg / 100 km";
  return "l / 100 km";
}
